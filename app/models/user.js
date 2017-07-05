const mongoose = require('mongoose');
mongoose.Promise= require('bluebird');
const bcrypt = require('bcryptjs');
const config = require('../config/config.js');


var UserSchema = mongoose.Schema({
	email :{
		type:String,
		required : true
	},
	password : {
		type : String,
		required : true

	},tickets:[{
		
		mmID :{type: String},
		mname :{type: String},
		mprice :{type: Number},
		mtime :{type: String},
		mnoOfTickets:{type:Number},
		mtotal:{type:Number},

		ssID : {type: String},
		sname : {type: String},
		sprice : {type: Number},
		squantity:{type:Number},
		stotal:{type:Number},

	
		rrID : {type :String},
		rlocation : {type :String},
		rname : {type: String},
		rtype:{type:String},
		raccomodation:{type:Number},
		rprice:{type:Number},
		grandtotal:{type:String}

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
module.exports.updateUser = (_id, tickets, callback)=>{
	console.log(tickets)

	User.findByIdAndUpdate({ "_id": _id },{$push:{tickets:tickets}},{new:true}, callback);

};
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
	const query = { "email" : email };
	User.findOne(query,callback);
}

module.exports.getUserById = (_id,callback)=>{
	const query = { _id : _id };
	User.find(query,callback);
}
