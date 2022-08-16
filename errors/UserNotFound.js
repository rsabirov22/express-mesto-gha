const ApplicationError = require('./ApplicationError');

class UserNotFound extends ApplicationError {
  constructor() {
    super(404, 'Пользователь не найден');
  }
}

module.exports = UserNotFound;
