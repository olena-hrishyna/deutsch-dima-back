const jwt = require("jsonwebtoken");
const { secret } = require("../config");
const { errAuthResponse } = require("../helpers/errorResponses");

module.exports = function (req, res, next) {
  if (req.method === "OPTIONS") {
    next();
  }

  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return errAuthResponse(res);
    }
    req.userId = jwt.verify(token, secret)?.id;
    next();
  } catch (err) {
    return errAuthResponse(res);
  }
};
