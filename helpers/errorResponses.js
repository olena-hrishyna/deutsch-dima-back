function errHandlerResponse(res, status, errMessage, err) {
  return res?.status(status)?.json({ errMessage, err });
}

function errAuthResponse(res) {
  return errHandlerResponse(
    res,
    403,
    "The user is not authorized"
  );
}

function errRoleResponse(res) {
  return errHandlerResponse(
    res,
    403,
    "The user is not admin"
  );
}

module.exports = { errHandlerResponse, errAuthResponse, errRoleResponse };
