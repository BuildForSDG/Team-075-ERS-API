/* eslint-disable no-console */
const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const passport = require('./middleware/passportMiddleware');
const userRoutes = require('./routes/user');
const reportRoutes = require('./routes/report');
const responseUnitRoutes = require('./routes/responseUnit');
const subscriptionRoutes = require('./routes/subscribe');
const pushNotificationRoutes = require('./routes/pushNotification');

dotenv.config();

const app = express();

mongoose
  .connect('mongodb+srv://ersAdmin:Admin123@@ers-m0o8p.mongodb.net/ers?retryWrites=true&w=majority',
    {
      useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false
    })
  .then(() => {
    console.log('Successfully connected to MongoDB Atlas!');
  }).catch((error) => {
    console.log('Unable to connect to MongoDB Atlas!');
    console.error(error);
  });

const whitelist = [
  'http://localhost:3000',
  'https://dev.emresys.com:3001',
  `${process.env.FRONTEND_URL}`
];
const corsOptionsDelegate = (req, callback) => {
  let corsOptions;
  if (whitelist.indexOf(req.header('Origin')) !== -1) {
    // reflect (enable) the requested origin in the CORS response
    corsOptions = { origin: true, credentials: true };
  } else {
    corsOptions = { origin: false, credentials: true }; // disable CORS for this request
  }
  callback(null, corsOptions); // callback expects two parameters: error and options
};

app.use(cors(corsOptionsDelegate));

// app.use(cors({
//   origin: 'http://localhost:3000',
//   methods: 'GET, HEAD, PUT, PATCH, POST, DELETE',
//   credentials: true
// }));
// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader(
//     'Access-Control-Allow-Headers',
//     'Origin, X-Requested-Width, Content, Accept, Content-Type, Authorization'
//   );
//   res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
//   next();
// });

// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
//   res.header('Access-Control-Allow-Headers',
//    'Origin, X-Requested-With, Content-Type, Accept, Authorization');
//   next();
// });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieSession({
  name: 'session',
  keys: [process.env.SESSION_SECRET],
  maxAge: 24 * 60 * 60 * 100,
  sameSite: 'none',
  secure: true,
  httpOnly: false
}));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static(path.join(__dirname, '../public')));

app.use((req, res, next) => {
  if (!req.body) {
    res.status(404).send('Resource not found.');
  } else {
    next();
  }
});

app.get('/api', (req, res) => {
  res.status(200).json({
    message: 'Welcome'
  });
});
app.use('/api/auth', userRoutes);
app.use('/api/report', reportRoutes);
app.use('/api/response-unit', responseUnitRoutes);
app.use('/api/subscribe', subscriptionRoutes);
app.use('/api/push', pushNotificationRoutes);

// catch 404 (unknown routes) and forward to error handler
app.use((req, res, next) => {
  const error = new Error(`The route ${req.url} was not found.`);
  error.status = 404;

  next(error);
});

// Error handler
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return;
  }

  if (err) {
    res.status(err.status || 500).json({
      error: err.message || 'Internal Server Error'
    });
  }

  next();
});

module.exports = app;
