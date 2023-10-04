const Card = require('../models/card');
const NotFound = require('../errors/NotFound');
const Forbidden = require('../errors/Forbidden');

const {
  resOkDefault, errIncorrectData, errDefault, errValidationErr,
} = require('../utils/constants');
const { logPassLint } = require('../utils/miscutils');

function getCards(req, res) {
  Card.find({}).then((cardList) => {
    res.send({ data: cardList });
  }).catch((err) => {
    logPassLint(err, true);
    res.status(errDefault.num).send({ message: errDefault.msg });
  });
}

function createCard(req, res) {
  // console.log(`${Object.entries(req.body).join('; ')} / ${req.user._id}`);
  const {
    name, link, owner = req.user._id, likes,
  } = req.body;
  Card.create(
    {
      name, link, owner, likes,
    },
  ).then((card) => {
    res.send({
      data: {
        name: card.name, link: card.link, owner: card.owner, likes: card.likes, _id: card._id,
      },
    });
  }).catch((err) => {
    if (err.name === errValidationErr) {
      logPassLint(`Error ${errIncorrectData.num}: ${err}`, true);
      res.status(errIncorrectData.num).send({ message: errIncorrectData.msg });
    } else {
      logPassLint(`Error ${errDefault.num}: ${err}`, true);
      res.status(errDefault.num).send({ message: errDefault.msg });
    }
  });
}

function deleteCardById(req, res, next) {
  const { cardId } = req.params;
  // console.log(`Delete card by ${cardId}`);
  Card.findById(cardId).then((card) => {
    // console.log(`Del card ${cardId} owned by ${card.owner} starts 4: ${req.user._id}`);
    if (!card) return Promise.reject(new NotFound());
    if (String(card.owner) !== String(req.user._id)) throw new Forbidden();
    Card.findByIdAndRemove(cardId).then((MongoCard) => {
      if (!MongoCard) return Promise.reject(new NotFound());
      // console.log(`Card ${cardId} was deleted with status: ${resOkDefault} / ${MongoCard}`);
      return res.status(resOkDefault).send({ data: MongoCard });
    }).catch((err) => {
      next(err);
    });
    return resOkDefault;
  }).catch((err) => {
    next(err);
  });
}

function updateCardById(id, updateData, updateOptions = { new: true }) {
  return Card.findByIdAndUpdate(id, updateData, updateOptions).then((card) => {
    // console.log(`Card after update: ${card}`);
    if (!card) return Promise.reject(new NotFound());
    return Promise.resolve(card); // res.send({ data: card });
  }).catch((err) => Promise.reject(err));
}

function likeCard(req, res, next) {
  // console.log(`Card 2 like ${req.params.cardId} 4 user: ${req.user._id}`);
  updateCardById(req.params.cardId, { $addToSet: { likes: req.user._id } }).then((card) => {
    res.send({ data: card });
  }).catch((err) => {
    next(err);
  });
}

function dislikeCard(req, res, next) {
  // console.log(`Card 2 dislike ${req.params.cardId} 4 user: ${req.user._id}`);
  updateCardById(req.params.cardId, { $pull: { likes: req.user._id } }).then((card) => {
    res.send({ data: card });
  }).catch((err) => next(err));
}

module.exports = {
  getCards, createCard, deleteCardById, likeCard, dislikeCard,
};
