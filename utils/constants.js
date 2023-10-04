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
const strSchMinLen = 2;
const strSchMaxLen = 30;
const idSchemaLen = 24;
const strSchPassLen = 8;
const usrName = 'Жак-Ив Кусто';
const usrAbout = 'Исследователь';
const usrAvatar = 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png';
const usrEmailFailMsg = 'Field typed is not a valid e-mail address';
const usrLinkFailMsg = 'Incorrect link address';

/* User auth config consts */
const tokenDuration = '7d';
const authHeaderPattern = 'Bearer ';
const authNeedMsg = 'Необходима авторизация';

/* Validation consts 4 joi failed patterns */
const idPattern = /^[0-9a-f]{24}$/;
const lnkAvatarPattern = /^(https?:\/\/)?(w{3}[0-9]?\.)?[0-9a-z_]+[0-9a-z._-]*\.[0-9a-z_]+(\/[0-9a-z_]+[0-9a-z._-]*)*(#|\/)?$/;

/* Error processing config consts */
const resOkDefault = 200;
const errIncorrectData = {
  num: 400,
  name: 'Incorrect data',
  msg: 'Incorrect data were sent to card/user create or profile/avatar update methods',
};
const errAuth = {
  num: 401,
  name: 'Authentification failed',
  msg: 'Неправильные почта или пароль',
};
const errForbidden = {
  num: 403,
  name: 'Access forbidden',
  msg: 'Only card owner can delete a card',

};
const errNotFound = {
  num: 404,
  name: 'Not found',
  msg: 'Card/user not found',
};
const errEmailExists = {
  num: 409,
  name: 'Email already exists',
  msg: 'E-mail already exists, try another one',
};
const errDefault = {
  num: 500,
  name: 'Server error',
  msg: 'На сервере произошла ошибка',
};
const errCastErr = 'CastError';
const errValidationErr = 'ValidationError';
const errMongoServerError = 'MongoServerError';
const errName = 'Error';
const errIllegalArgsPattern = /^Illegal arguments: /;
const errDuplicateKeyPattern = /^E11000 duplicate key error collection: /;
/* Miscellaneous consts */
const pswSoltLen = 12;

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
  strSchMinLen,
  strSchMaxLen,
  idSchemaLen,
  strSchPassLen,
  usrName,
  usrAbout,
  usrAvatar,
  usrEmailFailMsg,
  usrLinkFailMsg,
  TOKEN_KEY,
  tokenDuration,
  authHeaderPattern,
  authNeedMsg,
  idPattern,
  lnkAvatarPattern,
  resOkDefault,
  errIncorrectData,
  errAuth,
  errForbidden,
  errNotFound,
  errEmailExists,
  errDefault,
  errCastErr,
  errValidationErr,
  errMongoServerError,
  errName,
  errIllegalArgsPattern,
  errDuplicateKeyPattern,
  pswSoltLen,
};
