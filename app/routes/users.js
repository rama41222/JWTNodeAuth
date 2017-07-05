const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/config.js');
const User = require('../models/user.js');
const sanitizer = require('sanitizer');


router.get('/',passport.authenticate('jwt',{session:false}),(req,res)=>{
	User.getAllUsers((err, users)=>{
		if(err){
			throw err;
		}else{
			res.json({success:true, usersList : users });
		}
	});
});



router.get('/:id',passport.authenticate('jwt',{session:false}),(req,res)=>{
	 const id = sanitizer.sanitize(req.params.id);
	 console.log(id);
	User.getUserById(id,(err, user)=>{
		if(err){
			throw err;
		}else{
			console.log(user)
			res.json({success:true, user : user });
		}
	});
});
router.put('/',passport.authenticate('jwt',{session:false}),(req,res)=>{

   const id = sanitizer.sanitize(req.body.id);
   const tickets = req.body.tickets;
   console.log(req.body.tickets)
   User.updateUser(id,tickets,(err, user)=>{
   	console.log(user);
   		if(err){
   					res.status(500).json({success:false,msg:"Error Occcured","err":err});
   				}else{
   					res.status(200).json({success:true,msg:"Order Successful",user:user});
   				}	
   });
   	

});




router.post('/',(req,res)=>{
 
   
   const email = sanitizer.sanitize(req.body.email);
   const password = sanitizer.sanitize(req.body.password);

 
   User.getUserByEmail(email,(err,user)=>{

   		if(err) throw err;

   		console.log(user);
   		if(!user){

   			var user = new User({
		   		email : email,
		   		password : password
		   });

   			User.addUser(user,(err,user)=>{
   				if(err){
   					res.status(500).json({success:false,msg:"Error Occcured"});
   				}else{
   					const token = jwt.sign(user,config.secret,{expiresIn:603400});
   					res.status(200).json({success:true,msg:"User Creation Successful", token:token, user : {
			            id : user._id,
			            email : user.email
			          }});
   				}	
   			});
   		}else{
   			res.status(501).json({success:false,msg:"User Already Exists"});
   		}

   });

     
});

router.post('/authenticate',(req,res)=>{

	var email = sanitizer.sanitize(req.body.email);
	var password = sanitizer.sanitize(req.body.password);

	User.getUserByEmail(email,(err,user)=>{
		if(err) throw err;
		if(!user){
			res.status(500).json({success:false,msg:"User Not Found!"});
		}else{

			User.comparePasswords(password,user.password,(err, isMatch)=>{
				if(isMatch){
					const token = jwt.sign({email: email} , config.secret ,{ expiresIn: '24h', algorithm: 'HS256' });
			        res.status(200).json({
			          success:true,
			          token : 'JWT '+token,
			          user : {
			            id : user._id,
			            email : user.email
			          },
			          msg:"Login Success"});
				}else{
					res.status(500).json({success:false,msg : "Invalid password"});
				}	
			});
		}
	});


});


module.exports = router;

