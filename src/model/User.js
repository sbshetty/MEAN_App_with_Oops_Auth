/* User model object */

class User {

    constructor(userID, firstName, lastName, emailID, role, loginStatus, lastLogin, authKey) {
        this._id = userID;
        this.firstName = firstName;
        this.lastName = lastName;
        this.emailID = emailID;
        this.role = role;
        this.loginStatus = loginStatus;
        this.lastLogin = lastLogin;
        this.authKey - authKey;
    }
    setPassword(password) { 
        this.password = password;
     }
    getPassword() { 
        return this.password;
    }
}
module.exports = User;


