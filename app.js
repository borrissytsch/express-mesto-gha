const { MONGODB = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const { PORT, USERS, CARDS, logger, errNotFound } = require('./utils/constants');

const app = express();
mongoose.connect(MONGODB, { useNewUrlParser: true });

app.use(bodyParser.json());
// app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => logger(req, res, next, true));
app.use((req, res, next) => {
  req.user = {
    _id: '650a210d048a6ca35d75903f',
  };
  next();
});
app.use(USERS, userRouter);
app.use(CARDS, cardRouter);
app.patch('/*', (req, res) => {
  try {
    throw new Error("Path 2 be processed doesn't exist");
  } catch (err) {
    console.log(`Error ${errNotFound.num}: ${err}`);
    res.status(errNotFound.num).send({ message: errNotFound.msg });
  }
});

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

module.exports.createCard = (req) => {
  console.log(req.user._id);
};
