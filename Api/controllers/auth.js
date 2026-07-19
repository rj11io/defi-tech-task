const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const Rt = require('../models/rt');
const {
  SendData,
  ServerError,
  NotFound,
  EmailAlreadyExists,
  DeletedAccount,
  Unauthorized,
  WrongEmail,
  WrongPassword,
  InactiveAccount
} = require('../helpers/response');
const { generateToken, clearTokens } = require('../helpers/auth');
const { changePasswordEmail, inviteEmail } = require('../emails');
const { langs, defaultLang } = require('../config');

const dbUser = email => User.findOne({ email }).setOptions({ internalGet: true });
const decodeChangeToken = token => jwt.verify(Buffer.from(token, 'base64url').toString(), process.env.JWT_SECRET);

exports.login = async ({ body: { email, password } }, res, next) => {
  try {
    const user =
      (await dbUser(email)) || (await User.findOne({ email, deleted: true }).setOptions({ internalGet: true }));
    if (!user) return next(WrongEmail());
    if (user.deleted) return next(DeletedAccount());
    if (!user.active) return next(InactiveAccount());
    const valid = await new Promise((resolve, reject) => {
      user.comparePassword(password, (err, ok) => (err ? reject(err) : resolve(ok)));
    });
    if (!valid) return next(WrongPassword());
    await generateToken(res, user);
    return next(SendData(user.response('cp')));
  } catch (err) {
    return next(ServerError(err));
  }
};

exports.check = async (req, res, next) =>
  next(SendData(req.user.response(['_id', 'fullname', 'lang', 'company', 'createdAt'])));

exports.checkIfEmailExists = async ({ params: { email } }, res, next) => {
  try {
    const user = await dbUser(email);
    return !user || user.deleted
      ? next(NotFound())
      : next(SendData({ message: 'Email exists!', id: user.id, email: user.email }));
  } catch (err) {
    return next(ServerError(err));
  }
};

exports.resendActivationEmail = async ({ body: { email } }, res, next) => {
  try {
    const user = await dbUser(email);
    return user && !user.deleted ? next(SendData()) : next(NotFound());
  } catch (err) {
    return next(ServerError(err));
  }
};

exports.register = async (req, res, next) => {
  try {
    const existing =
      (await dbUser(req.body.email)) ||
      (await User.findOne({ email: req.body.email, deleted: true }).setOptions({ internalGet: true }));
    if (existing?.deleted) return next(DeletedAccount());
    if (existing) return next(EmailAlreadyExists());
    const lang = langs.includes(req.body.lang) ? req.body.lang : defaultLang;
    const user = await new User({ ...req.body, lang: lang.toUpperCase(), active: true }).save();
    await generateToken(res, user);
    return next(SendData(user.response('cp')));
  } catch (err) {
    return next(ServerError(err));
  }
};

exports.invite = async ({ body }, { locals: { user } }, next) => {
  try {
    const existing = await dbUser(body.email);
    if (existing?.deleted) return next(DeletedAccount());
    if (existing) return next(EmailAlreadyExists());
    const newUser = await new User({
      ...body,
      active: false,
      authReset: new Date(),
      company: user.company,
      password: Math.random().toString(36).slice(-12)
    }).save();
    await inviteEmail(newUser);
    return next(SendData(newUser.response('cp')));
  } catch (err) {
    return next(ServerError(err));
  }
};

exports.refreshToken = async (req, res, next) => {
  try {
    await generateToken(res, res.locals.user);
    return next(SendData(res.locals.user.response('cp')));
  } catch (err) {
    return next(ServerError(err));
  }
};

exports.logout = async (req, res, next) => {
  try {
    await Rt.deleteMany({ user: req.user._id });
    clearTokens(res);
    return next(SendData({ message: 'Logout succesfully!' }));
  } catch (err) {
    return next(ServerError(err));
  }
};

exports.forgotPassword = async ({ body: { email } }, res, next) => {
  try {
    const user = await dbUser(email);
    if (user && !user.deleted) {
      user.authReset = new Date();
      await user.save();
      await changePasswordEmail(user);
    }
    return next(SendData({ message: 'If the account exists, a reset link has been sent.' }));
  } catch (err) {
    return next(ServerError(err));
  }
};

exports.restoreUser = async ({ body: { email } }, res, next) => {
  try {
    const user = await User.findOne({ email, deleted: true }).setOptions({ internalGet: true });
    if (!user || !user.deleted) return next(NotFound());
    await user.restore();
    return next(SendData());
  } catch (err) {
    return next(ServerError(err));
  }
};

exports.changePassword = async ({ params: { email, token }, body: { password } }, res, next) => {
  try {
    const decoded = decodeChangeToken(token);
    if (decoded.email !== email) return next(Unauthorized());
    if (!decoded.authReset || !['password-reset', 'invitation'].includes(decoded.purpose)) return next(Unauthorized());

    const resetNonce = new Date(decoded.authReset);
    if (Number.isNaN(resetNonce.getTime())) return next(Unauthorized());

    const passwordHash = await bcrypt.hash(password, 10);
    const updates = { password: passwordHash, authReset: null };
    if (decoded.purpose === 'invitation') updates.active = true;
    const user = await User.findOneAndUpdate(
      { email, authReset: resetNonce, deleted: { $ne: true } },
      { $set: updates },
      { new: true }
    ).setOptions({ internalGet: true });
    if (!user) return next(Unauthorized());

    await Rt.deleteMany({ user: user._id });
    return next(SendData({ message: 'Password changed successfully' }));
  } catch (err) {
    return next(Unauthorized());
  }
};
