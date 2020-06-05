/**
 * Get query from url
 * @param {*} req
 * @param {*} res
 * @param {*} next
 */
const requestFromQueryMiddleware = (req, res, next) => {
  const { query } = req;
  if (query) {
    if (query.location) {
      const location = req.query.location.split(',');
      req.body = {
        latitude: location[0],
        longitude: location[1]
      };
    }

    if (query.id) {
      const { id } = query;
      req.body = {
        id
      };
    }
  }

  next();
};

module.exports = requestFromQueryMiddleware;
