require('dotenv').config();

/* Server configuration: environment consts */
const {
  PORT = 3000,
  USERS_ROUTE: USERS = '/users',
  CARDS_ROUTE: CARDS = '/cards',
  MONGODB = 'mongodb://127.0.0.1:27017/mestodb',
} = process.env;
// Server routing consts
const userDirs = { id: 'userId', profile: 'me', avatar: 'avatar' };
const cardDirs = { id: 'cardId', likes: 'likes' };
const userRoutes = {
  // userId: `${USERS}/:${userDirs.id}`,
  userId: `/:${userDirs.id}`,
  // userProfile: `${USERS}/${userDirs.profile}`,
  userProfile: `/${userDirs.profile}`,
  // userAvatar: `${USERS}/${userDirs.profile}/${userDirs.avatar}`,
  userAvatar: `/${userDirs.profile}/${userDirs.avatar}`,
};
const cardRoutes = {
  // cardId: `${CARDS}/:${cardDirs.id}`,
  cardId: `/:${cardDirs.id}`,
  // cardLikes: `${CARDS}/:${cardDirs.id}/${cardDirs.likes}`,
  cardLikes: `/:${cardDirs.id}/${cardDirs.likes}`,
};
/* Router common consts */
const logger = (req, res, next, logTraceFlag = false, logTraceMsg = 'Request is logged on') => {
  if (logTraceFlag) console.log(logTraceMsg);
  next();
};
/* Error processing config consts */
const errIncorrectData = {
  num: 400,
  msg: 'Incorrect data were sent to card/user create or profile/avatar update methods',
};
const errNotFound = {
  num: 404,
  msg: 'Card/user not found',
};
const errDefault = {
  num: 500,
  msg: 'Error occurred',
};
/* Miscellaneous consts */
const idPattern4HexFmt = /^[0-9a-f]+$/;

module.exports = {
  PORT,
  USERS,
  CARDS,
  MONGODB,
  userDirs,
  cardDirs,
  userRoutes,
  cardRoutes,
  logger,
  errIncorrectData,
  errNotFound,
  errDefault,
  idPattern4HexFmt,
};
