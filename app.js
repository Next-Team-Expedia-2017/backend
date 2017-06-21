/**
 * Module dependencies.
 */
const express= require('express');
const bodyParser = require('body-parser');
const http = require('http');
const path = require('path');
const chalk = require('chalk');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const config = require('./config/config');
const mongoose = require('mongoose');
const autoIncrement = require('mongoose-auto-increment');

/**
 * Controllers (route handlers).
 */
const testController = require('./controllers/test');
const homeController = require('./controllers/home');
const signInController = require('./controllers/signIn');
const signUpController = require('./controllers/signUp');
const dashboardController = require('./controllers/dashboard');
const authenticateController = require('./controllers/authenticate');
const searchController = require('./controllers/search');
const groupController = require('./controllers/group');
const tripController = require('./controllers/trip');

/**
 * Create Express server.
 */
const app = express();

/**
 * Connect to MongoDB.
 */
mongoose.Promise = global.Promise;
mongoose.connect(config.MONGODB_URI);
autoIncrement.initialize(mongoose.connection);
mongoose.connection.on('error', (err) => {
  console.error(err);
  console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
  process.exit();
});

/**
 * Express configuration.
 */
app.set('port', config.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: config.SESSION_SECRET,
  store: new MongoStore({
    url: config.MONGODB_URI,
    autoReconnect: true,
    clear_interval: 3600
  })
}));
app.use(express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));

app.all('/*', function(req, res, next) {
    console.log(req.method + ' '+ req.url);
    res.setHeader('Content-Type', 'text/html');
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
    res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
    next();
});

/**
 * Test App Routes.
 */
app.get('/test', testController.test);

/**
 * Home App Routes. (Index Page)
 */
app.get('/', homeController.index);

/**
 * SignIn App Routes.
 */
app.get('/signin', signInController.getSignIn);
app.post('/signin', signInController.postSignIn);

/**
 * SignUp App Routes. (Sign Up Page)
 */
app.get('/signup', signUpController.getSignUp);
app.post('/signup', signUpController.postSignUp);

/**
 * Dashboard App Routes. (Main Screen After Person Logins)
 */
app.get('/dashboard', authenticateController.isAuthenticated, dashboardController.getDashboard);
app.post('/dashboard', authenticateController.isAuthenticated, dashboardController.postDashboard);


/**
 * Search App Routes.  (Search Results Page)
 */
app.get('/search', authenticateController.isAuthenticated, authenticateController.isQueryGivenForGroup, searchController.getSearch);
app.post('/search', authenticateController.isAuthenticated, authenticateController.isQueryGivenForGroup, searchController.postSearch);

/**
 * Group App Routes. (Every Group Page)
 */
app.get('/group/new', authenticateController.isAuthenticated, authenticateController.isQueryGivenForGroup, groupController.getNewGroup);
app.get('/group/newtrip', authenticateController.isAuthenticated, authenticateController.isQueryGivenForGroup, groupController.getNewTrip);
app.get('/group/:id', authenticateController.isAuthenticated, authenticateController.isQueryGivenForGroup, groupController.addToWhichTrip);
app.get('/group/:groupId/:tripId', authenticateController.isAuthenticated, authenticateController.isQueryGivenForGroup, groupController.addGroupToExistingTrip);

/**
 * Trip. (plus groups in a trip)
 */
app.get('/trips', authenticateController.isAuthenticated, tripController.getTrips);





app.listen(app.get('port'), () => {
  console.log('%s App is running at http://localhost:%d in %s mode', chalk.green('✓'), app.get('port'), app.get('env')); 
  console.log('  Press CTRL-C to stop\n');
});

module.exports = app;
