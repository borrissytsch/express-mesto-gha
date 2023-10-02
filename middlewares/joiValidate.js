const { celebrate, Joi } = require('celebrate');

/* Users' Joi test patterns */
const signJoiTest = (signFields = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
    avatar: Joi.string().uri(),
  }).unknown(true),
}) => celebrate(signFields);
const idJoiTest = (id = {
  body: Joi.object().keys({
    id: Joi.string().hex().length(24),
  }).unknown(true),
}) => celebrate(id);
const userJoiTest = (user = {
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    about: Joi.string().required().min(2).max(30),
  }).unknown(true),
}) => celebrate(user);
const avatarJoiTest = (avatarUrl = {
  body: Joi.object().keys({
    avatar: Joi.string().uri(),
  }).unknown(true),
}) => celebrate(avatarUrl);

/* Cards' Joi test patterns */
const cardJoiTest = (card = {
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    link: Joi.string().required().uri(),
  }).unknown(true),
}) => celebrate(card);

module.exports = {
  signJoiTest, idJoiTest, userJoiTest, avatarJoiTest, cardJoiTest,
};
