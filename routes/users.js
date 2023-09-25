const userRouter = require('express').Router();
const { USERS, userRoutes } = require('../utils/constants');
const {
  getUsers, getUserById, createUser, updateProfile, updateAvatar,
} = require('../controllers/users');

const { userId, userProfile, userAvatar } = userRoutes;

userRouter.get(USERS, getUsers);
userRouter.get(userId, getUserById);
userRouter.post(USERS, createUser);
userRouter.patch(userProfile, updateProfile);
userRouter.patch(userAvatar, updateAvatar);

module.exports = userRouter;
