const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { createUser, getUser, getUsers, editUser, changeUserAvatar, login, getCurrentUser } = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/me', getCurrentUser);
router.get('/users/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24),
  }),
}), getUser);
router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);
router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(/^(http[s]?:\/\/(www\.)?)[a-zA-Z1-9\-.]{1,}\.[a-z]{2,3}(\/?([a-zA-Z0-9\-._~:/?#[]@!$&'\(\)*\+,;=])?\/?){1,}#?/),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);
router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), editUser);
router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().regex(/^(http[s]?:\/\/(www\.)?)[a-zA-Z1-9\-.]{1,}\.[a-z]{2,3}(\/?([a-zA-Z0-9\-._~:/?#[]@!$&'\(\)*\+,;=])?\/?){1,}#?/),
  }),
}), changeUserAvatar);

module.exports = router;
