/*
* Authservice for validating the Authorization token 
* @author Sukesh Shetty
*/

const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const Logger = require('../util/Logger');
const log = new Logger("Authservice.js");


class Authservice {
    constructor(passport) {
        this.loadJWTStratergy(passport);
    }
    // Load the JWT stratergy 
    loadJWTStratergy(passport) {
        let opts = {};
        opts.jwtFromRequest = ExtractJwt.fromAuthHeader(); // Set with Authorization key
        opts.secretOrKey = "nosecret";
        passport.use(new JwtStrategy(opts, (jwtPayload, done) => {
            // If the token is valid then this call back will be invoked. We can just pass the user payload
            log.info("Authservice::Passed token is valid. User is " + JSON.stringify(jwtPayload));
            return done(null, jwtPayload);
        }));
    }
}

module.exports = Authservice;
