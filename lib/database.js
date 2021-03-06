/*
//  database.js
//
//  mongoDB database for users.
//
*/

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

    name: String,
    first: String,
    last: String,
    email: String,
    pass: String,
    question: String,
    answer: String,
    admin: Boolean,
    donated: Number,
    available: Number
});



var Charity = mongoose.model ('Charity',{
    name: String,
    uri: String,
    routing: String,
    donation_received: Number
});

var Transaction = mongoose.model ('Transaction',{
    created_at_year: Number,
    created_at_month: Number,
    created_at_date: Number,
    user_id: String,
    charity_id: String,
    charity_name:String,
    total: Number,
    website: String
});

var Purchase = mongoose.model ('Purchase', {
  user_id : String,
  retailer : String,
  amount : Number,
  created_at_year : Number,
  created_at_month : Number,
  created_at_date : Number
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
exports.Purchase=Purchase;
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
        name: username.toLowerCase(),
        first: first,
        last: last,
        email: email.toLowerCase(),
        pass: pass,
        question: question,
        answer: answer,
        admin: admin,
        donated:0,
        available:0
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
        routing: routing,
        donation_received: 0
    });
    charity.save(function (err, userObj) {
        if (err) {
            console.log(err);
        } else {
            console.log('saved successfully:', userObj);
        }
    });
};


exports.addTransaction = function(userid, charityid, total, w, charityName) {
    var date = new Date();
    var y = date.getYear()+1900;
    var m = date.getMonth()+1;
    var d = date.getDate();
    var transaction = new Transaction({
        created_at_year : y,
        created_at_month : m,
        created_at_date : d,
        user_id: userid,
        charity_id: charityid,
        charity_name: charityName,
        total: total,
        website: w
    });
    transaction.save( function(err, userObj) {
        if (err) {
            console.log(err);
        } else {
            console.log('saved successfully:', userObj);
        }
    });
};

exports.addPurchase = function(userid, retail, amt) {
  var date = new Date();
  var y = date.getYear()+1900;
  var m = date.getMonth()+1;
  var d = date.getDate();
  var purchase = new Purchase({
    created_at_year : y,
    created_at_month : m,
    created_at_date : d,
    retailer : retail,
    amount : amt,
    user_id : userid
  });
  purchase.save( function(err, userObj) {
    if (err) {
      console.log(err);
    } else {
      console.log('saved successfully: ', userObj);
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
};

exports.updateDonated = function(user, amt) {
    console.log('The username being recieved is ' + user);
    User.findOne({name:user}, function(err, doc) {
      if (doc.available < doc.donated) {
        return -1;
      }
      doc.donated += amt;
      doc.save();
    });
};

exports.updateAvailable = function(user, amt) {
    console.log('The username being recieved is ' + user);
    User.findOne({name:user}, function(err, doc) {
      doc.available += amt;
      doc.save();
    });
};




//addUser('Max', 'Caulfield', 'mcaulfield@lis.com', 'selfielyfe', 'what\'s my spirit animal?', 'doe', false);
