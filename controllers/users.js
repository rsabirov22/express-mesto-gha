const bcrypt = require('bcryptjs');
const User = require('../models/user');
const UserNotFound = require('../errors/UserNotFound');
const { getJwtToken } = require('../utils/jwt');
const {
  VALIDATION_ERROR_CODE,
  DEFAULT_ERROR_CODE,
} = require('../errors/status/status');

const SALT_ROUNDS = 10;

// 200 - запрос прошел успешно
// 201 - запрос прошел успешно, ресурс создан
// 401 - не авторизован
// 403 - нет прав нет доступа
// 500 - ошибка сервера
// 400 - невалидные данные
// 422 - невозможно обработать данные
// 404 - нет ресурса

const createUser = (req, res) => {
  const { name, about, avatar, email, password } = req.body;
  if (!email || !password) return res.status(VALIDATION_ERROR_CODE).send({ message: 'Email или пароль не могут быть пустыми' });
  return bcrypt.hash(password, SALT_ROUNDS)
    .then((hash) => User.create({ name, about, avatar, email, password: hash }))
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      if (err.code === 11000) {
        res.status(USER_EXISTS).send({ message: 'Такой пользователь уже существует' });

        return;
      }
      if (err.name === 'ValidationError') {
        res.status(VALIDATION_ERROR_CODE).send({ message: `Error while validating user ${err}` });

        return;
      }
      res.status(DEFAULT_ERROR_CODE).send({ message: `Error while creating user ${err}` });
    });
};

const login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(VALIDATION_ERROR_CODE).send({ message: 'Email или пароль не могут быть пустыми' });

  return User.findOne({ email })
    .then((user) => {
      if (!user) return res.status(NOT_AUTHORIZED).send({ message: 'Неверная почта или пароль' });
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) return res.status(NOT_AUTHORIZED).send({ message: 'Неверная почта или пароль' });

          const token = getJwtToken();

          return res.status(200).cookie('jwt', token, {
            maxAge: 3600000 * 24 * 7,
            httpOnly: true,
          }).send({ token });
        });
    })
    .catch((err) => {
      res.status(DEFAULT_ERROR_CODE).send({ message: `Error ${err}` });
    });
};

const getUser = (req, res) => (
  User.findById(req.params.userId)
    .orFail(() => {
      throw new UserNotFound();
    })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'UserNotFound') {
        res.status(err.status).send({ message: err.message });

        return;
      }
      if (err.name === 'CastError') {
        res.status(VALIDATION_ERROR_CODE).send({ message: 'Невалидный id пользователя' });

        return;
      }
      res.status(DEFAULT_ERROR_CODE).send({ message: `Error ${err}` });
    })
);

const getUsers = (req, res) => (
  User.find({})
    .then((users) => {
      res.status(200).send(users);
    })
    .catch((err) => {
      res.status(DEFAULT_ERROR_CODE).send({ message: `Error ${err}` });
    })
);

const editUser = (req, res) => {
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
      throw new UserNotFound();
    })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'UserNotFound') {
        res.status(err.status).send({ message: err.message });

        return;
      }
      if (err.name === 'ValidationError') {
        res.status(VALIDATION_ERROR_CODE).send({ message: `Invalid data ${err}` });

        return;
      }
      res.status(DEFAULT_ERROR_CODE).send({ message: `Error while creating user ${err}` });
    });
};

const changeUserAvatar = (req, res) => {
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
      throw new UserNotFound();
    })
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if (err.name === 'UserNotFound') {
        res.status(err.status).send({ message: err.message });

        return;
      }
      if (err.name === 'ValidationError') {
        res.status(VALIDATION_ERROR_CODE).send({ message: `Invalid data ${err}` });

        return;
      }
      res.status(DEFAULT_ERROR_CODE).send({ message: `Error while creating user ${err}` });
    });
};

module.exports = { createUser, getUser, getUsers, editUser, changeUserAvatar, login };
