// const userRouter = require('express').Router();
const { userRoutes } = require('../utils/constants');
const {
  getUsers, getUserById, createUser, updateProfile, updateAvatar,
} = require('../controllers/users');

const { userId, userProfile, userAvatar } = userRoutes;

function runUsersRouting(router) {
  // userRouter.get(USERS, getUsers);
  router.get('/', getUsers);
  router.get(userId, getUserById);
  // userRouter.post(USERS, createUser);
  router.post('/', createUser);
  router.patch(userProfile, updateProfile);
  router.patch(userAvatar, updateAvatar);
}

// module.exports = userRouter;
module.exports = runUsersRouting;
