/*---------------*/
/* User Database */
/*---------------*/

// the user database is hosted by mongolabs
// please ask admin for credentials.js file for authentication

// MongoDB database
var mongojs = require('mongojs');
// Mongoose to make modelling easier
var mongoose = require('mongoose');
// uri used to connect to database
var dburi = require('./credentials.js');

//connect to the database
mongoose.connect(dburi);


// Create models for the collections.
var User = mongoose.model ('User',{
    first: String,
    last: String,
    email: String,
    pass: String,
    question: String,
    answer: String,
    admin: Boolean
});

var Charity = mongoose.model ('Charity',{
    name: String,
    uri: String,
    routing: String
});

var Transaction = mongoose.model ('Transaction',{
    created_at: Date,
    user_id: String,
    charity_id: String,
    total: Number
});

var Credit = mongoose.model('Credit', {
    user_id: String,
    name: String,
    expiration_at: String,
    security_code: String,
    number: String
});


// Functions to operate on the collections

/* Fetch all members from the collections. */
var getCollection = function (conditions, Model) {
    Model.find(conditions, function (err, docs) {

    });
};



/* Fetch a specific member from the collections. */
var getUser = function (first, last) {

};

var getCharity = function(name) {

};

var getTransaction = function(name) {

};

var getCredit = function(name) {

};


/* Functions to add to collections. Require ids for some. */
var addUser = function(first, last, pass, email, question, answer, admin) {
    var user = new User({
        first: first,
        last: last,
        email: email,
        pass: pass,
        question: question,
        answer: answer,
        admin: admin
    });
    user.save(function (err, userObj) {
      if (err) {
        console.log(err);
      } else {
        console.log('saved successfully:', userObj);
      }
    });
};

var addCharity = function(name, uri, routing) {
    var charity = new Charity({
        name: name,
        uri: uri,
        routing: routing
    });
    charity.save(function (err, userObj) {
      if (err) {
        console.log(err);
      } else {
        console.log('saved successfully:', userObj);
      }
    });
};


var addTransaction = function(userid, charityid, total) {
    var transaction = new Transaction({
        user_id: userid,
        charity_id: charityid,
        total: total
    });
    transaction.save(function (err, userObj) {
      if (err) {
        console.log(err);
      } else {
        console.log('saved successfully:', userObj);
      }
    });
};

var addCredit = function(userid, name, expiration, code, number) {
    var credit = new Credit({
        user_id: userid,
        name: name,
        expiration_at: expiration,
        security_code: code,
        number: number
    })
    credit.save(function (err, userObj) {
      if (err) {
        console.log(err);
      } else {
        console.log('saved successfully:', userObj);
      }
    });
};

/* Functions to delete from collections. Require ids for all. */
//deleteUser
//deleteCharity
//deleteTransaction
//deleteCredit
