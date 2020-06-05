const jwt = require('jsonwebtoken');

/**
 * Sign the token for the user
 * @param {Object} user
 * @param {String} type
 */
exports.signToken = (user, type = 'user') => {
  switch (type.toLowerCase()) {
    case 'admin':
      return jwt.sign({ user },
        process.env.JWT_SECRET_ADMIN,
        { expiresIn: '1.5 hrs' });
    default:
      return jwt.sign({ user },
        process.env.JWT_SECRET,
        { expiresIn: '1.5 hrs' });
  }
};

/**
 * Generate access token for the user
 * @param {String} userId
 * @param {String} type
 */
exports.generateAccessToken = (userId, type = 'user') => {
  switch (type.toLowerCase()) {
    case 'admin':
      return jwt.sign({ userId },
        process.env.JWT_SECRET_ADMIN,
        { expiresIn: '1.5 hrs' });
    default:
      return jwt.sign({ userId },
        process.env.JWT_SECRET,
        { expiresIn: '1.5 hrs' });
  }
};

/**
 * Verify the token sent
 *
 * @param {String} token
 * @param {String} secret
 */
const verifyToken = (token, secret) => jwt.verify(token, secret, (error, decoded) => {
  if (error) {
    throw error;
  }

  return decoded;
});

/**
 * Define the authentication type to use
 *
 * admin, user, or ['admin','user']
 * @param {String | Array} option
 */
exports.auth = (option) => async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    let decodedToken = '';

    switch (Array.isArray(option) ? option.join() : option) {
      case 'admin':
        decodedToken = verifyToken(token, process.env.JWT_SECRET_ADMIN);
        break;
      case 'user':
        decodedToken = verifyToken(token, process.env.JWT_SECRET);
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
        throw new Error('Error could be Wrong auth option | JsonWebTokenError | invalid signature | jwt malformed');
    }

    const { userId } = decodedToken;

    if (req.body.userId && req.body.userId !== userId) {
      res.status(401).json({
        error: {
          message: 'Invalid token OR unauthorized request!'
        }
      });
    } else {
      next();
    }
  } catch (error) {
    res.status(500).json({
      error: {
        message: error.message
      }
    });
  }
};
