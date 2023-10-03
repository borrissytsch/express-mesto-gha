// import  {ValidationErr} from './ValidationError';

const { errNotFound } = require('../utils/constants');

class NotFound extends Error {
  // class NotFound extends ValidationErr {
  constructor(message) {
    super(message);
    this.name = errNotFound.name;
    this.statusCode = errNotFound.num;
  }
}

module.exports = NotFound;
