const userRouter = require('express').Router();
const { userRoutes } = require('../utils/constants');
const {
  getUsers, getUserById, getUserIInfo, /* createUser, */updateProfile, updateAvatar,
} = require('../controllers/users');

const { userId, userProfile, userAvatar } = userRoutes;

userRouter.get('/', getUsers);
userRouter.get(userId, getUserById);
userRouter.get(userProfile, getUserIInfo);
// userRouter.post('/', createUser); // moved 2 app
userRouter.patch(userProfile, updateProfile);
userRouter.patch(userAvatar, updateAvatar);

module.exports = userRouter;
