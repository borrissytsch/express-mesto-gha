const { celebrate, Joi } = require('celebrate');

celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
  }).unknown(true),
});

module.exports = celebrate;
