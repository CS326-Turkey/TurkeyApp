/*
 * Portions of this code has been relipcated from ObjectLabs Corporation
 * Copyright (c) 2015 ObjectLabs Corporation
 * Distributed under the MIT license - http://opensource.org/licenses/MIT
 *
 * Written with: mongodb@1.3.17
 * Documentation: http://mongodb.github.io/node-mongodb-native/
 * A Node script connecting to a MongoDB database given a MongoDB Connection URI.
*/

// Standard URI format: mongodb://[dbuser:dbpassword@]host:port/dbname

var uri = 'mongodb://egendreau:temp18SG@ds031223.mongolab.com:31223/gleandb';

var db = uri;

module.exports = db;
