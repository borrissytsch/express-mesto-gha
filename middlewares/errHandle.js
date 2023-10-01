/* Centralized err handling middleware */
const {
  errIncorrectData, errEmailExists, /* errNotFound, */ errDefault, errValidationErr,
  errMongoServerError, errDuplicateKeyPattern,
  /* errIllegalArgsPattern, pswSoltLen, TOKEN_KEY, id4TokenUser, tokenDuration, */
} = require('../utils/constants'); // errCastErr, errName, errAuth,
const { logPassLint/* , handleIdErr */ } = require('../utils/miscutils');

module.exports = (err, req, res, next) => {
  console.log(`Err handle started ${err.name}`); // : ${Object.entries(err).join('; ')}
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
    default:
      console.log(`Default err handling: ${err.name}`);
      logPassLint(`Error ${errDefault.num}: ${err}`, true);
      res.status(errDefault.num).send({ message: errDefault.msg });
  }
  next();
};
