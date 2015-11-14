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

/*--------*/
/* Routes */
/*--------*/

var team = require('./lib/team.js');

app.get('/', function(req, res) {
	res.render('home');
});

app.get('/login', function(req, res) {
	res.render('login');
});

app.get('/profile', function(req, res) {
	res.render('profile');
});

app.get('/admin', function(req, res) {
	res.render('settings');
});

app.get('/forum', function(req, res) {
	res.render('forum');
});


app.get('/about', function(req, res){
	res.render('about');
});

app.get('/register', function(req, res){
	res.render('register');
});

app.get('/team*', function(req, res){
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


app.use(function(req, res){
	res.status(404);
	res.render('404');
});


app.use(function(err, req, res, next){
	console.error(err.stack);
	res.status(500);
	res.render('500');
});

app.listen(app.get('port'), function(){
	console.log( 'Express started on http://localhost:' +
			app.get('port') + '; press Ctrl-C to terminate.' );
});
