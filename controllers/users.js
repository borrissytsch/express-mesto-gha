const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const NotFound = require('../errors/NotFound');
const ValidationErr = require('../errors/ValidationError');
const ServerError = require('../errors/ServerError');
const {
  errIncorrectData, errNotFound, errDefault, errValidationErr,
  errAuth, errIllegalArgsPattern, pswSoltLen, TOKEN_KEY,
  tokenDuration,
} = require('../utils/constants');
const { logPassLint, handleIdErr } = require('../utils/miscutils');

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
    if (!mongUser) return Promise.reject(new Error(errNotFound.msg));
    const {
      name, about, avatar, email, _id,
    } = mongUser;
    const user = {
      name, about, avatar, email, _id,
    };
    // console.log(`User 2 send 4 response: ${Object.entries(user).join('; ')}`);
    return res.send({ data: user });
  }).catch((err) => {
    handleIdErr(res, err);
  });
}

function getUserIInfo(req, res) {
  // достать из obj user, доступного после аутентификации
  // console.log(`Get user: ${req.user._id}`);
  const userId = req.user._id;
  // console.log(`Get user: ${userId}`);
  User.findById(userId).then((mongUser) => {
    if (!mongUser) return Promise.reject(new Error(errNotFound.msg));
    const {
      name, about, avatar, email,
    } = mongUser;
    const user = {
      name, about, avatar, email,
    };
    return res.send({ data: user });
  }).catch((err) => {
    // console.log(`Get user info: ${err}`);
    handleIdErr(res, err);
  });
}

function createUser(req, res, next) {
  const {
    name, about, avatar, email,
  } = req.body;
  // console.log(`Create user starts: ${Object.entries(req.body).join(' / ')}`);
  bcrypt.hash(req.body.password, pswSoltLen).then((password) => User.create({
    name, about, avatar, email, password,
  })).then((user) => {
    res.send({
      data: {
        name: user.name, about: user.about, avatar: user.avatar, email: user.email,
      },
    });
  }).catch((err) => {
    if (err instanceof Error) {
      if (errIllegalArgsPattern.test(err.message)) {
        // console.log(`Illegal args: ${err.name}`);
        logPassLint(`Error ${errIncorrectData.num}: ${err}`, true);
        res.status(errIncorrectData.num).send({ message: errIncorrectData.msg });
        return;
      }
    }
    // console.log(`Next 2 err handle middlewar'e: ${err.name}`);
    if (err) {
      next(err);
    } else {
      logPassLint(`Error ${errDefault.num}: ${err}`, true);
      res.status(errDefault.num).send({ message: errDefault.msg });
    }
  });
}

function updateUserById(id, updateData, updateOptions = { new: true, runValidators: true }) {
  return User.findByIdAndUpdate(id, updateData, updateOptions).then((user) => {
    if (!user) return Promise.reject(new NotFound());
    return Promise.resolve(user);
  }).catch((err) => Promise.reject(err));
}

function updateProfile(req, res, next) {
  const { _id } = req.user;
  const { name, about } = req.body;
  try {
    if (!name || !about) throw new ValidationErr();
    updateUserById(_id, { name, about }).then((user) => {
      res.send({ data: user });
    }).catch((err) => {
      if (err.name === errValidationErr) next(new ValidationErr());
      if (err instanceof Error) {
        next(err);
      } else {
        next(new ServerError());
      }
    });
  } catch (err) {
    next(err);
  }
}

function updateAvatar(req, res, next) {
  const { _id } = req.user;
  const { avatar } = req.body;
  try {
    if (!avatar) throw new ValidationErr();
    updateUserById(_id, { avatar }).then((user) => {
      res.send({ data: user });
    }).catch((err) => {
      if (err.name === errValidationErr) next(new ValidationErr());
      if (err instanceof Error) {
        next(err);
      } else {
        next(new ServerError());
      }
    });
  } catch (err) {
    next(err);
  }
}

function login(req, res) {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password).then((user) => { // в token надо user._id
    // console.log(`Credentials user: ${user}`);
    const token = jwt.sign({ _id: user._id }, TOKEN_KEY, { expiresIn: tokenDuration });
    // console.log(`Token: ${token}`);
    res.send({ token }); // сделать запись JWT в httpOnly куку: если не пройдёт - откатить
    /* res.cookie('jwt', token, {
      // maxAge: tokenDuration, // make function 4 token in sec & so on 2 ms (ms m h d)
      maxAge: 3600000 * 24 * 7, // add a piece 4 token transfer duration
      httpOnly: true,
    }).end(); */
  }).catch((/* err */) => {
    // console.log(`Login error ${err.name}: ${err}`);
    res.status(errAuth.num).send({ message: errAuth.msg });
  });
}

module.exports = {
  getUsers, getUserById, createUser, getUserIInfo, updateProfile, updateAvatar, login,
};
