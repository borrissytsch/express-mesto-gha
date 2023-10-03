const mongoose = require('mongoose');
const validator = require('validator');
const {
  strSchMinLen, strSchMaxLen, usrLinkFailMsg,
} = require('../utils/constants');

const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: strSchMinLen,
    maxlength: strSchMaxLen,
  },
  link: {
    type: String,
    required: true,
    validate: {
      validator(lnk) {
        // console.log(`Card link test in schema: ${validator.isURL(lnk)} 4 ${lnk}`);
        return validator.isURL(lnk);
      },
      message: usrLinkFailMsg,
    },
  },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
  likes: { type: [mongoose.Schema.Types.ObjectId], ref: 'user', default: [] },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('card', cardSchema);
