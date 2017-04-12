/*
* Main js file for Node js app
* @author Sukesh Shetty
*/

'use strict';
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');
const Logger = require('./util/Logger');
const AuthService = require('./service/AuthService');


const log = new Logger('app.js');
const userRoute = require('./routes/UserRoute');
//Connect to DB
mongoose.connect(config.database);
mongoose.connection.on('connected', () => {
    log.info('Connected to database '+config.database);
});

const app = express();
const port = 3000;

// Set the static folder
app.use(express.static(path.join(__dirname,'public')));
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

const auth = new AuthService(passport);

app.use('/user',userRoute);

app.get('/', (req, res) => {
    let message = "This route is not defined.Please check your api path! Dynamic";
    log.debug(message);
    res.send(message);
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(port, () => {
 log.info('Server started on port: '+port);
});

process.on('uncaughtException', (err) => {
    console.log(err);
    log.error(err);
});

