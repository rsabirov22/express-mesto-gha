const User = require('../models/user');
const UserNotFound = require('../errors/UserNotFound');

// 200 - запрос прошел успешно
// 201 - запрос прошел успешно, ресурс создан
// 401 - не авторизован
// 403 - нет прав нет доступа
// 500 - ошибка сервера
// 400 - невалидные данные
// 422 - невозможно обработать данные
// 404 - нет ресурса
const VALIDATION_ERROR_CODE = 400;
const DEFAULT_ERROR_CODE = 500;

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  return User.create({ name, about, avatar })
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(VALIDATION_ERROR_CODE).send({ message: `Error while validating user ${err}` });

        return;
      }
      res.status(DEFAULT_ERROR_CODE).send({ message: `Error while creating user ${err}` });
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
      res.status(500).send({ message: `Error ${err}` });
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

module.exports = { createUser, getUser, getUsers, editUser, changeUserAvatar };
