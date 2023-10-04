// import ValidationErr from './ValidationError';

const { errDefault } = require('../utils/constants');

// class ServerError extends ValidationErr {
class ServerError extends Error { // Импорт классов не работает, отключить линтер & do в 1 файле
  constructor(message = errDefault.msg) {
    super(message);
    this.name = errDefault.name;
    this.statusCode = errDefault.num;
  }
}

module.exports = ServerError;
