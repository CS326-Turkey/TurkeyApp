/*
//  user-routes.js
//
//  Routes accessible by registered users.
//
*/

//Most of the code is from individual assignment 3, cs326, Tim Richards

var express = require('express');

// This gives us access to the user "model".
var model = require('../lib/user');

// This creates an express "router" that allows us to separate
// particular routes from the main application.
var router = express.Router();

// A list of users who are online:
var online = require('../lib/online').online;

var db = require('../lib/database.js');

var team = require('../lib/team.js');

// regular expressions for user input
var Regex = require("regex");

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
    message : message
  });
}
});

//=================================================================

router.get('/home', (req, res) => {
  // Grab the session if the user is logged in.
  var user = req.session.user;
  var name=user.name;
  var pass=user.pass;

  // Redirect to main if session and user is online:
  if (user && online[user.name]) {
    if(!(user.admin)){

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


          var message = req.flash('userhome') || '';
          var punchmessage = req.flash('punch') || '';
          res.render('userhome', { title   : 'User Home',
          layout: 'usermain',
          message : message ,
          name: user.name,
          donated: user.donated,
          available: user.available,punchmessage:punchmessage
        });
      }
    });


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

//=================================================================

router.get('/dash', (req, res) => {
  // Grab the session if the user is logged in.
  var user = req.session.user;

  // Redirect to main if session and user is online:
  if (user && online[user.name]) {
    if (!(user.admin)) {
      var message = req.flash('dashboard') || '';
      model.getUserTransactions(user._id, function(error, trac) {
        if (error) {
          req.flash('dashboard', error);
          res.redirect('/user/home');
        } else {
          var charities = model.getCharities( function(listCharities) {
            var purchases = model.getUserPurchases(user._id, function(error, listPurchases) {
              if (error) {
                req.flash('Dashboard', error);
                res.redirect('/user/home');
              } else {
                res.render('dashboard', { title : 'Dashboard', layout : 'usermain',
                message : message,
                name: user.name,
                charity : listCharities,
                transaction : trac,
                purchase : listPurchases });
              }
            });
          });
        }
      });
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

//=================================================================

router.get('/profile', (req, res) => {
  // Grab the session if the user is logged in.
  var user = req.session.user;

  // Redirect to main if session and user is online:
  if (user && online[user.name]) {
    ///////////////////////////
    var name=user.name;
    var pass=user.pass;
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
    });

  }
  else {
    // Grab any messages being sent to us from redirect:
    req.flash('login', 'You are not logged in')
    res.redirect('/user/login');
  }
});

//=================================================================

router.get('/team', (req, res) => {
  // Grab the session if the user is logged in.
  var user = req.session.user;

  // Redirect to main if session and user is online:
  if (user && online[user.name]) {
    if (!(user.admin)){
      if (Object.keys(req.query).length === 0){
        if (req.path==='/team'||req.path==='/team/'){
          var result = team.all();
        }
        else {
          res.status(404);
          res.render('404');
        }
      }
      else {
        var result = team.one(req.query.user);
      }
      if (result.count!==0){
        res.render('team', { layout : 'usermain',
        members : result.data,
        name : user.name
      });
    }
    else {
      res.status(404);
      res.render('404');
    }
  }
  else {
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

//=================================================================

router.get('/about', (req, res) => {

  // Grab the session if the user is logged in.
  var user = req.session.user;

  // Redirect to main if session and user is online:
  if (user && online[user.name] && !user.admin) {
    res.render('about', { layout:'usermain', name : user.name } );
  }
  else if (user && online[user.name] && user.admin) {
    res.redirect('/admin/about');
  }
  else {
    req.flash('login', 'You are not logged in')
    res.redirect('/user/login');
  }
  });

//=================================================================

router.post('/changeemail', (req, res) => {
  var user = req.session.user;
  var email = req.body.email;
  model.changeEmail(user.name, email);
  req.flash('profile','Changes Saved ');
  res.redirect('/user/profile');
});
router.post('/changefirstname', (req, res) => {
  var user = req.session.user;
  var name = req.body.name;
  model.changeFirstName(user.name, name);
  req.flash('profile','Changes Saved ');
  res.redirect('/user/profile');
});
router.post('/changelastname', (req, res) => {
  var user = req.session.user;
  var name = req.body.name;
  model.changeLastName(user.name, name);
  req.flash('profile','Changes Saved ');
  res.redirect('/user/profile');
});
router.post('/changepass', (req, res) => {
  var user = req.session.user;
  var oldpass = req.body.oldpass;
  var newpass = req.body.newpass;
  var confirmpass = req.body.confirmpass;
  if (oldpass!==user.pass) {
    console.log('pass: '+user.pass);
    req.flash('profile','Wrong password');
    res.redirect('/user/profile');
  }
  else if(confirmpass!==newpass) {
    req.flash('profile','Passwords not matched');
    res.redirect('/user/profile');
  } else {
    model.changePass(user.name, newpass);
    req.flash('profile','Changes Saved ');
    res.redirect('/user/profile');
  }
});
router.post('/addcard', (req, res) => {
  var user = req.session.user;
  var cardnumber = req.body.cardnumber;
  var cardholder = req.body.cardholder;
  var exp = req.body.exp;
  var sc = req.body.sc;
  if (!cardnumber||!cardholder||!exp||!sc){
    console.log("missing input");
    req.flash('profile','Missing input!!!');
    res.redirect('/user/profile');
  }
  else {
    console.log('user id is: '+user._id);
    model.addCard(user._id, cardholder,exp,sc, cardnumber);
    req.flash('profile','Changes Saved ');
    res.redirect('/user/profile');
  }
});

//=================================================================

router.post('/addTransaction', (req, res) => {
  var user = req.session.user;

  var userid = req.session.user;
  var amt = (Number)(req.body.total);
  var charityName = req.body.charityName;
  if (model.updateDonated(userid.name, amt) === -1) {
    flash('dashboard', 'Insufficient Funds');
    res.redirect('/user/dash');
    return;
  }
  model.updateAvailable(userid.name, -amt);
  model.addTransaction(userid, amt, charityName);
  req.flash('dashboard', 'Transaction Added!');
  res.redirect('/user/dash');
});

//=================================================================

router.post('/addPurchase', (req, res) => {
  var user = req.session.user;

  var userid = req.session.user;
  var origAmt = (Number)(req.body.amount);
  var amt = parseFloat((Math.ceil(origAmt) - origAmt).toFixed(2));
  console.log('Total is: ' + amt);
  var merchant = req.body.merchant;
  console.log('The username in routes is ' + userid.name);
  model.updateAvailable(userid.name, amt);
  model.addPurchase(userid, merchant, amt);
  req.flash('dashboard', 'Transaction Added!');
  res.redirect('/user/dash');
});

//=================================================================

router.post('/punch', (req, res) =>{
  var user = req.session.user;
  var confirm = req.body.confirm;


  if(!confirm){
    req.flash('punch','Please confirm');
    res.redirect('/user/home');
  }
  else{
    console.log('user id is: '+user._id);
    if(confirm!=='yes'){
      req.flash('punch','Please confirm');
      res.redirect('/user/home');
    }
    else{
      model.punch(user.name,10,function(err,u){
        if(err){
          console.log(err);
          req.flash('punch','Less Than $10 Available!');
          res.redirect('/user/home');
        }
        else{
          req.flash('punch','Done!');
          res.redirect('/user/home');
        }
      });
    }
  }
});

//=================================================================

router.post('/donate', (req, res) =>{
  var user = req.session.user;
  var m = req.body.m;

  if(!m){
    req.flash('punch','Please confirm');
    res.redirect('/user/home');
  }
  else{
    console.log('user id is: '+user._id);

    model.punch(user.name,m,function(err,u){
      if(err){
        console.log(err);
        req.flash('punch','Less Than $10 Available!');
        res.redirect('/user/home');
      }
      else{
        req.flash('punch','Done!');
        res.redirect('/user/home');
      }
    });
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

//=================================================================

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
  res.redirect('/');
});

//=================================================================

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

//=================================================================

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

//=================================================================

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

//=================================================================

router.post('/findcharity', (req, res) => {
  var user = req.session.user;
  var charity = req.body.charity;

  if (!charity) {
    console.log("missing input");
    //req.flash('profile','Missing input!!!');
    res.redirect('/user/dash');
  }
  else {
    //console.log('user id is: '+user._id);
    if (user && online[user.name]) {
      var message = req.flash('dash') || '';
      if (!user.admin) {
        db.getCollection({charity_name:charity, user_id: user._id}, db.Transaction, function(error, c) {
          if (error) {
            console.log(error);
          }
          else {
            if (c!=null) {
              if (c.length>0) {
                var charities = model.getCharities( function(listCharities) {
                  res.render('dashboard', { title : 'Dashboard', layout : 'usermain',
                  charityError : message,
                  name: user.name,
                  charity : listCharities,
                  transaction: c });
                });
              }
              else {
                req.flash('dash','Found Nothing about "'+ charity + '"');
                res.redirect('/user/dash');
              }
            }
          }
        });
      }
      else {
        req.flash('dash','You are Admin, not regular user :D');
        res.redirect('/user/dash');
      }
    }
    else {
      // Grab any messages being sent to us from redirect:
      req.flash('login', 'You are not logged in')
      res.redirect('/user/login');
    }
  }
});

module.exports = router;
