require('dotenv').config();

/* Server configuration: environment consts */
const {
  PORT = 3000,
  USERS_ROUTE: USERS = '/users',
  CARDS_ROUTE: CARDS = '/cards',
  MONGODB = 'mongodb://127.0.0.1:27017/mestodb',
  TOKEN_KEY = 'DEMO ===== some-secret-key ==== DEMO',
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
const signInRoute = '/signin';
const signUpRoute = '/signup';
/* User model config consts */
const usrName = 'Жак-Ив Кусто';
const usrAbout = 'Исследователь';
const usrAvatar = 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png';
const usrEmailFailMsg = 'Field typed is not a valid e-mail address';

/* User auth config consts */
const id4TokenUser = 'd285e3dceed844f902650f40';
const tokenDuration = '7d';
const authHeaderPattern = 'Bearer ';
const authNeedMsg = 'Необходима авторизация';

/* Error processing config consts */
const errIncorrectData = {
  num: 400,
  msg: 'Incorrect data were sent to card/user create or profile/avatar update methods',
};
const errAuth = {
  num: 401,
  msg: 'Неправильные почта или пароль',
};
const errNotFound = {
  num: 404,
  msg: 'Card/user not found',
};
const errDefault = {
  num: 500,
  msg: 'Error occurred',
};
const errCastErr = 'CastError';
const errValidationErr = 'ValidationError';
const errName = 'Error';
/* Miscellaneous consts */
const pswSoltLen = 12;
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
  signInRoute,
  signUpRoute,
  usrName,
  usrAbout,
  usrAvatar,
  usrEmailFailMsg,
  TOKEN_KEY,
  id4TokenUser,
  tokenDuration,
  authHeaderPattern,
  authNeedMsg,
  logger,
  errIncorrectData,
  errAuth,
  errNotFound,
  errDefault,
  errCastErr,
  errValidationErr,
  errName,
  logPassLint,
  pswSoltLen,
};
