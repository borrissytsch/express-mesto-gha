const { CARDS, cardDirs
  , errIncorrectData, errNotFound, errDefault, idPattern4HexFmt
} = require('../utils/constants');
const Card = require('../models/card');
const { id: cardId } = cardDirs;

function getCards(req, res) {
  Card.find({}).then(cardList => {
                                                                // console.log(cardList.join('/ '));
    res.send({data: cardList});
  }).catch(err => console.log(err));
}

function createCard(req, res) {
  console.log(req.body);
  const { name, link, owner = null, likes } = req.body;
  Card.create({ name, link, owner, likes }).then(card => {
                                                                // console.log(`POST response 2 card sent: ${Object.entries({name: card.name, link: card.link, owner: card.owner, likes: card.likes, _id: card._id}).join('; ')}`);
    res.send({ data: {name: card.name, link: card.link, owner: card.owner, likes: card.likes, _id: card._id} });
  }).catch(err => {
    console.log(`Error ${errIncorrectData.num}: ${errIncorrectData.msg}`);
    res.status(errIncorrectData.num).send({ message: errIncorrectData.msg });
  });
}

function deleteCardById(req, res) {
                                                                // console.log(req.params.cardId);
  try {
    if (!req.params.cardId.match(idPattern4HexFmt)) throw new Error(`Incorrect _id: ${req.params.cardId}; try another one, please`);
    Card.findByIdAndRemove(req.params.cardId).then(card => {
                                                                // console.log(`Deleted card: ${card}`);
      if(!card) return  Promise.reject(`User ${req.params.cardId} doesn't exist, try another _id`);
      res.send({ data: card })
    }).catch(err => {
      console.log(`Error ${errNotFound.num}: ${err}`);
      res.status(errNotFound.num).send({ message: errNotFound.msg })
    });
  } catch (err) {
    console.log(`Error ${errIncorrectData.num}: ${errIncorrectData.msg}`);
    res.status(errIncorrectData.num).send({ message: errIncorrectData.msg })
  }
}

function likeCard(req, res) {
                                                                  // console.log(`Card 2 like ${req.params.cardId} 4 user: ${req.user._id}`);
  try {
    if (!req.params.cardId.match(idPattern4HexFmt)) throw new Error(`Incorrect _id: ${req.params.cardId}; try another one, please`);
    Card.findByIdAndUpdate(req.params.cardId
      , { $addToSet: { likes: req.user._id } }, { new: true }     // добавить _id в массив, если его там нет
    ).then(card => {
      if(!card) return  Promise.reject(`User ${req.params.cardId} doesn't exist, try another _id`);
                                                                  // console.log(`Liked card: ${card}`);
      res.send({ data: card })
    }).catch(err => {
      console.log(`Error ${errNotFound.num}: ${err}`);
      res.status(errNotFound.num).send({ message: errNotFound.msg })
    });
  } catch (err) {
    console.log(`Error ${errIncorrectData.num}: ${errIncorrectData.msg}`);
    res.status(errIncorrectData.num).send({ message: errIncorrectData.msg })
  }
}

function dislikeCard(req, res) {
                                                                // console.log(`Card 2 dislike ${req.params.cardId} 4 user: ${req.user._id}`);
  try {
    if (!req.params.cardId.match(idPattern4HexFmt)) throw new Error(`Incorrect _id: ${req.params.cardId}; try another one, please`);
    Card.findByIdAndUpdate(req.params.cardId
      , { $pull: { likes: req.user._id } }, { new: true }         // убрать _id из массива
    ).then(card => {
      if(!card) return  Promise.reject(`User ${req.params.cardId} doesn't exist, try another _id`);
                                                                  // console.log(`Disliked card: ${card}`);
      res.send({ data: card })
    }).catch(err => {
      console.log(`Error ${errNotFound.num}: ${err}`);
      res.status(errNotFound.num).send({ message: errNotFound.msg })
    });
  } catch (err) {
    console.log(`Error ${errIncorrectData.num}: ${errIncorrectData.msg}`);
    res.status(errIncorrectData.num).send({ message: errIncorrectData.msg })
  }
}

module.exports = { getCards, createCard, deleteCardById, likeCard, dislikeCard }
