const { errIncorrectData, errValidationErr = 'ValidationError' } = require('../utils/constants');

// Technical class (alias of Error) 2 group custom errs (здесь не работает, узнать как можно)
class ValidationErr extends Error {
  constructor(message = errIncorrectData.msg) {
    super(message);
    this.name = errValidationErr;
    this.statusCode = errIncorrectData.num;
  }
}

module.exports = ValidationErr;
