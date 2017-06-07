var JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const config = require('../config/database');
const User = require('../models/user');

module.exports = (passport)=>{
    var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
opts.secretOrKey = config.secret;

passport.use(new JwtStrategy(opts, function(jwt_payload, done) {
    User.getUserById(jwt_payload._doc._id, function(err, user) {
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