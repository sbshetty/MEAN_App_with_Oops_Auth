/* representation of User table with helper methods for data access 
* @author Sukesh Shetty
*/
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

//User table schema
const UserSchema = mongoose.Schema(
    // _id will be the Lan ID and the pk
    {
        _id : {
            type: String
        },
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        emailID: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            required: true
        },
        loginStatus: {
            type: String
        },
        lastLogin: {
            type: String
        },
        authKey: {
            type: String
        }
    }
);
const UserModel = mongoose.model('User', UserSchema);
class UserDAO {
    getuserByID(userID, callback) {
        UserModel.findById(userID, callback);
    }
    addUser(uiData, callback) {
        let newUser = new UserModel(uiData);
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err) throw err;
                newUser.password = hash;
                newUser.save(callback);
            });
        });
    }

    findByFields(fields,callback) {
        UserModel.find(fields,callback);
    }

    comparePassword(userPassword,dbHash,callback) {
        bcrypt.compare(userPassword,dbHash,callback);
    }

    updateUser(user,callback) {
        user.save(callback);
    }
}
module.exports = UserDAO;