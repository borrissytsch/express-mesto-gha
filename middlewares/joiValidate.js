const { celebrate, Joi } = require('celebrate');
const {
  strSchMinLen, strSchMaxLen, idSchemaLen, strSchPassLen,
} = require('../utils/constants');

/* Users' Joi test patterns */
const signJoiTest = (signFields = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(strSchPassLen),
    name: Joi.string().min(strSchMinLen).max(strSchMaxLen),
    about: Joi.string().min(strSchMinLen).max(strSchMaxLen),
    avatar: Joi.string().uri(),
  }).unknown(true),
}) => celebrate(signFields);
const idJoiTest = (id = {
  body: Joi.object().keys({
    id: Joi.string().hex().length(idSchemaLen),
  }).unknown(true),
}) => celebrate(id);
const userJoiTest = (user = {
  body: Joi.object().keys({
    name: Joi.string().min(strSchMinLen).max(strSchMaxLen),
    about: Joi.string().min(strSchMinLen).max(strSchMaxLen),
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
    name: Joi.string().required().min(strSchMinLen).max(strSchMaxLen),
    link: Joi.string().required().uri(),
  }).unknown(true),
}) => celebrate(card);

module.exports = {
  signJoiTest, idJoiTest, userJoiTest, avatarJoiTest, cardJoiTest,
};
