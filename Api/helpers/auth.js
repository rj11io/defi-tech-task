const jwt = require('jsonwebtoken');
const Rt = require('../models/rt');

const accessSecret = () => {
  if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET is required');
  return process.env.JWT_SECRET;
};

const changePasswordSecret = () => {
  if (!process.env.CHANGE_PASSWORD_SECRET) throw new Error('CHANGE_PASSWORD_SECRET is required');
  return process.env.CHANGE_PASSWORD_SECRET;
};

const genereteAuthToken = user => ({
  token: jwt.sign(
    {
      id: user._id.toString(),
      email: user.email,
      role: user.role || user.roles?.[0],
      purpose: 'access'
    },
    accessSecret(),
    { expiresIn: '24h' }
  )
});

const genereteChangePasswordToken = user => ({
  token: jwt.sign(
    {
      id: user._id.toString(),
      email: user.email,
      authReset: user.authReset || null,
      purpose: 'password-reset'
    },
    changePasswordSecret(),
    { expiresIn: '1h' }
  )
});

const generateToken = async (res, user) => {
  // Handle both real user objects and mock user objects
  const userId = user._id || user.id;
  const userEmail = user.email;
  const userRole = user.role || 'user';

  const accessToken = jwt.sign(
    {
      id: userId,
      email: userEmail,
      role: userRole,
      purpose: 'access'
    },
    accessSecret(),
    { expiresIn: '24h' }
  );

  const refreshToken = jwt.sign(
    {
      id: userId,
      email: userEmail,
      role: userRole,
      purpose: 'refresh'
    },
    process.env.RT_SECRET || accessSecret(),
    { expiresIn: '7d' }
  );

  // Set cookies
  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: 'lax'
  });

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    sameSite: 'lax'
  });

  res.cookie('logged', true, {
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: 'lax'
  });

  await Rt.deleteMany({ user: userId });
  await Rt.create({
    token: refreshToken,
    user: userId,
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  });

  return { accessToken, refreshToken };
};

const clearTokens = res => {
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');
  res.clearCookie('logged');
};

module.exports = {
  generateToken,
  clearTokens,
  genereteAuthToken,
  genereteChangePasswordToken,
  accessSecret,
  changePasswordSecret
};
