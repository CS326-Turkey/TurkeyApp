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
    var db = require('../lib/database.js');
	db.getCollection({},db.User,function(err,users){
	if(err){
		console.log('error')
	}
	else{
		var list={};
		users.forEach(function(user){
			list[user._id]=user;
			// console.log(user);
		});
		console.log(list);
		 res.render('admin', { title   : 'Admin',
                          message : message ,
                  
                      		list: list});

	}
});
   
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

// NO USE FOR NOW
router.get('/list', (req, res) => {
	
	var user = req.session.user;
	if(!user){
		req.flash('login', 'Not logged in');
		res.redirect('/user/login');
	}
	else{
		if(!online[user.name]){
			req.flash('login', 'Login expired');
			res.redirect('/user/login');
		}
		else{
			if(!(user.admin)){
				req.flash('main', 'You are not admin');
				res.redirect('/user/main');
			}
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
});

module.exports = router;