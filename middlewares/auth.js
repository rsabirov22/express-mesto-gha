/* eslint-disable consistent-return */
const jwt = require('jsonwebtoken');
const NotAuthorizedError = require('../errors/NotAuthorizedError');

const JWT_SECRET = 'e8fb1bc7bd4944241e25dea3df55b21199fad2906ed742a658c36a0bd61bb133';

module.exports = async (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new NotAuthorizedError('Необходима авторизация');
  }

  const token = authorization.replace('Bearer ', '');
  // верифицируем токен
  let payload;

  try {
    payload = await jwt.verify(token, JWT_SECRET);
  } catch (err) {
    throw new NotAuthorizedError('Необходима авторизация');
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next();
};
