/**
 * Module dependencies.
 */
const express= require('express');
const bodyParser = require('body-parser');
const http = require('http');
const path = require('path');
const chalk = require('chalk');
const session = require('express-session');

/**
 * Controllers (route handlers).
 */
const testController = require('./controllers/test');
const homeController = require('./controllers/home');
const signInController = require('./controllers/signIn');
const signUpController = require('./controllers/signUp');
const dashboardController = require('./controllers/dashboard');

/**
 * Create Express server.
 */
const app = express();

/**
 * Express configuration.
 */
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use(session({
//   resave: true,
//   saveUninitialized: true,
//   secret: process.env.SESSION_SECRET,
//   store: new MongoStore({
//     url: process.env.MONGODB_URI || process.env.MONGOLAB_URI,
//     autoReconnect: true,
//     clear_interval: 3600
//   })
// }));
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));

/**
 * Test App Routes.
 */
app.get('/test', testController.test);

/**
 * Home App Routes.
 */
app.get('/', homeController.index);

/**
 * SignIn App Routes.
 */
app.get('/signin', signInController.getSignIn);

/**
 * SignUp App Routes.
 */
app.get('/signup', signUpController.getSignUp);





app.listen(app.get('port'), () => {
  console.log('%s App is running at http://localhost:%d in %s mode', chalk.green('✓'), app.get('port'), app.get('env')); 
  console.log('  Press CTRL-C to stop\n');
});

module.exports = app;
