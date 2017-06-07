const express = require('express');
const bodyParser = require('body-parser');
const mongooge = require('mongoose');
const cors = require('cors');
const path = require('path');
const passport = require('passport');
mongooge.Promise = require('bluebird');
const config = require('./app/config/config.js');

const app = express();
const PORT = 3000;

mongooge.connect(config.database);

mongooge.connection.on('connected',()=>{
	console.log('Connected to the '+ config.database);
});

mongooge.connection.on('error', (err)=>{

	console.log('Database Connection failed due to \n' + err );

});


//enable passport middlewate
app.use(passport.initialize());
app.use(passport.session());
require('./app/config/passport')(passport);


app.use(express.static(path.join(__dirname + './public')));
app.use(cors());
app.use(bodyParser.json());

const users = require("./app/routes/users.js");
app.use('/users',users);

app.get('/', (req,res)=>{
	res.status(200).json({ api: "Welcome to Movie Store Auth api 1.0.0v"});
});

app.listen(PORT, (err)=>{
	if(err){
		console.log('Error occured : \n' + err)
		return;
	}

	console.log('Server Started Runnig at port' + PORT);
});

