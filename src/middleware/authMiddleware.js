const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET_STRING');
    const { userId } = decodedToken;

    if (req.body.userId && req.body.userId !== userId) {
      res.status(401).json({
        error: {
          message: 'Invalid user id!'
        }
      });
    } else {
      next();
    }
  } catch (error) {
    res.status(401).json({
      error: {
        message: 'Invalid OR Unauthorized request!'
      }
    });
  }
};
