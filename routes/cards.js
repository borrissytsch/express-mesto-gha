// const cardRouter = require('express').Router();
const { cardRoutes } = require('../utils/constants');
const {
  getCards, createCard, deleteCardById, likeCard, dislikeCard,
} = require('../controllers/cards');

const { cardId, cardLikes } = cardRoutes;

function runCardsRouting(router) {
  // cardRouter.get(CARDS, getCards);
  router.get('/', getCards);
  // cardRouter.post(CARDS, createCard);
  router.post('/', createCard);
  router.delete(cardId, deleteCardById);
  router.put(cardLikes, likeCard);
  router.delete(cardLikes, dislikeCard);
}

// module.exports = cardRouter;
module.exports = runCardsRouting;
