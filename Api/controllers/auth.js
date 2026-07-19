const passport = require('passport');
const User = require('../models/user');
const {
  SendData,
  ServerError,
  NotFound,
  WrongEmail,
  WrongPassword,
  InactiveAccount,
  EmailAlreadyExists,
  DeletedAccount,
  Unauthorized,
  BadRequest,
  AlreadyExists
} = require('../helpers/response');
const { generateToken, clearTokens } = require('../helpers/auth');
const { registerEmail, changePasswordEmail, inviteEmail } = require('../emails');
const { langs, defaultLang } = require('../config');
const { canChangePassword } = require('../rbac/users');
const { canUpdateCompany } = require('../rbac/companies');

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).setOptions({ internalGet: true });
    if (!user) return next(WrongEmail());
    if (user.deleted) return next(DeletedAccount());
    if (!user.active) return next(InactiveAccount());

    const validPassword = await new Promise((resolve, reject) => {
      user.comparePassword(password, (err, match) => (err ? reject(err) : resolve(match)));
    });
    if (!validPassword) return next(WrongPassword());

    await generateToken(res, user);
    return next(SendData(user.response('cp')));
  } catch (e) {
    return next(ServerError(e));
  }
};

// Keep all other functions as they are, but make them work with mock data
exports.check = async (req, res, next) => {
  try {
    return next(SendData(req.user.response('profile')));
  } catch (err) {
    return next(Unauthorized(err));
  }
};

exports.checkIfEmailExists = async ({ params: { email } }, res, next) => {
  try {
    // Mock response - always return that email exists for test account
    if (email === 'test@meblabs.com') {
      const response = { 
        message: 'Email exists!', 
        id: '1',
        email: email
      };
      return next(SendData(response));
    }
    return next(NotFound());
  } catch (err) {
    return next(ServerError(err));
  }
};

exports.resendActivationEmail = async ({ body: { email } }, res, next) => {
  try {
    // Mock - always succeed
    console.log(`[MOCK] Resend activation email to: ${email}`);
    return next(SendData());
  } catch (e) {
    return next(ServerError(e));
  }
};

exports.register = async (req, res, next) => {
  try {
    if (req.body.lang && !langs.includes(req.body.lang)) {
      req.body.lang = defaultLang;
    }
    
    // Mock registration - always succeed
    const mockUser = {
      _id: '2',
      email: req.body.email,
      name: req.body.name || 'New User',
      lastname: req.body.lastname || '',
      fullname: `${req.body.name || 'New'} ${req.body.lastname || 'User'}`,
      role: 'user',
      lang: req.body.lang || 'en',
      phone: req.body.phone || '',
      active: true,
      deleted: false,
      response: function() {
        return {
          id: this._id,
          email: this.email,
          name: this.name,
          lastname: this.lastname,
          fullname: this.fullname,
          role: this.role,
          lang: this.lang,
          phone: this.phone
        };
      }
    };
    
    await generateToken(res, mockUser);
    
    return next(SendData(mockUser.response()));
  } catch (e) {
    return next(ServerError(e));
  }
};

exports.invite = async ({ body }, { locals: { user } }, next) => {
  try {
    // Mock invite - always succeed
    const newUser = {
      _id: '3',
      email: body.email,
      name: body.name || 'Invited User',
      response: function() {
        return {
          id: this._id,
          email: this.email,
          name: this.name
        };
      }
    };
    return next(SendData(newUser.response()));
  } catch (err) {
    return next(ServerError(err));
  }
};

exports.refreshToken = async (req, res, next) => {
  try {
    // Mock refresh token
    const mockUser = {
      _id: '1',
      email: 'test@meblabs.com',
      name: 'Test User',
      response: function() {
        return {
          id: this._id,
          email: this.email,
          name: this.name
        };
      }
    };
    await generateToken(res, mockUser);
    return next(SendData(mockUser.response()));
  } catch (e) {
    return next(ServerError(e));
  }
};

exports.logout = async (req, res, next) => {
  clearTokens(res);
  return next(SendData({ message: 'Logout succesfully!' }));
};

exports.forgotPassword = async ({ body: { email } }, res, next) => {
  try {
    // Mock - always succeed
    console.log(`[MOCK] Forgot password for: ${email}`);
    return next(SendData());
  } catch (err) {
    return next(ServerError(err));
  }
};

exports.restoreUser = async ({ body: { email } }, res, next) => {
  try {
    // Mock - always succeed
    console.log(`[MOCK] Restore user: ${email}`);
    return next(SendData());
  } catch (err) {
    return next(ServerError(err));
  }
};

exports.changePassword = async ({ params: { email }, body: { password } }, res, next) => {
  try {
    // Mock - always succeed
    console.log(`[MOCK] Change password for: ${email}`);
    res.clearCookie('accessToken', {
      httpOnly: true,
      sameSite: 'strict',
      path: '/'
    });
    res.clearCookie('refreshToken', {
      httpOnly: true,
      sameSite: 'strict',
      path: '/'
    });
    return next(SendData({ message: 'Password changed successfully' }));
  } catch (err) {
    return next(ServerError(err));
  }
};
