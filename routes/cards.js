const cardRouter = require('express').Router();
const { cardJoiTest, cardIdJoiTest } = require('../middlewares/joiValidate');
const { cardRoutes } = require('../utils/constants');
const {
  getCards, createCard, deleteCardById, likeCard, dislikeCard,
} = require('../controllers/cards');

const { cardId, cardLikes } = cardRoutes;

cardRouter.get('/', getCards);
cardRouter.post('/', cardJoiTest(), createCard);
cardRouter.delete(cardId, cardIdJoiTest(), deleteCardById);
cardRouter.put(cardLikes, cardIdJoiTest(), likeCard);
cardRouter.delete(cardLikes, cardIdJoiTest(), dislikeCard);

module.exports = cardRouter;
