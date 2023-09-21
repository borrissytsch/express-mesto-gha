const {PORT, logger} = require('./utils/constants');
const {MONGODB = "mongodb://127.0.0.1:27017/mestodb"} =  process.env;
const router = require('./routes/users');
const cardRouter = require('./routes/cards');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
mongoose.connect(MONGODB, { useNewUrlParser: true
  /*, useCreateIndex: true      // these 2 features are not supported on 4.0.27 mongodb
  , useFindAndModify: false */
});

app.use(bodyParser.json());                                 // для собирания JSON-формата
app.use(bodyParser.urlencoded({ extended: true }));         // для приёма веб-страниц внутри POST-запроса
app.use((req, res, next) => logger(req, res, next, true));  // True is used only for code logging; delete after debug finish
app.use((req, res, next) => {
  req.user = {
    _id: '650a210d048a6ca35d75903f'                         // _id созданного вручную пользователя
  };
  next();
});
app.use('/', router);
app.use('/', cardRouter);
app.use('/*', () => {console.log("Path 2 be processed doesn't occurred")})

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});

module.exports.createCard = (req, res) => {
  console.log(req.user._id);                                // _id станет доступен
};