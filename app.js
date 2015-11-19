var express = require('express');
var handlebars = require('express-handlebars');

/*--------------------*/
/* Require Middleware */
/*--------------------*/

// body parser is used to parse the body of an HTTP request
var bodyParser = require('body-parser');

// require session library
var session = require('express-session');

// require flash library
var flash = require('connect-flash');

// cookie parser is used to parse cookies in an HTTP header
var cookieParser = require('cookie-parser');

// morgan for server logging
var morgan = require('morgan');

// MongoDB database
var mongojs = require('mongojs');

/*------------*/
/* Create App */
/*------------*/

// create the app
var app = express();

// set port number
app.set('port', process.env.PORT || 3000);

/*------------------*/
/* Middleware Setup */
/*------------------*/

// static file serving
app.use(express.static(__dirname + '/public'));

//set up handlebars view engine
var view = handlebars.create({ defaultLayout:'main' });
app.engine('handlebars', view.engine);
app.set('view engine', 'handlebars');

// body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// cookie parser
app.use(cookieParser());

// session support
app.use(session({
  secret: 'octocat', // in-class key used for now
  saveUninitialized: false,
  resave: false
}));

// flash support.
app.use(flash());

// morgan logging support.
// using 'combined' gives you Apache-style logging support.
app.use(morgan('combined'));

/*-------------*/
/* Route Setup */
/*-------------*/

// This adds the external router defined routes to the app.
app.use('/user', require('./routes/user-routes'));
app.use('/admin', require('./routes/admin-routes'));

var team = require('./lib/team.js');

/*---------------*/
/* User Database */
/*---------------*/

// the user database is hosted by mongolabs
// please ask admin for credentials.js file for authentication

// uri used to connect to database
var dburi = require('./lib/credentials.js');

// connect to user database
// authMechanism is from class example
var db = mongojs(dburi, [], {authMechanism: 'ScramSHA1'});

var users = db.collection('users');

/*-------------------------*/
/*  Generic Public Routes  */
/* (non-users & non-admin) */
/*-------------------------*/

app.get('/', (req, res) => {
	res.render('home');
});

app.get('/login', (req, res) => {
	res.redirect('/user/login');
});

app.get('/about', (req, res) => {
	res.render('about');
});

app.get('/register', (req, res) => {
	res.render('register');
});

app.get('/forgotpassword', (req, res) => {
	res.render('forgotpassword');
});

app.get('/team*', (req, res) => {
	if(Object.keys(req.query).length === 0){
		if(req.path==='/team'||req.path==='/team/'){
			var result = team.all();
		}
		else{
			res.status(404);
			res.render('404');
		}
	}
	else{
		var result = team.one(req.query.user);
	}
	if(result.count!==0){
		res.render('team', {
			members: result.data,
		});
	}
	else{
		res.status(404);
		res.render('404');
	}
});

/*-------------------------*/
/*  Need to decide Router  */
/*-------------------------*/

app.get('/profile', (req, res) => {
	res.render('profile');
});

app.get('/admin', (req, res) => {
	res.render('settings');
});

app.get('/forum', (req, res) => {
	res.render('forum');
});

app.use((req, res) => {
	res.status(404);
	res.render('404');
});

/*----------------*/
/*  Error Routes  */
/*----------------*/

app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500);
	res.render('500');
});

/*----------------*/
/*  Start Server  */
/*----------------*/

app.listen(app.get('port'), () => {
	console.log( 'Express started on http://localhost:' +
			app.get('port') + '; press Ctrl-C to terminate.' );
});
