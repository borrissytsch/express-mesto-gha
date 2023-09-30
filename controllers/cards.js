const Card = require('../models/card');
const {
  errIncorrectData, errNotFound, errDefault, errCastErr, errValidationErr, errName, logPassLint,
} = require('../utils/constants');

function getCards(req, res) {
  Card.find({}).then((cardList) => {
    res.send({ data: cardList });
  }).catch((err) => {
    logPassLint(err, true);
    res.status(errDefault.num).send({ message: errDefault.msg });
  });
}

function createCard(req, res) {
  // logPassLint(`${Object.entries(req.body).join('; ')} / ${req.user._id}`, true)
  const {
    name, link, owner = req.user._id, likes,
  } = req.body;
  Card.create(
    {
      name, link, owner, likes,
    },
  ).then((card) => {
    logPassLint(`POST response 2 card sent: ${Object.entries(
      {
        name: card.name, link: card.link, owner: card.owner, likes: card.likes, _id: card._id,
      },
    ).join('; ')}`, true);
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

function processIdSearchErr(req, res, err) {
  if (err.name === errCastErr) {
    logPassLint(`Error ${errIncorrectData.num}: ${err}`, true);
    res.status(errIncorrectData.num).send({ message: errIncorrectData.msg });
  } else if (err.name === errName && err.message === errNotFound.msg) {
    logPassLint(`Error ${errNotFound.num}: ${err}`, true);
    res.status(errNotFound.num).send({ message: errNotFound.msg });
  } else {
    logPassLint(err, true);
    res.status(errDefault.num).send({ message: err });
  }
}

function deleteCardById(req, res) {
  const { cardId, owner } = req.params;
  try {
    if (owner !== req.user._id) throw new Error('Only card owner can delete a card');
    // Card.findByIdAndRemove(req.params.cardId).then((card) => {
    Card.findByIdAndRemove(cardId).then((card) => {
      if (!card) return Promise.reject(new Error(errNotFound.msg));
      return res.send({ data: card });
    }).catch((err) => {
      processIdSearchErr(req, res, err);
    });
  } catch (err) {
    logPassLint(err, true);
    res.status(errDefault.num).send({ message: err });
  }
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
    processIdSearchErr(req, res, err);
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
    processIdSearchErr(req, res, err);
  });
}

module.exports = {
  getCards, createCard, deleteCardById, likeCard, dislikeCard,
};
