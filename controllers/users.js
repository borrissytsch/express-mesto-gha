const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const {
  errIncorrectData, errNotFound, errDefault, errValidationErr, errCastErr, errName, errAuth,
  logPassLint, pswSoltLen, TOKEN_KEY, id4TokenUser, tokenDuration,
} = require('../utils/constants');

function getUsers(req, res) {
  User.find({}).then((userList) => {
    res.send({ data: userList });
  }).catch((err) => {
    logPassLint(err, true);
    res.status(errDefault.num).send({ message: err });
  });
}

function handleIdErr(res, err) {
  if (err.name === errCastErr) {
    logPassLint(`Error ${errIncorrectData.num}: ${err}`, true);
    res.status(errIncorrectData.num).send({ message: errIncorrectData.msg });
  } else if (err.name === errName && err.message === errNotFound.msg) {
    logPassLint(`Error ${errNotFound.num}: ${err}`, true);
    res.status(errNotFound.num).send({ message: errNotFound.msg });
  } else {
    logPassLint(err, true);
    res.status(errDefault.num).send({ message: err });
  }
}

// if (!mongUser) return Promise.reject(new Error(`User ${userId} doesn't exist, try another _id`))
function getUserById(req, res) {
  const { userId } = req.params;
  User.findById(userId).then((mongUser) => {
    if (!mongUser) return Promise.reject(new Error(errNotFound.msg));
    const {
      name, about, avatar, _id,
    } = mongUser;
    const user = {
      name, about, avatar, _id,
    };
    // console.log(`User 2 send 4 response: ${Object.entries(user).join('; ')}`);
    return res.send({ data: user });
  }).catch((err) => { // Вынести эту ф-цию и logger & logPassLint в отдельный файл в utils(res,err)
    handleIdErr(res, err);
    /* if (err.name === errCastErr) {
      logPassLint(`Error ${errIncorrectData.num}: ${err}`, true);
      res.status(errIncorrectData.num).send({ message: errIncorrectData.msg });
    } else if (err.name === errName && err.message === errNotFound.msg) {
      logPassLint(`Error ${errNotFound.num}: ${err}`, true);
      res.status(errNotFound.num).send({ message: errNotFound.msg });
    } else {
      logPassLint(err, true);
      res.status(errDefault.num).send({ message: err });
    } */
  });
}

function getUserIInfo(req, res) {
  // достать из obj user, доступного после аутентификации
  const { _id: userId } = req.user._id;
  User.findById(userId).then((mongUser) => {
    if (!mongUser) return Promise.reject(new Error(errNotFound.msg));
    const {
      name, about, avatar,
    } = mongUser;
    const user = {
      name, about, avatar,
    };
    return res.send({ data: user });
  }).catch((err) => {
    handleIdErr(res, err);
  });
}

function createUser(req, res) {
  const {
    name, about, avatar, email,
  } = req.body;
  bcrypt.hash(req.body.password, pswSoltLen).then((password) => {
    User.create({
      name, about, avatar, email, password,
    }).then((user) => {
      res.send({ data: user });
    });
  }).catch((err) => {
    if (err.name === errValidationErr) {
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
      name = mongUser[0].name, about = mongUser[0].about,
    } = req.body;
    const retUser = { name, about }; // , avatar
    return retUser;
  }).then((upUser) => User.findByIdAndUpdate(
    _id,
    upUser,
    { new: true, runValidators: true },
  ).then((user) => {
    res.send({ data: user });
  }).catch((err) => {
    if (err.name === errValidationErr) {
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
      avatar = mongUser[0].avatar,
    } = req.body;
    const retUser = { avatar };
    return retUser;
  }).then((upUser) => User.findByIdAndUpdate(
    _id,
    upUser,
    { new: true, runValidators: true },
  ).then((user) => {
    res.send({ data: user });
  }).catch((err) => {
    if (err.name === errValidationErr) {
      logPassLint(`Error ${errIncorrectData.num}: ${err}`, true);
      res.status(errIncorrectData.num).send({ message: errIncorrectData.msg });
    } else {
      logPassLint(`Error ${errDefault.num}: ${err}`, true);
      res.status(errDefault.num).send({ message: errDefault.msg });
    }
  }));
}

function login(req, res) {
  const { email, password } = req.body;
  /* User.findOne({ email })
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error(errAuth.msg));
      }
      return bcrypt.compare(password, user.password);
    }).then((matched) => {
      if (!matched) {
        // хеши не совпали — отклоняем промис
        return Promise.reject(new Error(errAuth.msg));
      }

      // аутентификация успешна
      res.send({ message: 'Всё верно!' }); */
  // Блок с return до catch вместо закомментаренного текста (его замена на аутентификацию в модели)
  return User.findUserByCredentials(email, password).then((/* user */) => { // в token надо user._id
    const token = jwt.sign({ _id: id4TokenUser }, TOKEN_KEY, { expiresIn: tokenDuration });
    // res.send({ token }); // сделать запись JWT в httpOnly куку: если не пройдёт - откатить
    res.cookie('jwt', token, {
      maxAge: tokenDuration,
      httpOnly: true,
    }).end(); // добавить middleware в арр
  }).catch((/* err */) => {
    res
      .status(errAuth.num).send({ message: errAuth.msg });
  });
}

module.exports = {
  getUsers, getUserById, createUser, getUserIInfo, updateProfile, updateAvatar, login,
};
