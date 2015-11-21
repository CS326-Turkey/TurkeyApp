var express = require('express');

//This gives us access to the user "model".
var model = require('../lib/user');

//A list of users who are online:
var online = require('../lib/online').online;

//This creates an express "router" that allows us to separate
//particular routes from the main application.
var router = express.Router();

router.get('/adminhome', (req, res) => {
	var user = req.session.user;
	if(!user){
		req.flash('home', 'You are not logged in');
		 res.redirect('/user/home');
	}
	else{
		if(!online[user.name]){
			req.flash('login', 'You are not logged in');
			res.redirect('/user/home');
		}
		else{
			if(!(user.admin)){
				req.flash('userhome', 'You are not admin');
				res.redirect('/user/userhome');
			}
			else{
				var message = req.flash('adminhome') || '';
    			res.render('adminhome', { title   : 'Admin Home',
                          message : message ,
                          name: user.name});

			}
		}
	}

});

router.get('/admin', (req, res) => {
  // Grab the session if the user is logged in.
  var user = req.session.user;

  // Redirect to main if session and user is online:
  if (user && online[user.name]) {
    if((user.admin)){
    var message = req.flash('admin') || '';
    res.render('admin', { title   : 'Admin',
                          message : message ,
                      		name: user.name});
}
else{
	req.flash('userhome','You are not Admin')
	res.redirect('/user/userhome');
}
  }
  else {
    // Grab any messages being sent to us from redirect:
    req.flash('login', 'You are not logged in')
    res.redirect('/user/login');
  }
});

router.get('/list', (req, res) => {
	// TODO: Add the admin list route.
	// The admin list route lists the current users in the system and
	// provides a form to add a new user. You must make sure you do
	// the following in this route:
	//
	//
	//  You will be graded on each of the above items.

	// Replace below with your own implementation.

	//  (1) Grab the user session object.
	var user = req.session.user;
	//   (2) Test that the user session object exists. If not, a redirect
	//       back to the login view is necessary with a proper flash message.
	if(!user){
		req.flash('login', 'Not logged in');
		res.redirect('/user/login');
	}
	//   (3) Test if the user session exists and they are not online. If
	//       the user session exists and they are not online it means the
	//       server has been restarted and their session has expired. If
	//       this is the case you will need to redirect back to login with
	//       a proper flash message (e.g., login expired).
	else{
		if(!online[user.name]){
			req.flash('login', 'Login expired');
			res.redirect('/user/login');
		}
		//   (4) Test is the user is an admin. If they are not you need to
		//       redirect back to main with a proper flash message - indicate
		//       that the user needs admin credentials to access this route.
		else{
			if(!(user.admin)){
				req.flash('main', 'You are not admin');
				res.redirect('/user/main');
			}
			//   (5) If the user is logged in, is online, and is an admin then
			//       you want to retrieve the list of users from the `lib/user.js`
			//       library and render the `user-list` view. The `user-list` view
			//       expects an array of users and a message. You should grab the
			//       flash message - if one exists, and pass it to the view template.
			//       A flash message will exist if the user tried to create a new
			//       user that already exists in our mock database.
			else{
				var message = req.flash('list') || 'List Successful';
				var list;
				model.list(function(error, users){
					if(error){
						req.flash('main', error);
						res.redirect('/user/main');
					}
					else{
						list=users;
						res.render('user-list', {
							title: 'User List',
							message : message ,
							users: list
						});
					}

				});

			}
		}
	}
	//req.flash('main', '/admin/list is not implemented!');
	//res.redirect('/user/main');
});

router.post('/user', (req, res) => {
	// TODO: Implement the /user route.
	// This route is similar to the /user/auth route in that it does not
	// have an associated view. Rather, its job is to add a new user and
	// redirect to /admin/list. Its job is to add a new user if the user
	// does not already exist in our model. You must make sure you do
	// the following in this route:
	//
	//   (1) Grab the user session object.
	var user = req.session.user;
	//   (2) Test that the user session object exists. If not, a redirect
	//       back to the login view is necessary with a proper flash message.
	if(!user){
		req.flash('login', 'Not logged in');
		res.redirect('/user/login');
	}
	//   (3) Test if the user session exists and they are not online. If
	//       the user session exists and they are not online it means the
	//       server has been restarted and their session has expired. If
	//       this is the case you will need to redirect back to login with
	//       a proper flash message (e.g., login expired).
	else{
		if(!online[user.name]){
			req.flash('login', 'login expired');
			res.redirect('/user/login');
		}
		//   (4) Test is the user is an admin. If they are not you need to
		//       redirect back to main with a proper flash message - indicate
		//       that the user needs admin credentials to access this route.
		else{
			if(!(user.admin)){
				req.flash('main', 'You are not admin');
				res.redirect('/user/main');
			}
			//   (5) If the user is logged in, they are online, and they are an
			//       admin then you need to grab the form variables from the
			//       `req.body` object. Test to make sure they all exist. If they
			//       do not then you need to redirect back to the `/list` route
			//       defined above with a proper flash message.
			else{
				var name = req.body.name;
				var pass = req.body.pass;
				var admin = (req.body.admin==='yes'?true:false);
				if (!name || !pass) {
					req.flash('list', 'Missing Input');
					res.redirect('/admin/list');
				}
				//   (6) If you have received the proper form variables then you must
				//       create a new user using the `model.add` function. If an error
				//       message is returned in the callback you should flash that message
				//       to the `list` route above passing it the error message returned
				//       from the `model.add` function and redirect to `list`.
				//       Otherwise, you should flash to `list` that the user has
				//       been added and redirect back to the `list` route.
				else{
					model.add({name:name,pass:pass,admin:admin}, function(error,user){
						if(error){
							req.flash('list', error);
							res.redirect('/admin/list');
						}
						else{
							req.flash('list', 'The use has been added');
							res.redirect('/admin/list');
						}
					});
				}
			}
		}
	}

	//
	//  You will be graded on each of the above items.

	// Replace below with your implementation.
//	req.flash('main', '/admin/user is not implemented!');
//	res.redirect('/user/main');
});

module.exports = router;