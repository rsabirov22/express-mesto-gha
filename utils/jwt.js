const jwt = require('jsonwebtoken');

const JWT_SECRET = 'e8fb1bc7bd4944241e25dea3df55b21199fad2906ed742a658c36a0bd61bb133';

const getJwtToken = (id) => {
  const payload = id;
  return jwt.sign({ _id: payload }, JWT_SECRET, { expiresIn: '7d' });
};

module.exports = { getJwtToken };
