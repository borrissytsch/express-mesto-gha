const userRouter = require('express').Router();
const { idJoiTest, userJoiTest, avatarJoiTest } = require('../middlewares/joiValidate');
const { userRoutes } = require('../utils/constants');
const {
  getUsers, getUserById, getUserIInfo, updateProfile, updateAvatar,
} = require('../controllers/users');

const { userId, userProfile, userAvatar } = userRoutes;

userRouter.get('/', getUsers);
userRouter.get(userProfile, getUserIInfo);
userRouter.get(userId, idJoiTest(), getUserById);
userRouter.patch(userProfile, userJoiTest(), updateProfile);
userRouter.patch(userAvatar, avatarJoiTest(), updateAvatar);

module.exports = userRouter;
