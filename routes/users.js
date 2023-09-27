const userRouter = require('express').Router();
const { userRoutes } = require('../utils/constants');
const {
  getUsers, getUserById, createUser, updateProfile, updateAvatar,
} = require('../controllers/users');

const { userId, userProfile, userAvatar } = userRoutes;

userRouter.get('/', getUsers);
userRouter.get(userId, getUserById);
userRouter.post('/', createUser);
userRouter.patch(userProfile, updateProfile);
userRouter.patch(userAvatar, updateAvatar);

module.exports = userRouter;
