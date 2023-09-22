require('dotenv').config();
/* Server configuration: environment consts */
const { PORT = 3000
  , USERS_ROUTE: USERS = "/users"
  , CARDS_ROUTE: CARDS = "/cards"
  , MONGODB = "mongodb://127.0.0.1:27017/mestodb"                     // really was moved 2 app 2 pass tests
} = process.env;
// Server routing consts
const userDirs = {id: "userId", profile: "me", avatar: "avatar"};
const cardDirs = {id: "cardId", likes: "likes"};
const userRoutes = { userId: `${USERS}/:${userDirs.id}`
  , userProfile: `${USERS}/${userDirs.profile}`, userAvatar: `${USERS}/${userDirs.profile}/${userDirs.avatar}`
  } , cardRoutes = {
    cardId: `${CARDS}/:${cardDirs.id}`, cardLikes: `${CARDS}/:${cardDirs.id}/${cardDirs.likes}`
}
/* Router common consts */
const logger = (req, res, next, logTrace_flag = false, logTrace_msg = 'Request has been logged on') => {
  if(logTrace_flag) console.log(logTrace_msg);
  next();
}

/* Error processing config consts */
const errIncorrectData = { num: 400
    , msg: "Incorrect data were sent to card/user create or profile/avatar update methods"
  } , errNotFound = {num: 404
    , msg: "Card/user not found"
  } , errDefault = {num: 500
    , msg: "Error occurred"
}

module.exports = { PORT, USERS, CARDS, MONGODB
  , userDirs, cardDirs, userRoutes, cardRoutes, logger
  , errIncorrectData, errNotFound , errDefault
}

