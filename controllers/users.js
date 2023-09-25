const User = require('../models/user');

const {
  errIncorrectData, errNotFound, idPattern4HexFmt,
} = require('../utils/constants');
// const { id: userId } = userDirs;

function getUsers(req, res) {
  User.find({}).then((userList) => {
    // console.log(userList.join('/ '));
    res.send({ data: userList });
  }).catch((err) => {
    // console.log(err);
    res.status(errDefault.num).send({ message: err });
  });
}

function getUserById(req, res) {
  const { userId } = req.params;
  // console.log(`Find user: ${userId} / is hex number: ${userId.match(idPattern4HexFmt)}`);
  try {
    if (!userId.match(idPattern4HexFmt)) throw new Error(`Incorrect _id: ${userId}; try another one, please`);
    User.findById(userId).then((mongUser) => {
      // console.log(`User found: ${mongUser}`);
      if (!mongUser) return Promise.reject(new Error(`User ${userId} doesn't exist, try another _id`));
      const { name, about, avatar, _id } = mongUser;
      const user = { name, about, avatar, _id };
      // console.log(`User 2 send 4 response: ${Object.entries(user).join('; ')}`);
      res.send({ data: user });
    }).catch((/* err */) => {
      // console.log(`Error ${errNotFound.num}: ${err}`);
      res.status(errNotFound.num).send({ message: errNotFound.msg });
    });
  } catch {
    // console.log(`Error ${errIncorrectData.num}: ${err}`);
    res.status(errIncorrectData.num).send({ message: errIncorrectData.msg });
  }
}

function createUser(req, res) {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar }).then((user) => {
    // console.log(`POST response sent:  ${user}`)
    res.send({ data: user });
  }).catch(() => {
    // console.log(`Error ${errIncorrectData.num}: ${errIncorrectData.msg}`);
    res.status(errIncorrectData.num).send({ message: errIncorrectData.msg });
  });
}

function updateProfile(req, res) {
  const { _id } = req.user;
  User.find({ _id }).then((mongUser) => {
    const {
      name /*= mongUser[0].name*/, about /*= mongUser[0].about*/, avatar /*= mongUser[0].avatar*/
    } = req.body;
    const retUser = { name, about, avatar };
    return retUser;
  }).then((upUser) => User.findByIdAndUpdate(
    _id, upUser[0], { new: true, runValidators: true }).then((user) => {
    // console.log(`Mongo update res: ${user}`);
    res.send({ data: user });
  }).catch((/* err */) => {
    // console.log(`Error ${errIncorrectData.num}: ${errIncorrectData.msg}`);
    res.status(errIncorrectData.num).send({ message: errIncorrectData.msg });
  }));
}

function updateAvatar(req, res) {
  const { _id } = req.user;
  User.find({ _id }).then((mongUser) => {
    const {
      name /*= mongUser[0].name*/, about /*= mongUser[0].about*/, avatar /*= mongUser[0].avatar*/
    } = req.body;
    const retUser = { name, about, avatar };
    return retUser;
  }).then((upUser) => User.findByIdAndUpdate(
    _id, upUser[0], { new: true, runValidators: true }).then((user) => {
    // console.log(`Mongo update res: ${user}`);
    res.send({ data: user });
  }).catch((/* err */) => {
    // console.log(`Error ${errIncorrectData.num}: ${errIncorrectData.msg}`);
    res.status(errIncorrectData.num).send({ message: errIncorrectData.msg });
  }));
}

module.exports = { getUsers, getUserById, createUser, updateProfile, updateAvatar };
