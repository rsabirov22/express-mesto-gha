/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');
const NotAuthorizedError = require('../errors/NotAuthorizedError');

const JWT_SECRET = 'e8fb1bc7bd4944241e25dea3df55b21199fad2906ed742a658c36a0bd61bb133';

module.exports = (req, res, next) => {
  const token = req.cookies.jwt;
  // верифицируем токен
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    next(new NotAuthorizedError('Необходима авторизация'));
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next();
};
