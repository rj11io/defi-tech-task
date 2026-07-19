/**
 * Adds the request method and path to the request object for middleware that
 * needs to make Swagger-aware decisions. The previous generated file did not
 * export a middleware and blocked the API during startup.
 */
module.exports = () => (req, res, next) => {
  req.swagger = {
    method: req.method,
    path: req.path
  };

  return next();
};
