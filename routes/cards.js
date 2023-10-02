const cardRouter = require('express').Router();
const { cardJoiTest, idJoiTest } = require('../middlewares/joiValidate');
const { cardRoutes } = require('../utils/constants');
const {
  getCards, createCard, deleteCardById, likeCard, dislikeCard,
} = require('../controllers/cards');

const { cardId, cardLikes } = cardRoutes;

cardRouter.get('/', getCards);
cardRouter.post('/', cardJoiTest(), createCard);
cardRouter.delete(cardId, idJoiTest(), deleteCardById);
cardRouter.put(cardLikes, idJoiTest(), likeCard);
cardRouter.delete(cardLikes, idJoiTest(), dislikeCard);

module.exports = cardRouter;
