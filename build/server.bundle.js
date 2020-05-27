/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/server.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/app.js":
/*!********************!*\
  !*** ./src/app.js ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/* eslint-disable no-console */\r\nconst express = __webpack_require__(/*! express */ \"express\");\r\nconst bodyParser = __webpack_require__(/*! body-parser */ \"body-parser\");\r\nconst cookieParser = __webpack_require__(/*! cookie-parser */ \"cookie-parser\");\r\nconst cors = __webpack_require__(/*! cors */ \"cors\");\r\nconst mongoose = __webpack_require__(/*! mongoose */ \"mongoose\");\r\nconst dotenv = __webpack_require__(/*! dotenv */ \"dotenv\");\r\nconst passport = __webpack_require__(/*! ./middleware/passportMiddleware */ \"./src/middleware/passportMiddleware.js\");\r\nconst userRoutes = __webpack_require__(/*! ./routes/user */ \"./src/routes/user.js\");\r\nconst reportRoutes = __webpack_require__(/*! ./routes/report */ \"./src/routes/report.js\");\r\nconst responeUnitRoutes = __webpack_require__(/*! ./routes/responseUnit */ \"./src/routes/responseUnit.js\");\r\n\r\ndotenv.config();\r\n\r\nconst app = express();\r\n\r\nmongoose\r\n  .connect('mongodb+srv://ersAdmin:Admin123@@ers-m0o8p.mongodb.net/ers?retryWrites=true&w=majority',\r\n    {\r\n      useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true\r\n    })\r\n  .then(() => {\r\n    console.log('Successfully connected to MongoDB Atlas!');\r\n  }).catch((error) => {\r\n    console.log('Unable to connect to MongoDB Atlas!');\r\n    console.error(error);\r\n  });\r\n\r\napp.use(cors());\r\napp.use(bodyParser.json());\r\napp.use(cookieParser());\r\napp.use(passport.initialize());\r\napp.use(passport.session());\r\n\r\napp.use((req, res, next) => {\r\n  res.setHeader('Access-Control-Allow-Origin', '*');\r\n  res.setHeader(\r\n    'Access-Control-Allow-Headers',\r\n    'Origin, X-Requested-Width, Content, Accept, Content-Type, Authorization'\r\n  );\r\n  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');\r\n  next();\r\n});\r\n\r\napp.use((req, res, next) => {\r\n  if (!req.body) {\r\n    res.status(404).send('Resource not found.');\r\n  } else {\r\n    next();\r\n  }\r\n});\r\n\r\napp.get('/api', (req, res) => {\r\n  res.status(200).json({\r\n    message: 'Welcome'\r\n  });\r\n});\r\napp.use('/api/auth', userRoutes);\r\napp.use('/api/report', reportRoutes);\r\napp.use('/api/response-unit', responeUnitRoutes);\r\n\r\napp.use((err, req, res, next) => {\r\n  if (res.headersSent) {\r\n    return;\r\n  }\r\n\r\n  if (err) {\r\n    res.status(err.status || 500).json({\r\n      error: err.message || 'Internal Server Error'\r\n    });\r\n  }\r\n\r\n  next();\r\n});\r\n\r\nmodule.exports = app;\r\n\n\n//# sourceURL=webpack:///./src/app.js?");

/***/ }),

/***/ "./src/controllers/reportController.js":
/*!*********************************************!*\
  !*** ./src/controllers/reportController.js ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const Report = __webpack_require__(/*! ../models/report */ \"./src/models/report.js\");\r\n// const mapService = require('../services/map.service');\r\n\r\nexports.createReport = (req, res) => {\r\n  const { reporter, location, imageUrl } = req.body;\r\n\r\n  const report = new Report({\r\n    reporter: {\r\n      userId: reporter.userId,\r\n      phoneNo: reporter.phoneNo\r\n    },\r\n    location: {\r\n      latitude: location.latitude,\r\n      longitude: location.longitude\r\n    },\r\n    imageUrl\r\n  });\r\n\r\n  report.save().then(() => {\r\n    res.status(200).json({\r\n      message: 'Report logged successfully!'\r\n    });\r\n  })\r\n    .catch((error) => {\r\n      res.status(500).json({\r\n        error\r\n      });\r\n    });\r\n\r\n  // TODO tie in mapService\r\n};\r\n\r\nexports.getReport = (req, res) => {\r\n  Report.findOne({\r\n    _id: req.params.id\r\n  })\r\n    .then((report) => {\r\n      res.status(200).json({\r\n        report\r\n      });\r\n    })\r\n    .catch((error) => {\r\n      res.status(404).json({\r\n        error\r\n      });\r\n    });\r\n};\r\n\r\nexports.modifyReport = (req, res) => {\r\n  const report = new Report({\r\n    _id: req.params.id\r\n  });\r\n\r\n  // TODO: Update Report Properties\r\n\r\n  Report.updateOne({ _id: req.params.id }, report)\r\n    .then(() => {\r\n      res.status(201).json({\r\n        message: 'Report updated successfully'\r\n      });\r\n    }).catch((error) => {\r\n      res.status(400).json({\r\n        error\r\n      });\r\n    });\r\n};\r\n\r\nexports.deleteReport = (req, res) => {\r\n  Report.findOne({ _id: req.params.id })\r\n    .then(() => {\r\n      // TODO: delete report image and delete report\r\n\r\n      Report.deleteOne({ _id: req.params.id })\r\n        .then(() => {\r\n          res.status(200).json({\r\n            message: 'Report deleted successfully!'\r\n          });\r\n        }).catch((error) => {\r\n          res.status(400).json({\r\n            error\r\n          });\r\n        });\r\n    }).catch((error) => {\r\n      res.status(404).json({\r\n        error\r\n      });\r\n    });\r\n};\r\n\r\nexports.getReports = (req, res) => {\r\n  Report.find().then((reports) => {\r\n    res.status(200).json({\r\n      reports\r\n    });\r\n  })\r\n    .catch((error) => {\r\n      res.status(400).json({\r\n        error\r\n      });\r\n    });\r\n};\r\n\n\n//# sourceURL=webpack:///./src/controllers/reportController.js?");

/***/ }),

/***/ "./src/controllers/responseUnitController.js":
/*!***************************************************!*\
  !*** ./src/controllers/responseUnitController.js ***!
  \***************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/* eslint-disable no-underscore-dangle */\r\nconst bcrypt = __webpack_require__(/*! bcrypt */ \"bcrypt\");\r\nconst jwt = __webpack_require__(/*! jsonwebtoken */ \"jsonwebtoken\");\r\nconst _ = __webpack_require__(/*! lodash */ \"lodash\");\r\nconst ResponseUnit = __webpack_require__(/*! ../models/responseUnit */ \"./src/models/responseUnit.js\");\r\n\r\nexports.signup = (req, res) => {\r\n  bcrypt.hash(req.body.password, 10).then((hash) => {\r\n    const responseUnit = new ResponseUnit({\r\n      name: req.body.name,\r\n      email: req.body.email,\r\n      contact: {\r\n        primaryPhoneNo: req.body.contact.primaryPhoneNo,\r\n        secondaryPhoneNo: req.body.contact.secondaryPhoneNo,\r\n        primaryAddress: req.body.contact.primaryAddress,\r\n        secondaryAddress: req.body.contact.secondaryAddress,\r\n        website: req.body.contact.website\r\n      },\r\n      password: hash\r\n    });\r\n\r\n    responseUnit.save().then(() => {\r\n      res.status(201).json({\r\n        message: 'Registration successful!'\r\n      });\r\n    }).catch((error) => {\r\n      res.status(500).json({\r\n        error\r\n      });\r\n    });\r\n  });\r\n};\r\n\r\nexports.login = (req, res) => {\r\n  ResponseUnit.findOne({ email: req.body.email }).then((responseUnit) => {\r\n    if (!responseUnit) {\r\n      res.status(401).json({\r\n        error: new Error('Username/Email not found!')\r\n      });\r\n    } else {\r\n      bcrypt.compare(req.body.password, responseUnit.password).then((valid) => {\r\n        if (!valid) {\r\n          return res.status(401).json({\r\n            error: new Error('Incorrect password!')\r\n          });\r\n        }\r\n\r\n        const token = jwt.sign({ responseUnitId: responseUnit._id },\r\n          'RANDOM_TOKEN_SECRET_STRING',\r\n          { expiresIn: '1h' });\r\n\r\n        return res.status(200).json({\r\n          responseUnit: _.omit(responseUnit.toObject(), ['password', '__v', 'createdAt', 'updatedAt']),\r\n          token\r\n        });\r\n      }).catch((error) => {\r\n        res.status(500).json({\r\n          error\r\n        });\r\n      });\r\n    }\r\n  }).catch((error) => {\r\n    res.status(500).json({\r\n      error\r\n    });\r\n  });\r\n};\r\n\r\nexports.getResponseUnit = (req, res) => {\r\n  ResponseUnit.findOne({ _id: req.params.id }, { password: 0 }).then((responseUnit) => {\r\n    res.status(200).json({\r\n      responseUnit\r\n    });\r\n  }).catch((error) => {\r\n    res.status(404).json({\r\n      error\r\n    });\r\n  });\r\n};\r\n\r\nexports.getAllResponseUnits = (req, res) => {\r\n  ResponseUnit.find().select('-password').then((responseUnits) => {\r\n    res.status(200).json({\r\n      responseUnits\r\n    });\r\n  }).catch((error) => {\r\n    res.status(500).json({\r\n      error\r\n    });\r\n  });\r\n};\r\n\r\nexports.updateResponseUnit = (req, res) => {\r\n  const responseUnit = new ResponseUnit({\r\n    _id: req.params.id,\r\n    name: req.body.name,\r\n    contact: {\r\n      primaryPhoneNo: req.body.contact.primaryPhoneNo,\r\n      secondaryPhoneNo: req.body.contact.secondaryPhoneNo,\r\n      primaryAddress: req.body.contact.primaryAddress,\r\n      secondaryAddress: req.body.contact.secondaryAddress,\r\n      website: req.body.contact.website\r\n    }\r\n  });\r\n\r\n  ResponseUnit.updateOne({ _id: req.params.id }, responseUnit)\r\n    .then(() => {\r\n      res.status(201).json({\r\n        message: 'Response Unit details updated successfully!'\r\n      });\r\n    })\r\n    .catch((error) => {\r\n      res.status(500).json({\r\n        error\r\n      });\r\n    });\r\n};\r\n\r\n// TODO: Reponse Unit - DELETE\r\n\r\n// TODO: Reponse Unit - UPDATE PASSWORD\r\n\n\n//# sourceURL=webpack:///./src/controllers/responseUnitController.js?");

/***/ }),

/***/ "./src/controllers/userController.js":
/*!*******************************************!*\
  !*** ./src/controllers/userController.js ***!
  \*******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/* eslint-disable no-underscore-dangle */\r\nconst bcrypt = __webpack_require__(/*! bcrypt */ \"bcrypt\");\r\nconst jwt = __webpack_require__(/*! jsonwebtoken */ \"jsonwebtoken\");\r\nconst _ = __webpack_require__(/*! lodash */ \"lodash\");\r\nconst passport = __webpack_require__(/*! ../middleware/passportMiddleware */ \"./src/middleware/passportMiddleware.js\");\r\nconst User = __webpack_require__(/*! ../models/user */ \"./src/models/user.js\");\r\n\r\nconst signToken = (user) => jwt.sign({ user },\r\n  process.env.JWT_SECRET,\r\n  { expiresIn: '1.5 hrs' });\r\n\r\nconst generateAccessToken = (userId) => jwt.sign({ userId },\r\n  process.env.JWT_SECRET,\r\n  { expiresIn: '1.5 hrs' });\r\n\r\nexports.signup = (req, res) => {\r\n  bcrypt.hash(req.body.password, 10).then((hash) => {\r\n    const user = new User({\r\n      name: req.body.name,\r\n      email: req.body.email,\r\n      phoneNo: req.body.phoneNo,\r\n      emergencyContact: {\r\n        name: req.body.emergencyContact.name,\r\n        phoneNo: req.body.emergencyContact.phoneNo\r\n      },\r\n      password: hash\r\n    });\r\n\r\n    user.save().then((createdUser) => {\r\n      const token = generateAccessToken(createdUser._id);\r\n      res.status(201).json({\r\n        message: 'Registration successful!',\r\n        token\r\n      });\r\n    }).catch((error) => {\r\n      res.status(500).json({\r\n        error\r\n      });\r\n    });\r\n  });\r\n};\r\n\r\nexports.login = (req, res) => {\r\n  User.findOne({ email: req.body.email }).then((user) => {\r\n    if (!user) {\r\n      res.status(401).json({\r\n        error: new Error('Username/Email not found!')\r\n      });\r\n    } else {\r\n      bcrypt.compare(req.body.password, user.password).then((valid) => {\r\n        if (!valid) {\r\n          return res.status(401).json({\r\n            error: new Error('Incorrect password!')\r\n          });\r\n        }\r\n\r\n        const token = generateAccessToken(user._id);\r\n\r\n        return res.status(200).json({\r\n          userId: _.omit(user.toObject(), ['password', '__v', 'createdAt', 'modifiedAt']),\r\n          token\r\n        });\r\n      }).catch((error) => {\r\n        res.status(500).json({\r\n          error\r\n        });\r\n      });\r\n    }\r\n  }).catch((error) => {\r\n    res.status(500).json({\r\n      error\r\n    });\r\n  });\r\n};\r\n\r\nexports.profile = (req, res) => {\r\n  User.findById(req.params.id)\r\n    .then((user) => {\r\n      if (user) {\r\n        return res.status(200).json({\r\n          user\r\n        });\r\n      }\r\n\r\n      return res.status(404).json({\r\n        error: 'User not found.'\r\n      });\r\n    })\r\n    .catch((error) => {\r\n      res.status(500).json({\r\n        error\r\n      });\r\n    });\r\n};\r\n\r\nexports.edit = (req, res) => {\r\n  const user = new User({\r\n    _id: req.params.id,\r\n    name: req.body.name,\r\n    phoneNo: req.body.phoneNo,\r\n    emergencyContact: {\r\n      name: req.body.emergencyContact.name,\r\n      phoneNo: req.body.emergencyContact.phoneNo\r\n    }\r\n  });\r\n\r\n  User.updateOne({ _id: req.params.id }, user)\r\n    .then(() => {\r\n      res.status(201).json({\r\n        message: 'Profile updated successfully!'\r\n      });\r\n    })\r\n    .catch((error) => {\r\n      res.status(400).json({\r\n        error\r\n      });\r\n    });\r\n};\r\n\r\n// TODO: User - DELETE PROFILE\r\n\r\n// TODO: User - UPDATE PASSWORD\r\n\r\nexports.facebookLogin = (req, res, next) => {\r\n  passport.authenticate('facebook', { scope: ['email'] })(req, res);\r\n\r\n  return next();\r\n};\r\n\r\nexports.facebookLoginSuccess = (req, res) => {\r\n  res.status(200)\r\n    .cookie('jwt', signToken(req.user), {\r\n      httpOnly: true\r\n    })\r\n    .json({\r\n      message: 'Facebook authentication successful!'\r\n    });\r\n};\r\n\r\nexports.facebookLoginFail = (req, res) => {\r\n  res.status(401).json({\r\n    error: 'Facebook authentication failed!'\r\n  });\r\n};\r\n\r\nexports.googleLogin = (req, res, next) => {\r\n  passport.authenticate('google', {\r\n    scope: ['https://www.googleapis.com/auth/userinfo.profile', 'https://www.googleapis.com/auth/userinfo.email']\r\n  })(req, res);\r\n\r\n  next();\r\n};\r\n\r\nexports.googleLoginSuccess = (req, res) => {\r\n  res.status(200)\r\n    .cookie('jwt', signToken(req.user), {\r\n      httpOnly: true\r\n    })\r\n    .json({\r\n      message: 'Google authentication successful!'\r\n    });\r\n};\r\n\r\nexports.googleLoginFail = (req, res) => {\r\n  res.status(401).json({\r\n    error: 'Google authentication failed!'\r\n  });\r\n};\r\n\n\n//# sourceURL=webpack:///./src/controllers/userController.js?");

/***/ }),

/***/ "./src/middleware/authMiddleware.js":
/*!******************************************!*\
  !*** ./src/middleware/authMiddleware.js ***!
  \******************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const jwt = __webpack_require__(/*! jsonwebtoken */ \"jsonwebtoken\");\r\n\r\nmodule.exports = (req, res, next) => {\r\n  try {\r\n    const token = req.headers.authorization.split(' ')[1];\r\n    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);\r\n    const { userId } = decodedToken;\r\n\r\n    if (req.body.userId && req.body.userId !== userId) {\r\n      res.status(401).json({\r\n        error: {\r\n          message: 'Invalid user id!'\r\n        }\r\n      });\r\n    } else {\r\n      next();\r\n    }\r\n  } catch (error) {\r\n    res.status(401).json({\r\n      error: {\r\n        message: 'Invalid OR Unauthorized request!'\r\n      }\r\n    });\r\n  }\r\n};\r\n\n\n//# sourceURL=webpack:///./src/middleware/authMiddleware.js?");

/***/ }),

/***/ "./src/middleware/passportMiddleware.js":
/*!**********************************************!*\
  !*** ./src/middleware/passportMiddleware.js ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/* eslint-disable no-underscore-dangle */\r\nconst passport = __webpack_require__(/*! passport */ \"passport\");\r\nconst FacebookStrategy = __webpack_require__(/*! passport-facebook */ \"passport-facebook\").Strategy;\r\nconst GoogleStrategy = __webpack_require__(/*! passport-google-oauth */ \"passport-google-oauth\").OAuth2Strategy;\r\nconst User = __webpack_require__(/*! ../models/user */ \"./src/models/user.js\");\r\n__webpack_require__(/*! dotenv */ \"dotenv\").config();\r\n\r\n// Configure Passport authenticated session\r\npassport.serializeUser((user, done) => {\r\n  done(null, user);\r\n});\r\n\r\npassport.deserializeUser((obj, done) => {\r\n  done(null, obj);\r\n});\r\n\r\n// Configure Passport to use Facebook strategy\r\npassport.use(new FacebookStrategy({\r\n  clientID: process.env.FB_APP_ID,\r\n  clientSecret: process.env.FB_APP_SECRET,\r\n  callbackURL: process.env.FB_CALLBACK_URL,\r\n  profileFields: ['id', 'displayName', 'name', 'emails', 'gender'],\r\n  passReqToCallback: true\r\n}, (req, accessToken, refreshToken, profile, done) => {\r\n  const {\r\n    id, email, first_name: firstName, last_name: lastName\r\n  } = profile._json;\r\n\r\n  // Check Db to find a user with the id\r\n  User.findOne({ providerId: id }).then((user) => {\r\n    if (!user) { // if no user create new user\r\n      const newUser = new User({\r\n        name: `${firstName} ${lastName}`,\r\n        email,\r\n        provider: 'facebook',\r\n        providerId: id,\r\n        providerData: {\r\n          accessToken,\r\n          refreshToken\r\n        }\r\n      });\r\n\r\n      return newUser.save()\r\n        .then(() => done(null, newUser))\r\n        .catch((error) => done(error, null, error.message));\r\n    }\r\n\r\n    return done(null, user);\r\n  }).catch((error) => done(error));\r\n}));\r\n\r\n// Configure Passport to use Google Strategy\r\npassport.use(new GoogleStrategy({\r\n  clientID: process.env.GOOGLE_CLIENT_ID,\r\n  clientSecret: process.env.GOOGLE_CLIENT_SECRET,\r\n  callbackURL: process.env.GOOGLE_CALLBACK_URL\r\n}, (accessToken, refreshToken, profile, done) => {\r\n  const {\r\n    id, displayName, emails, provider\r\n  } = profile;\r\n\r\n  const verifiedEmail = emails.find((email) => email.verified).value || emails[0].value;\r\n\r\n  // Check the database if the providerId or email exists\r\n  User.findOne().or([{ providerId: id }, { email: verifiedEmail }])\r\n    .then((user) => {\r\n      if (!user) {\r\n        const newUser = new User({\r\n          name: displayName,\r\n          email: verifiedEmail,\r\n          provider,\r\n          providerId: id,\r\n          providerData: {\r\n            accessToken,\r\n            refreshToken\r\n          }\r\n        });\r\n\r\n        newUser.save()\r\n          .then(() => done(null, newUser))\r\n          .catch((error) => {\r\n            done(error, null);\r\n          });\r\n      }\r\n      done(null, user);\r\n    })\r\n    .catch((error) => done(error, null));\r\n}));\r\n\r\nmodule.exports = passport;\r\n\n\n//# sourceURL=webpack:///./src/middleware/passportMiddleware.js?");

/***/ }),

/***/ "./src/middleware/validationMiddleware.js":
/*!************************************************!*\
  !*** ./src/middleware/validationMiddleware.js ***!
  \************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const joi = __webpack_require__(/*! @hapi/joi */ \"@hapi/joi\");\r\n\r\nconst userSchema = joi.object({\r\n  name: joi.string().pattern(/^[_A-z0-9]*((-|\\s)*[_A-z0-9])*$/).required(),\r\n  email: joi.string().email().required(),\r\n  password: joi.string().min(6).max(15).required(),\r\n  phoneNo: joi.string().pattern(/^([0-9])\\d{10}$/).required(),\r\n  emergencyContact: joi.object({\r\n    name: joi.string().pattern(/^[_A-z0-9]*((-|\\s)*[_A-z0-9])*$/).required(),\r\n    phoneNo: joi.string().pattern(/^([0-9])\\d{10}$/).disallow(joi.ref('/phoneNo')).required()\r\n  })\r\n}).options({ stripUnknown: true });\r\n\r\nconst reportSchema = joi.object({\r\n  reporter: joi.object().keys({\r\n    phoneNo: joi.string().pattern(/^([0-9])\\d{10}$/).required(),\r\n    userId: joi.string().required()\r\n  }),\r\n  location: joi.object({\r\n    latitude: joi.string().required(),\r\n    longitude: joi.string().required()\r\n  })\r\n}).options({ stripUnknown: true });\r\n\r\nconst responseUnitSchema = joi.object({\r\n  name: joi.string().required(),\r\n  email: joi.string().email().required(),\r\n  password: joi.string().min(6).max(15).required(),\r\n  contact: joi.object({\r\n    primaryPhoneNo: joi.string().pattern(/^([0-9])\\d{10}$/).required(),\r\n    secondaryPhoneNo: joi.string().pattern(/^([0-9])\\d{10}$/).disallow(joi.ref('primaryPhoneNo')).required(),\r\n    primaryAddress: joi.string().max(255),\r\n    secondaryAddress: joi.string().disallow(joi.ref('primaryAddress')).max(255).allow(''),\r\n    website: joi.string().pattern(/^(http:\\/\\/www\\.|https:\\/\\/www\\.|http:\\/\\/|https:\\/\\/)?[a-z0-9]+([-.]{1}[a-z0-9]+)*\\.[a-z]{2,5}(:[0-9]{1,5})?(\\/.*)?$/).max(255).allow('')\r\n  })\r\n}).options({ stripUnknown: true });\r\n\r\nconst victimLocationSchema = joi.object().keys({\r\n  latitude: joi.number().required(),\r\n  longitude: joi.number().required()\r\n});\r\n\r\nconst responseUnitsSchema = joi.array().min(1).items(joi.object().keys({\r\n  latitude: joi.number().required(),\r\n  longitude: joi.number().required()\r\n})).required();\r\n\r\nconst userValidation = (req, res, next) => {\r\n  const { error } = userSchema.validate(req.body);\r\n\r\n  if (error) {\r\n    return res.status(422).json({\r\n      message: 'Please review the required fields!',\r\n      error\r\n    });\r\n  }\r\n\r\n  return next();\r\n};\r\n\r\nconst reportValidation = (req, res, next) => {\r\n  const { error } = reportSchema.validate(req.body);\r\n\r\n  if (error) {\r\n    return res.status(422).json({\r\n      message: 'Invalid data schema.',\r\n      error\r\n    });\r\n  }\r\n\r\n  return next();\r\n};\r\n\r\nconst responseUnitValidation = (req, res, next) => {\r\n  const { error } = responseUnitSchema.validate(req.body);\r\n\r\n  if (error) {\r\n    return res.status(422).json({\r\n      message: 'Invalid data schema.',\r\n      error\r\n    });\r\n  }\r\n\r\n  return next();\r\n};\r\n\r\nconst coordinatesValidation = (victimCoord, responseUnitCoord, next) => {\r\n  const { error: victimCoordinatesError } = victimLocationSchema.validate(victimCoord);\r\n  const { error: responseUnitCoordinatesError } = responseUnitsSchema.validate(responseUnitCoord);\r\n\r\n  if (victimCoordinatesError) {\r\n    return {\r\n      message: 'Invalid user coordinates schema',\r\n      error: victimCoordinatesError\r\n    };\r\n  }\r\n\r\n  if (responseUnitCoordinatesError) {\r\n    return {\r\n      message: 'Invalid responseUnit coordinates schema',\r\n      error: responseUnitCoordinatesError\r\n    };\r\n  }\r\n\r\n  return next();\r\n};\r\n\r\nmodule.exports = {\r\n  userValidation,\r\n  reportValidation,\r\n  responseUnitValidation,\r\n  coordinatesValidation\r\n};\r\n\n\n//# sourceURL=webpack:///./src/middleware/validationMiddleware.js?");

/***/ }),

/***/ "./src/models/report.js":
/*!******************************!*\
  !*** ./src/models/report.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const mongoose = __webpack_require__(/*! mongoose */ \"mongoose\");\r\nconst uniqueValidator = __webpack_require__(/*! mongoose-unique-validator */ \"mongoose-unique-validator\");\r\n\r\nconst reportSchema = mongoose.Schema({\r\n  reporter: {\r\n    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },\r\n    phoneNo: { type: String, required: true }\r\n  },\r\n  location: {\r\n    latitude: { type: String, required: true },\r\n    longitude: { type: String, required: true }\r\n  },\r\n  imageUrl: { type: String },\r\n  response: {\r\n    status: { type: String, default: 'Respone Pending' },\r\n    responder: { type: mongoose.Schema.Types.ObjectId, ref: 'responders' },\r\n    recievedAt: { type: Date },\r\n    etaToLocation: { type: Number },\r\n    arrivedAt: { type: Date }\r\n  }\r\n}, { timestamps: true });\r\n\r\nreportSchema.plugin(uniqueValidator);\r\n\r\nmodule.exports = mongoose.model('Report', reportSchema);\r\n\n\n//# sourceURL=webpack:///./src/models/report.js?");

/***/ }),

/***/ "./src/models/responseUnit.js":
/*!************************************!*\
  !*** ./src/models/responseUnit.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const mongoose = __webpack_require__(/*! mongoose */ \"mongoose\");\r\nconst uniqueValidator = __webpack_require__(/*! mongoose-unique-validator */ \"mongoose-unique-validator\");\r\n\r\nconst responseUnitSchema = mongoose.Schema({\r\n  name: { type: String, required: true },\r\n  email: { type: String, required: true, unique: true },\r\n  password: { type: String, required: true },\r\n  contact: {\r\n    primaryPhoneNo: { type: String, required: true, unique: true },\r\n    secondaryPhoneNo: { type: String, unique: true },\r\n    primaryAddress: { type: String },\r\n    secondaryAddress: { type: String },\r\n    website: { type: String, unique: true }\r\n  }\r\n}, { timestamps: true });\r\n\r\nresponseUnitSchema.plugin(uniqueValidator);\r\n\r\nmodule.exports = mongoose.model('ResponseUnit', responseUnitSchema);\r\n\n\n//# sourceURL=webpack:///./src/models/responseUnit.js?");

/***/ }),

/***/ "./src/models/user.js":
/*!****************************!*\
  !*** ./src/models/user.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const mongoose = __webpack_require__(/*! mongoose */ \"mongoose\");\r\nconst uniqueValidator = __webpack_require__(/*! mongoose-unique-validator */ \"mongoose-unique-validator\");\r\n\r\nconst userSchema = mongoose.Schema({\r\n  name: { type: String, required: true },\r\n  email: { type: String, required: true, unique: true },\r\n  password: { type: String },\r\n  phoneNo: {\r\n    type: String, unique: true, trim: true, sparse: true\r\n  },\r\n  emergencyContact: {\r\n    name: { type: String },\r\n    phoneNo: { type: String }\r\n  },\r\n  provider: { type: String },\r\n  providerId: { type: String },\r\n  providerData: {\r\n    accessToken: { type: String },\r\n    refreshToken: { typer: String }\r\n  }\r\n}, { timestamps: true });\r\n\r\nuserSchema.plugin(uniqueValidator);\r\n\r\nmodule.exports = mongoose.model('User', userSchema);\r\n\n\n//# sourceURL=webpack:///./src/models/user.js?");

/***/ }),

/***/ "./src/routes/report.js":
/*!******************************!*\
  !*** ./src/routes/report.js ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const express = __webpack_require__(/*! express */ \"express\");\r\nconst { reportValidation } = __webpack_require__(/*! ../middleware/validationMiddleware */ \"./src/middleware/validationMiddleware.js\");\r\nconst auth = __webpack_require__(/*! ../middleware/authMiddleware */ \"./src/middleware/authMiddleware.js\");\r\nconst reportCtrl = __webpack_require__(/*! ../controllers/reportController */ \"./src/controllers/reportController.js\");\r\n\r\nconst router = express.Router();\r\n\r\nrouter.post('/', auth, reportValidation, reportCtrl.createReport);\r\nrouter.get('/', auth, reportCtrl.getReports);\r\n\r\nmodule.exports = router;\r\n\n\n//# sourceURL=webpack:///./src/routes/report.js?");

/***/ }),

/***/ "./src/routes/responseUnit.js":
/*!************************************!*\
  !*** ./src/routes/responseUnit.js ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const express = __webpack_require__(/*! express */ \"express\");\r\nconst auth = __webpack_require__(/*! ../middleware/authMiddleware */ \"./src/middleware/authMiddleware.js\");\r\nconst { responseUnitValidation } = __webpack_require__(/*! ../middleware/validationMiddleware */ \"./src/middleware/validationMiddleware.js\");\r\n\r\nconst router = express.Router();\r\n\r\nconst responseUnitCtrl = __webpack_require__(/*! ../controllers/responseUnitController */ \"./src/controllers/responseUnitController.js\");\r\n\r\nrouter.post('/signup', responseUnitValidation, responseUnitCtrl.signup);\r\nrouter.post('/login', responseUnitCtrl.login);\r\nrouter.get('/', auth, responseUnitCtrl.getAllResponseUnits);\r\nrouter.get('/:id', auth, responseUnitCtrl.getResponseUnit);\r\nrouter.post('/:id', auth, responseUnitCtrl.updateResponseUnit);\r\n\r\nmodule.exports = router;\r\n\n\n//# sourceURL=webpack:///./src/routes/responseUnit.js?");

/***/ }),

/***/ "./src/routes/user.js":
/*!****************************!*\
  !*** ./src/routes/user.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("const express = __webpack_require__(/*! express */ \"express\");\r\nconst passport = __webpack_require__(/*! passport */ \"passport\");\r\nconst auth = __webpack_require__(/*! ../middleware/authMiddleware */ \"./src/middleware/authMiddleware.js\");\r\nconst { userValidation } = __webpack_require__(/*! ../middleware/validationMiddleware */ \"./src/middleware/validationMiddleware.js\");\r\n\r\nconst router = express.Router();\r\n\r\nconst userCtrl = __webpack_require__(/*! ../controllers/userController */ \"./src/controllers/userController.js\");\r\n\r\nrouter.post('/signup', userValidation, userCtrl.signup);\r\nrouter.post('/login', userCtrl.login);\r\nrouter.get('/profile/:id', auth, userCtrl.profile);\r\nrouter.post('/profile/:id', auth, userCtrl.edit);\r\nrouter.get('/facebook', userCtrl.facebookLogin);\r\nrouter.get('/facebook/fail', userCtrl.facebookLoginFail);\r\nrouter.get('/facebook/callback', passport.authenticate('facebook', { scope: ['email'], failureRedirect: '/api/auth/facebook/fail' }), userCtrl.facebookLoginSuccess);\r\nrouter.get('/google', userCtrl.googleLogin);\r\nrouter.get('/google/fail', userCtrl.googleLoginFail);\r\nrouter.get('/google/callback', passport.authenticate('google', { failureRedirect: '/api/auth/google/fail' }), userCtrl.googleLoginSuccess);\r\n\r\nmodule.exports = router;\r\n\n\n//# sourceURL=webpack:///./src/routes/user.js?");

/***/ }),

/***/ "./src/server.js":
/*!***********************!*\
  !*** ./src/server.js ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

eval("/* eslint-disable no-console */\r\nconst http = __webpack_require__(/*! http */ \"http\");\r\nconst app = __webpack_require__(/*! ./app */ \"./src/app.js\");\r\n\r\nconst normalizePort = (val) => {\r\n  const port = parseInt(val, 10);\r\n\r\n  // eslint-disable-next-line no-restricted-globals\r\n  if (isNaN(port)) {\r\n    return val;\r\n  }\r\n\r\n  if (port >= 0) {\r\n    return port;\r\n  }\r\n  return false;\r\n};\r\n\r\nconst port = normalizePort(process.env.PORT || '3001');\r\n\r\napp.set('port', port);\r\n\r\nconst server = http.createServer(app);\r\n\r\nconst errorHandler = (error) => {\r\n  if (error.syscall !== 'listen') {\r\n    throw error;\r\n  }\r\n\r\n  const address = server.address();\r\n  const bind = typeof address === 'string' ? `pipe ${address}` : `port: ${port}`;\r\n\r\n  switch (error.code) {\r\n    case 'EACCES':\r\n      console.error(`${bind} requires elevated privileges.`);\r\n      process.exit(1);\r\n      break;\r\n    case 'EADDRINUSE':\r\n      console.error(`${bind} is already in use.`);\r\n      process.exit(1);\r\n      break;\r\n    default:\r\n      throw error;\r\n  }\r\n};\r\n\r\nserver.on('error', errorHandler);\r\nserver.on('listening', () => {\r\n  const { address } = server;\r\n  const bind = typeof address === 'string' ? `pipe ${address}` : `port ${port}`;\r\n  console.log(`Listening on ${bind}`);\r\n});\r\n\r\nserver.listen(port);\r\n\n\n//# sourceURL=webpack:///./src/server.js?");

/***/ }),

/***/ "@hapi/joi":
/*!****************************!*\
  !*** external "@hapi/joi" ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"@hapi/joi\");\n\n//# sourceURL=webpack:///external_%22@hapi/joi%22?");

/***/ }),

/***/ "bcrypt":
/*!*************************!*\
  !*** external "bcrypt" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"bcrypt\");\n\n//# sourceURL=webpack:///external_%22bcrypt%22?");

/***/ }),

/***/ "body-parser":
/*!******************************!*\
  !*** external "body-parser" ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"body-parser\");\n\n//# sourceURL=webpack:///external_%22body-parser%22?");

/***/ }),

/***/ "cookie-parser":
/*!********************************!*\
  !*** external "cookie-parser" ***!
  \********************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"cookie-parser\");\n\n//# sourceURL=webpack:///external_%22cookie-parser%22?");

/***/ }),

/***/ "cors":
/*!***********************!*\
  !*** external "cors" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"cors\");\n\n//# sourceURL=webpack:///external_%22cors%22?");

/***/ }),

/***/ "dotenv":
/*!*************************!*\
  !*** external "dotenv" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"dotenv\");\n\n//# sourceURL=webpack:///external_%22dotenv%22?");

/***/ }),

/***/ "express":
/*!**************************!*\
  !*** external "express" ***!
  \**************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"express\");\n\n//# sourceURL=webpack:///external_%22express%22?");

/***/ }),

/***/ "http":
/*!***********************!*\
  !*** external "http" ***!
  \***********************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"http\");\n\n//# sourceURL=webpack:///external_%22http%22?");

/***/ }),

/***/ "jsonwebtoken":
/*!*******************************!*\
  !*** external "jsonwebtoken" ***!
  \*******************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"jsonwebtoken\");\n\n//# sourceURL=webpack:///external_%22jsonwebtoken%22?");

/***/ }),

/***/ "lodash":
/*!*************************!*\
  !*** external "lodash" ***!
  \*************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"lodash\");\n\n//# sourceURL=webpack:///external_%22lodash%22?");

/***/ }),

/***/ "mongoose":
/*!***************************!*\
  !*** external "mongoose" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"mongoose\");\n\n//# sourceURL=webpack:///external_%22mongoose%22?");

/***/ }),

/***/ "mongoose-unique-validator":
/*!********************************************!*\
  !*** external "mongoose-unique-validator" ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"mongoose-unique-validator\");\n\n//# sourceURL=webpack:///external_%22mongoose-unique-validator%22?");

/***/ }),

/***/ "passport":
/*!***************************!*\
  !*** external "passport" ***!
  \***************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"passport\");\n\n//# sourceURL=webpack:///external_%22passport%22?");

/***/ }),

/***/ "passport-facebook":
/*!************************************!*\
  !*** external "passport-facebook" ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"passport-facebook\");\n\n//# sourceURL=webpack:///external_%22passport-facebook%22?");

/***/ }),

/***/ "passport-google-oauth":
/*!****************************************!*\
  !*** external "passport-google-oauth" ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = require(\"passport-google-oauth\");\n\n//# sourceURL=webpack:///external_%22passport-google-oauth%22?");

/***/ })

/******/ });