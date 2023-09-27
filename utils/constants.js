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
const regPattern4CastErr = (str) => /^CastError: /.test(str);
const regPattern4NonObjErr = (str, regPattern = /^ValidationError: /) => regPattern.test(str);
/* Miscellaneous consts */
const idPattern4HexFmt = /^[0-9a-f]+$/;
const logPassLint = (
  msg,
  logFlag = false,
  msgLog = (msg2Log = msg, log2Flag = logFlag) => { if (log2Flag) console.log(msg2Log); },
) => msgLog(msg, logFlag);
/* Router common consts */
const logger = (req, res, next, logTraceFlag = false, logTraceMsg = 'Request is logged on') => {
  if (logTraceFlag) logPassLint(logTraceMsg, true);
  next();
};

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
  regPattern4CastErr,
  regPattern4NonObjErr,
  idPattern4HexFmt,
  logPassLint,
};
