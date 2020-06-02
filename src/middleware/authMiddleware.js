const jwt = require('jsonwebtoken');

module.exports = (option) => async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    let decodedToken = '';

    switch (option.join()) {
      case 'admin':
        decodedToken = jwt.verify(token, process.env.JWT_SECRET_ADMIN);
        break;
      case 'user':
        decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        break;
      case 'admin,user':
      case 'user,admin':
        jwt.verify(token, process.env.JWT_SECRET,
          (err, decodedUserToken) => {
            if (err) {
              jwt.verify(token, process.env.JWT_SECRET_ADMIN,
                (error, decodedAdminToken) => {
                  if (error) {
                    throw error;
                  }

                  decodedToken = decodedAdminToken;
                });
            }

            return decodedUserToken;
          });
        break;
      default:
        throw new Error({
          name: 'JsonWebTokenError',
          message: 'invalid signature'
        });
    }

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
        message: 'Invalid token OR unauthorized request!'
      }
    });
  }
};
