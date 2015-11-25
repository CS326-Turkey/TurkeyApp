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
var dburi = require('../credentials.js');

//connect to the database
mongoose.connect(dburi);


// Create models for the collections.
var User = mongoose.model ('User',{
    _id: Object,
    name: String,
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
    total: Number,
    email: String
});

var Credit = mongoose.model('Credit', {
    user_id: String,
    name: String,
    expiration_at: String,
    security_code: String,
    number: String
});

exports.User=User;
exports.Charity=Charity;
exports.Transaction=Transaction;
exports.Credit=Credit;

// Functions to operate on the collections

/* Fetch all members from the collections. */
exports.getCollection = function (conditions, Model, cb) {
    var query = Model.find(conditions, function (err, docs) {
        if (err) {
          console.log(err);
        } else {
          cb(null,docs);
        }
    });
};


/* Fetch a specific member from the collections. Require id. */
exports.getObjectByID = function (id, Model, cb) {
    var query = Model.findById(id, function (err, doc) {
        if (err) {
          console.log(err);
        } else {
          cb(null, doc);
        }
    });
};

/* Fetch a specific member from the collections. Require id. */
exports.getObject = function (conditions, Model, cb) {
    var query = Model.findOne(conditions, function (err, doc) {
        if (err) {
          cb(err, null);
        } else {
          cb(null,doc);
        }
    });
};

/* Functions to add to collections. Require ids for some. */
exports.addUser = function(username, first, last, pass, email, question, answer, admin) {
    var user = new User({
        name: username,
        first: first.toLowerCase(),
        last: last.toLowerCase(),
        email: email.toLowerCase(),
        pass: pass.toLowerCase(),
        question: question.toLowerCase(),
        answer: answer.toLowerCase(),
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

exports.addCharity = function(name, uri, routing) {
    var charity = new Charity({
        name: name.toLowerCase(),
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


exports.addTransaction = function(userid, charityid, total) {
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

exports.addCredit = function(userid, name, expiration, code, number) {
    var credit = new Credit({
        user_id: userid,
        name: name.toLowerCase(),
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
exports.deleteObj = function (id, Model) {
    var query = Model.findByIdAndRemove(id, function (err, doc) {
        if (err) {
          console.log(err);
        } else {
          console.log('Deleted object: ', doc);
        }
    });
};

exports.updateField = function(conditions, Model, field, newValue){
    Model.findOne(conditions, function (err, doc) {
        if (err) {
          console.log(err);
        } else {
          doc[field]=newValue;
          doc.save(function(error){
            if (error){
                console.log(error);
            }
            console.log("saved!!!!");
          });
        }
    });
}

//addUser('Max', 'Caulfield', 'mcaulfield@lis.com', 'selfielyfe', 'what\'s my spirit animal?', 'doe', false);
