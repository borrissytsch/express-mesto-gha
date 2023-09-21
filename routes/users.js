const { USERS, userRoutes } = require('../utils/constants');
const { getUsers, getUserById, createUser, updateProfile, updateAvatar } = require('../controllers/users');
const router = require('express').Router();
const { userId, userProfile, userAvatar } = userRoutes;

router.get(USERS, getUsers);
router.get(userId, getUserById);
router.post(USERS, createUser);
router.patch(userProfile, updateProfile);
router.patch(userAvatar, updateAvatar);

module.exports = router;