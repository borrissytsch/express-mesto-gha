// import ValidationErr from './ValidationError';

const { errForbidden } = require('../utils/constants');

// class Forbidden extends ValidationErr {
class Forbidden extends Error { // Импорт классов не работает, отключить линтер и сделать в 1 файле
  constructor(message = errForbidden.msg) {
    super(message);
    this.name = errForbidden.name;
    this.statusCode = errForbidden.num;
  }
}

module.exports = Forbidden;
