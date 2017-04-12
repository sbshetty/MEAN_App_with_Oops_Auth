/*
* Route defination
* @author Sukesh Shetty
*/

'use strict';
const express = require('express');

const router = express.Router();
const UserService = require('../service/UserService');
const passport = require('passport');

const userService = new UserService();

router.post('/register', (req, res, next) => {
    userService.addUser(req, res);
});

router.post('/login', (req, res, next) => {
    userService.login(req, res);
});

router.post('/validate', (req, res, next) => {
    userService.validateSession(req, res, next);
});

// If any route needs to be secured then pass passport.authenticate('jwt', {session:false}) as second argument to the route
// if token is invalid or expired by default 400 unauthorized message will be sent back
router.post('/profile', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    userService.validateSession(req, res);
});

router.post('/logout', passport.authenticate('jwt', { session: false }), (req, res, next) => {
    userService.logout(req, res);
});

module.exports = router;

