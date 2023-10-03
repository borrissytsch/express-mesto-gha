const Card = require('../models/card');
const NotFound = require('../errors/NotFound');
const Forbidden = require('../errors/Forbidden');

const {
  resOkDefault, errIncorrectData, errNotFound, errDefault, errValidationErr,
} = require('../utils/constants'); // errCastErr, errName,, errForbidden
const { logPassLint, handleIdErr } = require('../utils/miscutils');

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
    /* console.log(`POST response 2 card sent: ${Object.entries( // \
      {
        name: card.name, link: card.link, owner: card.owner, likes: card.likes, _id: card._id,
      },
    ).join('; ')}`); // */
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
    if (!card) return Promise.reject(new NotFound());
    // console.log(`Del card ${cardId} owned by ${card.owner} starts 4: ${req.user._id}`);
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

function likeCard(req, res) {
  // console.log(`Card 2 like ${req.params.cardId} 4 user: ${req.user._id}`);
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  ).then((card) => {
    if (!card) return Promise.reject(new Error(errNotFound.msg));
    return res.send({ data: card });
  }).catch((err) => {
    handleIdErr(res, err);
  });
}

function dislikeCard(req, res) {
  // console.log(`Card 2 dislike ${req.params.cardId} 4 user: ${req.user._id}`);
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  ).then((card) => {
    if (!card) return Promise.reject(new Error(errNotFound.msg));
    return res.send({ data: card });
  }).catch((err) => {
    handleIdErr(res, err);
  });
}

module.exports = {
  getCards, createCard, deleteCardById, likeCard, dislikeCard,
};
