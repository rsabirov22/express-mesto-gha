const bcrypt = require('bcryptjs');
const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const UserExistsError = require('../errors/UserExistsError');
const NotAuthorizedError = require('../errors/NotAuthorizedError');
const { getJwtToken } = require('../utils/jwt');

const SALT_ROUNDS = 10;

const createUser = (req, res, next) => {
  const { name, about, avatar, email, password } = req.body;
  if (!email || !password) throw new ValidationError('Email или пароль не могут быть пустыми');
  return bcrypt.hash(password, SALT_ROUNDS)
    .then((hash) => User.create({ name, about, avatar, email, password: hash }))
    .then((user) => {
      const newUser = { ...user };
      delete newUser._doc.password;
      res.status(201).send(newUser);
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new UserExistsError('Такой пользователь уже существует'));
      }
      if (err.name === 'ValidationError') {
        next(new ValidationError('Ошибка при создании пользователя'));
      }
      next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) throw new ValidationError('Email или пароль не могут быть пустыми');

  return User.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) throw new NotAuthorizedError('Неверная почта или пароль');
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) throw new NotAuthorizedError('Неверная почта или пароль');

          const token = getJwtToken(user.id);

          return res.status(200).cookie('jwt', token, {
            maxAge: 3600000 * 24 * 7,
            httpOnly: true,
          }).send({ token });
        });
    })
    .catch(next);
};

const getUser = (req, res, next) => (
  User.findById(req.params.userId)
    .orFail(() => {
      throw new NotFoundError('Пользователь не найден');
    })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'UserNotFound') {
        next(new NotFoundError('Пользователь не найден'));
      }
      if (err.name === 'CastError') {
        next(new ValidationError('Невалидный id пользователя'));
      }
      next(err);
    })
);

const getUsers = (req, res, next) => (
  User.find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch(next)
);

const getCurrentUser = (req, res, next) => (
  User.find({ _id: req.user._id })
    .then((users) => {
      res.status(200).send(users);
    })
    .catch(next)
);

const editUser = (req, res, next) => {
  const { name, about } = req.body;

  return User.findByIdAndUpdate(
    req.user._id,
    { name, about },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    },
  )
    .orFail(() => {
      throw new NotFoundError('Пользователь не найден');
    })
    .then((user) => {
      if (user._id !== req.user._id) {
        throw new NotAuthorizedError('Нет прав на редактирование профиля');
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'UserNotFound') {
        next(new NotFoundError('Пользователь не найден'));
      }
      if (err.name === 'ValidationError') {
        next(new ValidationError('Переданы невалидные данные'));
      }
      next(err);
    });
};

const changeUserAvatar = (req, res, next) => {
  const { avatar } = req.body;

  return User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true, // обработчик then получит на вход обновлённую запись
      runValidators: true, // данные будут валидированы перед изменением
    },
  )
    .orFail(() => {
      throw new NotFoundError('Пользователь не найден');
    })
    .then((user) => {
      if (user._id !== req.user._id) {
        throw new NotAuthorizedError('Нет прав на редактирование аватара');
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'UserNotFound') {
        next(new NotFoundError('Пользователь не найден'));
      }
      if (err.name === 'ValidationError') {
        next(new ValidationError('Переданы невалидные данные'));
      }
      next(err);
    });
};

module.exports = {
  createUser, getUser, getUsers, editUser, changeUserAvatar, login, getCurrentUser,
};
