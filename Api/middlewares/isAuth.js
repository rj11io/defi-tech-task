const jwt = require('jsonwebtoken');
const User = require('../models/user');
const Rt = require('../models/rt');
const { Unauthorized, MissingRefreshToken, ExpiredRefreshToken, UnauthorizedRefreshToken } = require('../helpers/response');

const isAuth = (req, res, next) => {
  // Check for token in cookies or Authorization header
  let token = req.cookies?.accessToken;
  
  if (!token) {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
  }
  
  if (!token) return next(Unauthorized());
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    return User.findById(decoded.id)
      .then(user => {
        if (!user || user.deleted === true || user.active === false) return next(Unauthorized());
        req.user = user;
        res.locals.user = user;
        return next();
      })
      .catch(() => next(Unauthorized()));
  } catch (error) {
    return next(Unauthorized());
  }
};

const isAuthRt = (req, res, next) => {
  const token = req.cookies?.refreshToken;
  if (!token) return next(MissingRefreshToken());
  try {
    const decoded = jwt.verify(token, process.env.RT_SECRET || process.env.JWT_SECRET || 'secret');
    return Rt.findOne({ token, user: decoded.id })
      .then(rt => {
        if (!rt) return next(UnauthorizedRefreshToken());
        if (rt.expires <= new Date()) return next(ExpiredRefreshToken());
        return User.findById(decoded.id).then(user => {
          if (!user || user.deleted === true) return next(Unauthorized());
          req.user = user;
          res.locals.user = user;
          return next();
        });
      })
      .catch(() => next(UnauthorizedRefreshToken()));
  } catch (error) {
    return next(UnauthorizedRefreshToken());
  }
};

const isAuthRtlogout = (req, res, next) => {
  return isAuth(req, res, next);
};

const isAuthChangePassword = (req, res, next) => {
  return next();
};

module.exports = {
  isAuth,
  isAuthRt,
  isAuthRtlogout,
  isAuthChangePassword
};
