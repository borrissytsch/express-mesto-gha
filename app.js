const { MONGODB = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;
const mongoose = require('mongoose');
const express = require('express');
const bodyParser = require('body-parser');

const auth = require('./middlewares/auth');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');
const {
  PORT, USERS, CARDS, logger, errNotFound, logPassLint,
} = require('./utils/constants');
const { login, createUser } = require('./controllers/users');

const app = express();
mongoose.connect(MONGODB, { useNewUrlParser: true });

app.use(bodyParser.json());
// app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => logger(req, res, next, true));
/* app.use((req, res, next) => {
  req.user = {
    _id: '650a210d048a6ca35d75903f',
  };
  next();
}); */
app.post('/signin', login);
app.post('/signup', createUser);

// роуты, которым нужна авторизация:
app.use(auth);
app.use(USERS, userRouter);
app.use(CARDS, cardRouter);
app.patch('/*', (req, res) => {
  try {
    throw new Error("Path 2 be processed doesn't exist");
  } catch (err) {
    logPassLint(`Error ${errNotFound.num}: ${err}`, true);
    res.status(errNotFound.num).send({ message: errNotFound.msg });
  }
});

app.listen(PORT, () => {
  logPassLint(`App listening on port ${PORT}`, true);
});

module.exports.createCard = (req) => {
  logPassLint(req.user._id, true);
};
