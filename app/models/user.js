const mongoose = require('mongoose');
mongoose.Promise= require('bluebird');
const bcrypt = require('bcryptjs');
const config = require('../config/database');


var UserSchema = mongoose.Schema({
	email :{
		type:String,
		required : true
	},
	password : {
		type : String,
		required : true

	},tickets:[{
		mID :{type: String},
		noOfTickets:{type:Number},
		totalCost:{type:Number}
	}],snacks:[{
		sID : {type: String},
		quantity:{type:new Number},
		totalCost:{type:Number}
	}]
	,reservations:[{
		rID : {type :String}
		quantity:{type:new Number},
		totalCost:{type:Number}
	}]

});


const User = module.exports = mongoose.model('User',UserSchema);

module.exports.addUser = (newUser,callback)=>{
	bcrypt.genSalt(1,(err,salt)=>{
		if(err) throw  err;

		bcrypt.hash(newUser.password, salt,(err, hash)=>{
			if(err){
        		console.log("Error in adding user " + err);
       			return;
      		}
			newUser.password = hash;
			newUser.save(callback);
		});

	});

}

module.exports.comparePasswords = (candidatePassword,hash,callback)=>{

	bcrypt.compare(candidatePassword, hash,(err, isMatch)=>{
		if(err) throw err;
		callback(null, isMatch);
	});
}
module.exports.getAllUsers = (callback)=>{
	User.find(callback);
}

module.exports.getUserByEmail = (email,callback)=>{
	const query = { email : email };
	User.findOne(query,callback);
}

module.exports.getUserById = (_id,callback)=>{
	const query = { _id : _id };
	User.find(query,callback);
}
