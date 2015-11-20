/*---------------*/
/* User Database */
/*---------------*/

// the user database is hosted by mongolabs
// please ask admin for credentials.js file for authentication

// MongoDB database
var mongojs = require('mongojs');

// uri used to connect to database
var dburi = require('./credentials.js');

// connect to user database
var db = mongojs(dburi, [], {authMechanism: 'ScramSHA1'});

var users = db.collection('users');

users.insert({ "this" : "one" });
