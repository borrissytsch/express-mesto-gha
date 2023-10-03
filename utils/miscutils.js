const {
  errIncorrectData, errNotFound, errDefault, errCastErr, errName,
} = require('./constants');

/* Miscellaneous procedures (which haven't refed result) */
const logPassLint = (
  msg,
  logFlag = false,
  msgLog = (msg2Log = msg, log2Flag = logFlag) => { if (log2Flag) console.log(msg2Log); },
) => msgLog(msg, logFlag);

function handleIdErr(res, err) {
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

/* Router common consts */
const logger = (req, res, next, logTraceFlag = false, logTraceMsg = 'Request is logged on') => {
  if (logTraceFlag) logPassLint(logTraceMsg, true);
  next();
};

module.exports = {
  logger,
  logPassLint,
  handleIdErr,
};
