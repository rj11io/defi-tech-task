// Authentication is enforced by the explicit JWT middleware in middlewares/isAuth.js.
// Keep this hook for compatibility with the starter's Passport initialization boundary.
module.exports = passport => passport;
