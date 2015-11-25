
//most of the code is from individual assignment 3 of CS326; instructor: Tim Richards

//A library for representing a user "model".

//Represents the next user ID:
var nextUID = 0;

//A function for creating "users".
function user(name, pass, admin, email, first_name, last_name, security, answer) {
	return {
		name: name,
		pass: pass,
		uid : ++nextUID,
		admin : admin,
		email: email,
		first_name: first_name,
		last_name: last_name,
		security: security,
		answer: answer
	};
}

//This is an in-memory mock database until we look at a real one!
var db = {
		'turkey'  : user('turkey', 'ttt', true, 'turkey@gmail.com','tur','key','my favorite food', 'turkey'),
		'bad': user('bad', 'bad', false, 'bad@gmail.com', 'bad','bad','bad question','bad')
	
};

//Returns a user object if the user exists in the db.
//The callback signature is cb(error, userobj), where error is
//undefined if there is no error or a string indicating the error
//that occurred.
var database = require('./database.js');
exports.lookup = (usr, pass, cb) => {

	var usrindb=false;
	var passpass=false;

	database.getObject({name:usr},database.User,function(error, user){
	if (error) {
        console.log(error);
    }
    else {
        if (user===null){
        	cb('user "' + usr + '" does not exist');
        	return;
        }
        else{
        	console.log("Findit!!!!!!!"+user.name);
        	var u=user;
        	if (pass == u.pass) {
			cb(undefined, u);
		}
		else {
			cb('password is invalid');
		}
        }
        
    }
});

};

exports.list = (cb) => {

	if(db !== undefined){
		var list = [];
		for(var key in db){
			var myuser={name:db[key].name,pass:db[key].pass,uid:db[key].uid,admin:db[key].admin};
			list.push(myuser);
		}
		cb(undefined, list);
	}
	else{
		cb('database undefined');
	}
};

exports.add = (u, cb) => {

	if(db===undefined){
		cb('database is undefined');
	}
	else{
		var myID=u.name;
		for(var key in db){
			if(myID===db[key].name){
				cb('Duplicated user name');
				return;
			}
		}
		var newUser=new user(u.name, u.pass, u.admin);
		u.pid=newUser.pid;
		db[newUser.name]=newUser;
		cb(undefined, newUser);
	}
};
