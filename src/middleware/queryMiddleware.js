/**
 * Get Location query from url
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const requestFromQueryMiddleware = (req, res, next) => {
  if (req.query) {
    const location = req.query.location.split(',');
    req.body = {
      latitude: location[0],
      longitude: location[1]
    };
  }

  next();
};

module.exports = requestFromQueryMiddleware;
