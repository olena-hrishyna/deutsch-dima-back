const jwt = require("jsonwebtoken");
const { secret } = require("../config");
const { errAuthResponse, errRoleResponse } = require('../helpers/errorResponses');

module.exports = function (req, res, next) {
    if (req.method === "OPTIONS") {
      next();
    }

    try {
      const token = req.headers.authorization.split(" ")[1];
      if (!token) {
        return errAuthResponse(res);
      }
      const { isAdmin, id } = jwt.verify(token, secret);
      req.userId = id;
  
      if (!isAdmin) {
        return errRoleResponse(res);
      }
      next();
    } catch (e) {
      return errAuthResponse(res);
    }
};
