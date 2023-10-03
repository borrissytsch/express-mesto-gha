const cardRouter = require('express').Router();
const { cardJoiTest, idJoiTest } = require('../middlewares/joiValidate');
const { /* CARDS, */cardRoutes } = require('../utils/constants');
const {
  getCards, createCard, deleteCardById, likeCard, dislikeCard,
} = require('../controllers/cards');

const { cardId, cardLikes } = cardRoutes;

cardRouter.get('/', getCards);
// cardRouter.get(CARDS, getCards);
cardRouter.post('/', cardJoiTest(), createCard);
// cardRouter.post(CARDS, cardJoiTest(), createCard);
cardRouter.delete(cardId, idJoiTest(), deleteCardById);
cardRouter.put(cardLikes, idJoiTest(), likeCard);
cardRouter.delete(cardLikes, idJoiTest(), dislikeCard);

module.exports = cardRouter;
