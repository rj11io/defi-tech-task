const jwt = require('jsonwebtoken');
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
  InactiveAccount,
  MissingRefreshToken,
  ExpiredRefreshToken,
  UnauthorizedRefreshToken
} = require('../helpers/response');
const { generateToken, clearTokens } = require('../helpers/auth');
const { langs, defaultLang } = require('../config');

const dbUser = email => User.findOne({ email }).setOptions({ internalGet: true });
const decodeChangeToken = token => jwt.verify(Buffer.from(token, 'base64').toString(), process.env.JWT_SECRET || 'secret');
const usedChangeTokens = new Set();

exports.login = async ({ body: { email, password } }, res, next) => {
  try {
    const user = (await dbUser(email)) || (await User.findOne({ email, deleted: true }).setOptions({ internalGet: true }));
    if (!user) return next(WrongEmail());
    if (user.deleted) return next(DeletedAccount());
    if (!user.active) return next(InactiveAccount());
    const valid = await new Promise((resolve, reject) => user.comparePassword(password, (err, ok) => (err ? reject(err) : resolve(ok))));
    if (!valid) return next(WrongPassword());
    await generateToken(res, user);
    return next(SendData(user.response('cp')));
  } catch (err) {
    return next(ServerError(err));
  }
};

exports.check = async (req, res, next) => next(SendData(req.user.response(['_id', 'fullname', 'lang', 'company', 'createdAt'])));

exports.checkIfEmailExists = async ({ params: { email } }, res, next) => {
  try {
    const user = await dbUser(email);
    return !user || user.deleted ? next(NotFound()) : next(SendData({ message: 'Email exists!', id: user.id, email: user.email }));
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
    const existing = (await dbUser(req.body.email)) || (await User.findOne({ email: req.body.email, deleted: true }).setOptions({ internalGet: true }));
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
    const newUser = await new User({ ...body, active: false, company: user.company, password: Math.random().toString(36).slice(-12) }).save();
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
    if (!user || user.deleted) return next(NotFound());
    user.authReset = new Date();
    await user.save();
    return next(SendData());
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
    if (usedChangeTokens.has(token)) return next(Unauthorized());
    const decoded = decodeChangeToken(token);
    if (decoded.email !== email) return next(Unauthorized());
    const user = await dbUser(email);
    if (!user || user.deleted || (user.authReset && decoded.authReset !== user.authReset.toISOString())) return next(Unauthorized());
    user.password = password;
    user.authReset = null;
    await user.save();
    usedChangeTokens.add(token);
    return next(SendData({ message: 'Password changed successfully' }));
  } catch (err) {
    return next(Unauthorized());
  }
};
