const User = require("../models/user");

// 200 - запрос прошел успешно
// 201 - запрос прошел успешно, ресурс создан
// 401 - не авторизован
// 403 - нет прав нет доступа
// 500 - ошибка сервера
// 400 - невалидные данные
// 422 - невозможно обработать данные
// 404 - нет ресурса

const createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  return User.create({ name, about, avatar })
    .then((user) => {
      res.status(201).send(user);
    })
    .catch((err) => {
      res.status(500).send({ message: `Error while creating user ${err}` });
    });
}

const getUser = (req, res) => {

}

const getUsers = (req, res) => {

}

module.exports = { createUser, getUser, getUsers };
