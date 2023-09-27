// const mongoose = require('../app');
const User = require('../models/user');

const {
  errIncorrectData, errNotFound, errDefault, errValidationError, /*regPattern4NonObjErr, regPattern4CastErr, */ errCastError, logPassLint,
} = require('../utils/constants');

function getUsers(req, res) {
  User.find({}).then((userList) => {
    res.send({ data: userList });
  }).catch((err) => {
    logPassLint(err, true);
    res.status(errDefault.num).send({ message: err });
  });
}

function getUserById(req, res) {
  const { userId } = req.params;
  User.findById(userId).then((mongUser) => {
    if (!mongUser) return Promise.reject(new Error(`User ${userId} doesn't exist, try another _id`));
    const {
      name, about, avatar, _id,
    } = mongUser;
    const user = {
      name, about, avatar, _id,
    };
    // console.log(`User 2 send 4 response: ${Object.entries(user).join('; ')}`);
    return res.send({ data: user });
  }).catch((err) => {
    // console.dir(err.name);
    // if (regPattern4CastErr(err)) {
    if (err.name === errCastError) {
      logPassLint(`Error ${errIncorrectData.num}: ${err}`, true);
      res.status(errIncorrectData.num).send({ message: errIncorrectData.msg });
    } else {
      logPassLint(`Error ${errNotFound.num}: ${err}`, true);
      res.status(errNotFound.num).send({ message: errNotFound.msg });
    }
  });
}

function createUser(req, res) {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar }).then((user) => {
    res.send({ data: user });
  }).catch((err) => {
    // if (regPattern4NonObjErr(err)) {
    if (err.name === errValidationError) {
      logPassLint(`Error ${errIncorrectData.num}: ${err}`, true);
      res.status(errIncorrectData.num).send({ message: errIncorrectData.msg });
    } else {
      logPassLint(`Error ${errDefault.num}: ${err}`, true);
      res.status(errDefault.num).send({ message: errDefault.msg });
    }
  });
}

function updateProfile(req, res) {
  const { _id } = req.user;
  User.find({ _id }).then((mongUser) => {
    const {
      name = mongUser[0].name, about = mongUser[0].about, avatar = mongUser[0].avatar,
    } = req.body;
    const retUser = { name, about/*, avatar */};
    return retUser;
  }).then((upUser) => User.findByIdAndUpdate(
    _id,
    upUser,
    { new: true, runValidators: true },
  ).then((user) => {
    res.send({ data: user });
  }).catch((err) => {
    // if (regPattern4NonObjErr(err)) {
    if (err.name === errValidationError) {
      logPassLint(`Error ${errIncorrectData.num}: ${err}`, true);
      res.status(errIncorrectData.num).send({ message: errIncorrectData.msg });
    } else {
      logPassLint(`Error ${errDefault.num}: ${err}`, true);
      res.status(errDefault.num).send({ message: errDefault.msg });
    }
  }));
}

function updateAvatar(req, res) {
  const { _id } = req.user;
  User.find({ _id }).then((mongUser) => {
    const {
      name = mongUser[0].name, about = mongUser[0].about, avatar = mongUser[0].avatar,
    } = req.body;
    const retUser = {/* name, about,*/ avatar };
    return retUser;
  }).then((upUser) => User.findByIdAndUpdate(
    _id,
    upUser,
    { new: true, runValidators: true },
  ).then((user) => {
    res.send({ data: user });
  }).catch((err) => {
    // if (regPattern4NonObjErr(err)) {
    if (err.name === errValidationError) {
      logPassLint(`Error ${errIncorrectData.num}: ${err}`, true);
      res.status(errIncorrectData.num).send({ message: errIncorrectData.msg });
    } else {
      logPassLint(`Error ${errDefault.num}: ${err}`, true);
      res.status(errDefault.num).send({ message: errDefault.msg });
    }
  }));
}

module.exports = {
  getUsers, getUserById, createUser, updateProfile, updateAvatar,
};
