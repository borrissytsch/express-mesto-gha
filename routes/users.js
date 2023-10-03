const userRouter = require('express').Router();
// const { Joi, celebrate, Segments } = require('celebrate');
const { idJoiTest, userJoiTest, avatarJoiTest } = require('../middlewares/joiValidate');
const { USERS, userRoutes } = require('../utils/constants');
const {
  getUsers, getUserById, getUserIInfo, /* createUser, */updateProfile, updateAvatar,
} = require('../controllers/users');

const { userId, userProfile, userAvatar } = userRoutes;

// userRouter.get('/', getUsers);
userRouter.get(USERS, getUsers);
userRouter.get(userProfile, getUserIInfo);
userRouter.get(userId, idJoiTest(), getUserById);
userRouter.patch(userProfile, userJoiTest(), updateProfile);
userRouter.patch(userAvatar, avatarJoiTest(), updateAvatar);

module.exports = userRouter;
