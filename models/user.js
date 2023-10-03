const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const {
  usrName, usrAbout, usrAvatar, usrEmailFailMsg, errAuth,
  strSchMinLen, strSchMaxLen, strSchPassLen,
} = require('../utils/constants');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: strSchMinLen,
    maxlength: strSchMaxLen,
    default: usrName,
  },
  about: {
    type: String,
    minlength: strSchMinLen,
    maxlength: strSchMaxLen,
    default: usrAbout,
  },
  avatar: {
    type: String,
    default: usrAvatar, /*
    validate: { // проверки схемы перехватывают оные в Joi & валят тесты (do pattern in joi)
      validator(lnk) {
        // console.log(`Avatar link test in schema: ${validator.isURL(lnk)} 4 ${lnk}`);
        return validator.isURL(lnk);
      },
      message: usrLinkFailMsg,
    }, */
  },
  email: {
    type: String,
    required: true,
    unique: true,
    // match: /^[a-z0-9]+[a-z0-9\-_.]*@[a-z0-9]+[a-z0-9\-_.]*\.[a-z0-9]+[a-z0-9\-_.]*$/,
    validate: {
      validator(val) {
        // console.log(`Inside user schema email test: ${validator.isEmail(val)}`);
        return validator.isEmail(val);
      },
      message: usrEmailFailMsg,
    },
  },
  password: {
    type: String,
    required: true,
    minlength: strSchPassLen,
    select: false,
  },
});

userSchema.statics.findUserByCredentials = function (email, password) { // should't be an arrow fn
  // console.log(`User credentials starts: ${email} & ${password}`);
  return this.findOne({ email }).select('+password') // this — это модель User
    .then((user) => {
      // console.log(`Found user: ${user}`);
      if (!user) {
        return Promise.reject(new Error(errAuth.msg));
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        // console.log(`Matched: ${matched}`);
        if (!matched) {
          return Promise.reject(new Error(errAuth.msg));
        }
        // console.log(`User 2 return: ${user} / ${password} / ${user.password}`);
        return user;
      });
    });
};

module.exports = mongoose.model('user', userSchema);
