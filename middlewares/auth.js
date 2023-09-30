const jwt = require('jsonwebtoken');
const {
  TOKEN_KEY, authHeaderPattern, errAuth, authNeedMsg,
} = require('../utils/constants');

module.exports = (req, res, next) => {
  const { authorization } = req.headers; // достаём авторизационный заголовок
  // заголовок есть и начинается с Bearer - выкидываем Bearer и верифицируем токен; иначе - ошибка
  if (!authorization || !authorization.startsWith(authHeaderPattern)) {
    return res
      .status(errAuth.num).send({ message: authNeedMsg });
  }
  const token = authorization.replace(authHeaderPattern, '');
  let payload;
  try {
    payload = jwt.verify(token, TOKEN_KEY); // верифицируем токен
  } catch (err) {
    return res.status(errAuth.num).send({ message: authNeedMsg });
  }
  req.user = payload; // записываем payload в запрос & шлём дальше
  next();
  return true;
};
