const cardRouter = require('express').Router();
const { cardJoiTest, idJoiTest } = require('../middlewares/joiValidate');
const { CARDS, cardRoutes } = require('../utils/constants');
const {
  getCards, createCard, deleteCardById, likeCard, dislikeCard,
} = require('../controllers/cards');

const { cardId, cardLikes } = cardRoutes;

cardRouter.get('/', getCards);
// cardRouter.get(CARDS, getCards);
cardRouter.post('/', cardJoiTest(), createCard);
// cardRouter.post(CARDS, cardJoiTest(), createCard);
cardRouter.delete(`${CARDS}${cardId}`, idJoiTest(), deleteCardById);
cardRouter.put(`${CARDS}${cardLikes}`, idJoiTest(), likeCard); // Joi requires abs paths
cardRouter.delete(`${CARDS}${cardLikes}`, idJoiTest(), dislikeCard);

module.exports = cardRouter;
