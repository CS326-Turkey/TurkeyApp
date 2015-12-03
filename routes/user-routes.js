//Most of the code is from individual assignment 3, cs326, Tim Richards

var express = require('express');

// This gives us access to the user "model".
var model = require('../lib/user');

// This creates an express "router" that allows us to separate
// particular routes from the main application.
var router = express.Router();

// A list of users who are online:
var online = require('../lib/online').online;

//=================================================================

// Provides a login view
router.get('/login', (req, res) => {
  // Grab the session if the user is logged in.
  var user = req.session.user;

  // Redirect to main if session and user is online:
  if (user && online[user.name]) {
    res.redirect('/user/home');
  }
  else {
    // Grab any messages being sent to us from redirect:
    var message = req.flash('login') || '';
    res.render('login', { title   : 'User Login',
                          message : message });
  }
});

//=================================================================

router.get('/home', (req, res) => {
  // Grab the session if the user is logged in.
  var user = req.session.user;

  // Redirect to main if session and user is online:
  if (user && online[user.name]) {
    if(!(user.admin)){
    var message = req.flash('userhome') || '';
    res.render('userhome', { title   : 'User Home',
                          layout: 'usermain',
                          message : message ,
                      		name: user.name});
  }
  else{
	 req.flash('adminhome','You are Admin')
	 res.redirect('/admin/home');
  }
    }
    else {
      // Grab any messages being sent to us from redirect:
      req.flash('login', 'You are not logged in')
      res.redirect('/user/login');
    }
});

//===============================================================

router.get('/dash', (req, res) => {
  // Grab the session if the user is logged in.
  var user = req.session.user;

  // Redirect to main if session and user is online:
  if (user && online[user.name]) {
    if(!(user.admin)){
    var message = req.flash('dash') || '';
        model.getUserTransactions(user._id,function(error, trac){
            if (error){
                req.flash('dash', error);
                res.redirect('/user/home');
            } else{
                    req.flash('dash', 'Here is all your transactions');
                    res.render('dashboard', { title   : 'Dashboard', layout:'usermain',
                        message : message ,
                        name: user.name,
                        transaction: trac});
                }
            }
        );
  }
  else{
	 req.flash('adminhome','You are Admin')
	 res.redirect('/admin/home');
  }
    }
    else {
      // Grab any messages being sent to us from redirect:
      req.flash('login', 'You are not logged in')
      res.redirect('/user/login');
    }
});

//=============================================================

router.get('/profile', (req, res) => {
  // Grab the session if the user is logged in.
  var user = req.session.user;

  // Redirect to main if session and user is online:
  if (user && online[user.name]) {
    if(!(user.admin)){
    var message = req.flash('profile') || '';
    res.render('profile', { title   : 'Profile', layout:'usermain',
                          message : message ,
                      		name: user.name,
                          first: user.first,
                          last: user.last,
                          email:user.email});
  }
  else{
	 req.flash('adminhome','You are Admin')
	 res.redirect('/admin/home');
  }
    }
    else {
      // Grab any messages being sent to us from redirect:
      req.flash('login', 'You are not logged in')
      res.redirect('/user/login');
    }
});

/*//=================================================================

router.get('/home', (req, res) => {
	var user = req.session.user;
	if(!user){
		var message = req.flash('home') || '';
		 res.render('home', { title   : 'Home Page',
                          message : message,
                         });
	}
	else{
		if(!online[user.name]){
			var message = req.flash('home') || '';
		 res.render('home', { title   : 'Home Page',
                          message : message ,
                          });
		}
		else{
			if(!(user.admin)){
				req.flash('userhome', 'You are logged in as a user');
				res.redirect('/user/userhome');
			}
			else{
				req.flash('adminhome', 'You are logged in as an admin');
				res.redirect('/admin/adminhome');
			}
		}
	}

});*/

//================================================================
router.post('/changeemail', (req, res) =>{
    var user = req.session.user;
    var email = req.body.email;
    model.changeEmail(user.name, email);
    req.flash('profile','Changes Saved ');
    res.redirect('/user/profile');
});
router.post('/changefirstname', (req, res) =>{
    var user = req.session.user;
    var name = req.body.name;
    model.changeFirstName(user.name, name);
    req.flash('profile','Changes Saved ');
    res.redirect('/user/profile');
});
router.post('/changelastname', (req, res) =>{
    var user = req.session.user;
    var name = req.body.name;
    model.changeLastName(user.name, name);
    req.flash('profile','Changes Saved ');
    res.redirect('/user/profile');
});
router.post('/changepass', (req, res) =>{
    var user = req.session.user;
    var oldpass = req.body.oldpass;
    var newpass = req.body.newpass;
    var confirmpass = req.body.confirmpass;
    if(oldpass!==user.pass){
      console.log('pass: '+user.pass);
        req.flash('profile','Wrong password');
      res.redirect('/user/profile');
    }
     else if(confirmpass!==newpass){
      req.flash('profile','Passwords not matched');
    res.redirect('/user/profile');
    }else{
       model.changePass(user.name, newpass);
    req.flash('profile','Changes Saved ');
    res.redirect('/user/profile');
    }

});
router.post('/addcard', (req, res) =>{
    var user = req.session.user;
    var cardnumber = req.body.cardnumber;
    var cardholder = req.body.cardholder;
    var exp = req.body.exp;
    var sc = req.body.sc;
    if(!cardnumber||!cardholder||!exp||!sc){
      console.log("missing input");
      req.flash('profile','Missing input!!!');
    res.redirect('/user/profile');
    }
    else{
      console.log('user id is: '+user._id);
      model.addCard(user._id, cardholder,exp,sc, cardnumber);
    req.flash('profile','Changes Saved ');
    res.redirect('/user/profile');
    }

});

//================================================================
// Performs **basic** user authentication.
router.post('/auth', (req, res) => {
  // Grab the session if the user is logged in.
  var user = req.session.user;

  // Redirect to main if session and user is online:
  if (user && online[user]) {
  	if(!(user.admin)){
    	res.redirect('/user/home');
    }
    else{
      res.redirect('/admin/home');
    }
  }
  else {
    // Pull the values from the form:
    var name = req.body.name;
    var pass = req.body.pass;

    if (!name || !pass) {
      req.flash('login', 'Did not provide the proper credentials');
      res.redirect('/user/login');
    }
    else {
      model.lookup(name, pass, function(error, user) {
        if (error) {
          // Pass a message to login:
          req.flash('login', error);
          res.redirect('/user/login');
        }
        else {
          // add the user to the map of online users:
          online[user.name] = user;

          // create a session variable to represent stateful connection
          req.session.user = user;

          // Pass a message to main:
          req.flash('userhome', '');
          req.flash('userhome', 'Authentication successful!');
          res.redirect('/user/home');
        }
      });
    }
  }
});

//=======================================================================

// Performs logout functionality - it does nothing!
router.get('/logout', function(req, res) {
  // Grab the user session if logged in.
  var user = req.session.user;

  // If the client has a session, but is not online it
  // could mean that the server restarted, so we require
  // a subsequent login.
  if (user && !online[user.name]) {
    delete req.session.user;
  }
  // Otherwise, we delete both.
  else if (user) {
    delete online[user.name];
    delete req.session.user;
  }

  // Redirect to login regardless.
  res.redirect('/user/home');
});

//======================================================
router.get('/check_user_info', (req, res) =>{
  var msg = req.flash('check_user_info') || '';
  res.render('check_user_info', {message : msg});
});

router.get('/forgot', (req, res)=> {
  var name = req.session.name;
  var security = req.session.security;
  if (!name || !security){
    req.flash('check_user_info', 'Need to enter user_name and email information');
    res.redirect('/user/check_user_info');
  }else{
    var msg = req.flash('forgot_password_msg') || '';
    res.render('forgotpassword', {message: msg, security : security, n : name});
  }
});

//===========================================
router.post('/auth_forget', (req, res) =>{
  var user = req.session.user;
  if (user && online[user.name]) {
    res.redirect('/user/home');
  }
  else {
    var name = req.body.user_name;
    var email = req.body.email;
    if (!name || !email){
      req.flash('check_user_info', 'Please fill out both field');
      res.redirect('/user/check_user_info');
    }else{
      model.getSecurity(name, email, function(error, security){
        if (error === undefined){
          req.session.name = name;
          req.session.security = security;
          res.redirect('/user/forgot');
        }else{
          req.flash('check_user_info', error);
          res.redirect('/user/check_user_info');

        }
      });
    }
  }
});

//check the security question
router.post('/check_security', (req, res) => {
  var user = req.session.user;
  if (user){
    //req.flash('hom', 'Please login again');
    res.redirect('/user/home');
  }else{
    var security = req.session.security;
    var answer = req.body.answer;
    var name = req.session.name;
    if (!answer){
      req.flash('forgot_password_msg', 'Need to enter answer');
      res.redirect('/user/forgot');
    }else if (!security || !name){
      req.flash('check_user_info', 'Need to re-enter your user name and email');
      res.redirect('/user/check_user_info');
    }else{
      model.getAnswer(name, security, function(error, ans, pass){
        if (error){
          req.flash('forgot_password_msg', error);
          res.redirect('/user/forgot');
        }else{
          if (ans === answer){
            req.flash('login', 'Your password is ' + pass);
            res.redirect('/user/login');
          }else{
            req.flash('forgot_password_msg', 'your security answer is not current ');
            res.redirect('/user/forgot');
          }
        }
      });
    }
  }
});


module.exports = router;
