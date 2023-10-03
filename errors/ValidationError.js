// Technical class (alias of Error) 2 group custom errs (здесь не работает, узнать как можно)
class ValidationErr extends Error {
  constructor(message) {
    super(message);
    this.name = 'ValidationError';
  }
}

module.exports = ValidationErr;
