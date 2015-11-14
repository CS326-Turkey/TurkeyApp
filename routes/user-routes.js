var express = require('express');

// This gives us access to the user "model".
var model = require('../lib/user');

// creates an express "router"
var router = express.Router();

router.get('/login', function(req, res) {
  console.log('I am here');
	res.render('login');
});

module.exports = router;
