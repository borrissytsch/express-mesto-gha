/* Centralized err handling middleware */
const {
  errIncorrectData, errEmailExists, errNotFound, errForbidden, errDefault, errValidationErr,
  errMongoServerError, errDuplicateKeyPattern,
} = require('../utils/constants');
const { logPassLint } = require('../utils/miscutils');

module.exports = (err, req, res, next) => {
  // console.log(`Err handle started ${err.name} / ${err.message}`);
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
    case errNotFound.name:
      logPassLint(`Error ${err.statusCode}: ${err.message}`, true);
      res.status(err.statusCode).send({ message: err.message });
      break;
    case errForbidden.name:
      logPassLint(`Error ${err.statusCode}: ${err.message}`, true);
      res.status(err.statusCode).send({ message: err.message });
      break;
    default:
      logPassLint(`Error ${errDefault.num}: ${errDefault.msg}`, true);
      res.status(errDefault.num).send({ message: errDefault.msg });
  }
  next();
};
