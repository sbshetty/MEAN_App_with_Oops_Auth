/*
* A very simple logger class.
* @author Sukesh Shetty
*/

'use strict';
const moment = require('moment');
const DEBUG = "DEBUG";
const INFO = "INFO";
const isDebug = process.env.DEBUG;
const isInfo = process.env.INFO;
class Logger {
    constructor(caller) {
        this.caller = caller;
    }
    debug(message) {
        if (isDebug != 'false') {
            this.doLogging(message, DEBUG);
        }
    }
    error(message) {
        this.doLogging(message, "ERROR");
    }
    info(message) {
        if (isInfo != 'false') {
            this.doLogging(message, INFO);
        }
    }
    doLogging(message, level) {
        console.log("[" + level + " < " + this.caller + " >" + moment().format('YYYY-MM-DD,h:mm:ss a') + "]" + message);
    }

}
module.exports = Logger;
