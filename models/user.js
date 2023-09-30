const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const {
  usrName, usrAbout, usrAvatar, usrEmailFailMsg, errAuth, /* errIncorrectData, logPassLint, */
} = require('../utils/constants');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: usrName,
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: usrAbout,
  },
  avatar: {
    type: String,
    default: usrAvatar,
  },
  email: {
    type: String,
    unique: true,
    validate: {
      validator(val) {
        return validator.isEmail(val);
      },
      message: usrEmailFailMsg,
    },
  },
  password: {
    type: String,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) { // should't be an arrow fn
  // console.log(`User credentials starts: ${email} & ${password}`);
  return this.findOne({ email }).select('+password') // this — это модель User
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error(errAuth.msg));
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new Error(errAuth.msg));
        }
        return user;
      });
    });
};

module.exports = mongoose.model('user', userSchema);
