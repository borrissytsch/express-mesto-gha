const { CARDS, cardRoutes } = require('../utils/constants');
const { getCards, createCard, deleteCardById, likeCard, dislikeCard } = require('../controllers/cards');
const cardRouter = require('express').Router();
const { cardId, cardLikes } = cardRoutes;

cardRouter.get(CARDS, getCards);
cardRouter.post(CARDS, createCard);
cardRouter.delete(cardId, deleteCardById);
cardRouter.put(cardLikes, likeCard);
cardRouter.delete(cardLikes, dislikeCard);

module.exports = cardRouter;