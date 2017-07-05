var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const config = require('../config/config.js');
const User = require('../models/user');

module.exports = (passport)=>{
    var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
opts.secretOrKey = config.secret;

passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
     console.log(jwt_payload);
     console.log(jwt_payload.email);
    User.getUserByEmail(jwt_payload.email, function(err, user) {
       

        if (err) {
            return done(err, false);
        }
        if (user) {
            done(null, user);
        } else {
            done(null, false);
        }
    });
}));
}