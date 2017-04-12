/*
* UserService containing methods related to user actions
* @author Sukesh Shetty
*/

const UserDAO = require('../dao/UserDAO');
const User = require('../model/User');
const Logger = require('../util/Logger');
const log = new Logger('UserService.js');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

class UserService {
    constructor() {
        this.userDao = new UserDAO();
    }

    addUser(req, res) {

        let userID = req.body.userID;
        let firstName = req.body.firstName;
        let lastName = req.body.lastName;
        let emailID = req.body.emailID;
        let role = req.body.role;
        let password = req.body.password;
        // Add input value check

        let newUser = new User(userID, firstName, lastName, emailID, role);
        log.info("addUser:: Adding new user -> " + newUser);
        newUser.setPassword(password);
        this.userDao.addUser(
            newUser,
            (err, data) => {
                if (err) {
                    res.json({ success: false, msg: 'Failed to register user -> ' + err });
                } else {
                    res.json({ success: true, msg: 'User registered' });
                }
            }
        )
    }

    getUser(userID, callback) {
        this.userDao.getuserByID(userID, (err, data) => {
            if (err) {
                log.error("getUser::Error is " + err);
                throw err;
            } else {
                log.debug("getUser::Data is " + data);
                if (data) {
                    let user = data._doc;
                }
                callback(data);
            }
        })
    }

    login(req, res) {
        const userID = req.body.userID;
        const password = req.body.password;
        this.getUser(userID, (dbUser) => {
            if (!dbUser) {
                log.info("Invalid user ID passed : " + userID);
                res.json({ success: false, message: "Invalid username or password!" });
            } else {
                this.userDao.comparePassword(password, dbUser.password, (err, isMatch) => {
                    if (err) {
                        log.error("authenticate::Error is " + err);
                        throw err;
                    }
                    if (isMatch) {
                        let returnUser = new User(userID, dbUser.firstName, dbUser.lastName, dbUser.emailID, dbUser.role)
                        let token = jwt.sign(returnUser, "nosecret", { expiresIn: 600 });
                        dbUser.authKey = 'JWT '+token;
                        dbUser.loginStatus = 'Active';
                        dbUser.lastLogin = new Date();
                        this.userDao.updateUser(dbUser);
                        res.json({ success: true, user: returnUser, token: dbUser.authKey });
                    } else {
                        log.error("authenticate::Invalid password");
                        return res.json({ success: false, message: "Invalid username or password!" });
                    }
                });
            }
        });
    }

/*
* Validates user session based on DB values.
*/
    validateSession(req, res) {
        this.getUser(req.user._id,(dbUser)=> {
            if (dbUser && dbUser.loginStatus != "Active") {
                log.error("validateSession::User has logged out -> User = " + dbUser);
                res.status(401).send("User has logged out!");
            }
            else {
                res.json(dbUser);
            }
        });
    }

    logout(req,res) {
        this.getUser(req.user._id,(dbUser) => {
            if (dbUser && dbUser.loginStatus == "Active") {
                dbUser.loginStatus = "LoggedOut";
                this.userDao.updateUser(dbUser);
                // Do any activity on log out here
                res.json({success:true, message: "User successfuly logged out."});
                log.info("User successfuly logged out -> " + dbUser._id);
            } else {
                log.info("User not logged in so do nothing -> " + dbUser._id);
                res.json({success:false, message: "User not logged in."});
            }
        })
    }
}
module.exports = UserService;