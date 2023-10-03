/* Centralized err handling middleware */
// const { ValidationErr } = require('../errors/ValidationError');
const { NotFound } = require('../errors/NotFound');
const { Forbidden } = require('../errors/Forbidden');

const {
  errIncorrectData, errEmailExists, errDefault, errValidationErr,
  errMongoServerError, errDuplicateKeyPattern,
  /* errIllegalArgsPattern, pswSoltLen, TOKEN_KEY, id4TokenUser, tokenDuration, */
} = require('../utils/constants'); // errNotFound, errCastErr, errName, errAuth,
const { logPassLint/* , handleIdErr */ } = require('../utils/miscutils');

module.exports = (err, req, res, next) => {
  console.log(`Err handle started ${err.name}`); // : ${Object.entries(err).join('; ')}
  /* if (err instanceof ValidationErr) { // убрать линтер, сделать наследование в 1 файле
    logPassLint(`Error ${err.statusCode}: ${err.message}`, true); // это будет вместо cas'ов
    res.status(err.statusCode).send({ message: err.message });
  } */
  switch (err.name) {
    case errValidationErr:
      // !! err не выводить: вывод celebrat'a дико flood'ит, в консоли не найдёшь концов !!
      logPassLint(`Error ${errIncorrectData.num}: ${errIncorrectData.msg}`, true);
      res.status(errIncorrectData.num).send({ message: errIncorrectData.msg });
      break;
    case errMongoServerError:
      if (errDuplicateKeyPattern.test(err.message)) {
        logPassLint(`Error ${errEmailExists.num}: ${err}`, true);
        res.status(errEmailExists.num).send({ message: errEmailExists.msg });
      } else {
        logPassLint(`Error ${errDefault.num}: ${err}`, true);
        res.status(errDefault.num).send({ message: err.message });
      }
      break;
    case NotFound.name: // убрать линтер, сделать наследование в 1 файле & instance of вместо case
      logPassLint(`Error ${err.statusCode}: ${err.message}`, true);
      res.status(err.statusCode).send({ message: err.message });
      break;
    case Forbidden.name: // убрать линтер, сделать наследование в 1 файле & instance of вместо case
      logPassLint(`Error ${err.statusCode}: ${err.message}`, true);
      res.status(err.statusCode).send({ message: err.message });
      break;
    default:
      console.log(`Default err handling: ${err.name}`);
      logPassLint(`Error ${errDefault.num}: ${err}`, true);
      res.status(errDefault.num).send({ message: errDefault.msg });
  }
  next();
};
