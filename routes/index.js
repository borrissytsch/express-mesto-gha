const rootRouter = require('express').Router();
const runUsersRouting = require('./users');
const runCardsRouting = require('./cards');

runUsersRouting(rootRouter);
runCardsRouting(rootRouter);

module.exports = rootRouter;