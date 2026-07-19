const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { Unauthorized } = require('../helpers/response');

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
        if (!user || user.deleted || !user.active) return next(Unauthorized());
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
  return isAuth(req, res, next);
};

const isAuthRtlogout = (req, res, next) => {
  return isAuth(req, res, next);
};

const isAuthChangePassword = (req, res, next) => {
  return isAuth(req, res, next);
};

module.exports = {
  isAuth,
  isAuthRt,
  isAuthRtlogout,
  isAuthChangePassword
};
