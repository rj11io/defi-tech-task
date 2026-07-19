const { sprintf } = require('sprintf-js');

const { genereteChangePasswordToken } = require('../helpers/auth');
const { send, getEmailText } = require('./core');

const { NAME } = process.env;
const websiteUrl = process.env.WEBSITE_URL || process.env.CORS_ORIGIN || 'http://localhost';

const changePasswordLink = (user, token) =>
  `${websiteUrl}/changePassword/${encodeURIComponent(user.email)}/${Buffer.from(token).toString('base64url')}`;

module.exports.registerEmail = async (to, lang, name) => {
  const locale = getEmailText(lang, 'register');

  return send({
    to: [to],
    subject: sprintf(locale.subject, NAME),
    body: sprintf(locale.text, name)
  });
};

module.exports.changePasswordEmail = async (user, restore = false) => {
  const locale = getEmailText(user.lang, restore ? 'restoreUser' : 'changePassword');
  const { token } = genereteChangePasswordToken(user);
  const link = changePasswordLink(user, token);

  return send({
    to: [user.email],
    subject: sprintf(locale.subject, NAME),
    body: sprintf(locale.text, NAME, link)
  });
};

module.exports.inviteEmail = async user => {
  const locale = getEmailText(user.lang, 'invite');

  const { token } = genereteChangePasswordToken(user, 'invitation');
  const link = changePasswordLink(user, token);

  return send({
    to: [user.email],
    subject: sprintf(locale.subject, NAME),
    body: sprintf(locale.text, NAME, link)
  });
};
