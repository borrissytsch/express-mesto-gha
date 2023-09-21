const { USERS, userDirs, errDefault } = require('../utils/constants');
const User = require('../models/user');
const { id: userId } = userDirs;

function getUsers(req, res) {
  User.find({}).then(userList => {
                                                                            // console.log(userList.join('/ '));
    res.send({data: userList});
  }).catch(err => console.log(err));
}

function getUserById(req, res) {
  const {userId} = req.params;
                                                                            // console.log(`Find user: ${userId}`);
  User.find({_id: userId}).then(mongUser => {
                                                                            // console.log(mongUser[0]);
    if(mongUser[0]) {                                                       // Promise.reject(`User ${userId} doesn't exist, try anothe _id`)
      const {name, about, avatar, _id} = mongUser[0];
      const user = { name: name, about: about, avatar: avatar, _id: _id}
      console.log(user);
      res.send({data: user})
    }
  }).catch(err => console.log(err));
}

function createUser(req, res) {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar }).then(user => {
    console.log(`POST response sent: ${user}`)
    res.send({ data: user })
  }).catch(err => {
    console.log(`Error ${errDefault.num}: ${errDefault.msg}`);
    res.status(errDefault.num).send({ message: errDefault.msg })
  });
}

function updateProfile (req, res) {
  const _id = req.user._id;
  User.find({_id}).then(mongUser => {
    const {name = mongUser[0].name, about = mongUser[0].about, avatar = mongUser[0].avatar} = req.body;
    mongUser[0] = {name: name, about: about, avatar: avatar};
    return mongUser;
  }).then(upUser =>
    User.findByIdAndUpdate(_id, upUser[0], {new: true, runValidators: true}
  ).then(user => {
                                                                            // console.log(`Mongo update res: ${user}`);
    res.send({ data: user })
  }).catch(err => {
    console.log(`Error ${errDefault.num}: ${errDefault.msg}`);
    res.status(errDefault.num).send({ message: errDefault.msg })
  }));
}

function updateAvatar (req, res) {
  updateProfile (req, res)
}

module.exports = {getUsers, getUserById, createUser, updateProfile, updateAvatar};