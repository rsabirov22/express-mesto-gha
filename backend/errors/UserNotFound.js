const ApplicationError = require("./ApplicationError");

class UserNotFound extends ApplicationError {
  constructor() {
    super(404, "User not found");
  }
}

module.exports = UserNotFound;
