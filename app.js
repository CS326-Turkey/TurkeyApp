var express = require('express');
var handlebars = require('express-handlebars');
var app = express();
app.set('port', process.env.PORT || 3000);

//set up handlebars view engine
var view = handlebars.create({ defaultLayout:'main' });
app.engine('handlebars', view.engine);
app.set('view engine', 'handlebars');

app.use(express.static(__dirname + '/public'));

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
