const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const {
  errIncorrectData, errNotFound, errDefault, errValidationErr, // errMongoServerError,
  errAuth, errIllegalArgsPattern, /* logPassLint, */pswSoltLen, TOKEN_KEY,
  /* id4TokenUser, */tokenDuration, /* errCastErr, errName, */
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

/* function handleIdErr(res, err) {
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
} */

// if (!mongUser) return Promise.reject(new Error(`User ${userId} doesn't exist, try another _id`))
function getUserById(req, res) {
  /* console.log
  (`Get user by id ${Object.entries(req.params).join('; ')} / this out means Joi test failed`); */
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
  }).catch((err) => { // Вынести эту ф-цию и logger & logPassLint в отдельный файл в utils(res,err)
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
    // console.log(`createUser err: ${err.name} / ${err.message}`);
    /* if (err.name === errValidationErr) next(err);
    if (err.name === errMongoServerError) next(err);
    if (err.name === errValidationErr) {
      // console.log(`create user validation error catched: ${err.name}`)
      next(err);
      logPassLint(`Error ${errIncorrectData.num}: ${err}`, true);
      res.status(errIncorrectData.num).send({ message: errIncorrectData.msg });
    } else */ if (err instanceof Error) {
      if (errIllegalArgsPattern.test(err.message)) {
        // console.log(`Illegal args: ${err.name}`);
        logPassLint(`Error ${errIncorrectData.num}: ${err}`, true);
        res.status(errIncorrectData.num).send({ message: errIncorrectData.msg });
        return;
      }
    } // else { этот else вместо 2-х первых if'ов, эти проверки делаются в middlewar'e
    // console.log(`Next 2 err handle middlewar'e: ${err.name}`);
    if (err) {
      next(err);
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
  return User.findUserByCredentials(email, password).then((user) => { // в token надо user._id
    // console.log(`Credentials user: ${user}`);
    // const token = jwt.sign({ _id: id4TokenUser }, TOKEN_KEY, { expiresIn: tokenDuration });
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
