const cardRouter = require('express').Router();
const { cardRoutes } = require('../utils/constants');
const {
  getCards, createCard, deleteCardById, likeCard, dislikeCard,
} = require('../controllers/cards');

const { cardId, cardLikes } = cardRoutes;

cardRouter.get('/', getCards);
cardRouter.post('/', createCard);
cardRouter.delete(cardId, deleteCardById);
cardRouter.put(cardLikes, likeCard);
cardRouter.delete(cardLikes, dislikeCard);

module.exports = cardRouter;
