const Card = require("../models/card");

// 200 - запрос прошел успешно
// 201 - запрос прошел успешно, ресурс создан
// 401 - не авторизован
// 403 - нет прав нет доступа
// 500 - ошибка сервера
// 400 - невалидные данные
// 422 - невозможно обработать данные
// 404 - нет ресурса

const createCard = (req, res) => {
  const { name, link } = req.body;

  return Card.create({ name, link })
    .then((card) => {
      res.status(201).send(card);
    })
    .catch((err) => {
      res.status(500).send({ message: `Error while creating card ${err}` });
    });
}

const getCards = (req, res) => {

}

const removeCard = (req, res) => {

}

module.exports = { createCard, getCards, removeCard };
