const Card = require('../models/card');
const {
  VALIDATION_ERROR_CODE,
  DEFAULT_ERROR_CODE,
  DATA_NOT_FOUND_ERROR_CODE,
} = require('../errors/status/status');
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

  return Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.status(201).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(VALIDATION_ERROR_CODE).send({ message: `Invalid data ${err}` });

        return;
      }

      res.status(DEFAULT_ERROR_CODE).send({ message: `Error while creating card ${err}` });
    });
};

const getCards = (req, res) => (
  Card.find({})
    .populate('owner')
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      res.status(DEFAULT_ERROR_CODE).send({ message: `Error while creating user ${err}` });
    })
);

const removeCard = (req, res) => (
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        res.status(DATA_NOT_FOUND_ERROR_CODE).send({ message: 'Передан несуществующий _id карточки' });
        return;
      }
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(VALIDATION_ERROR_CODE).send({ message: `Invalid data ${err}` });

        return;
      }

      res.status(DEFAULT_ERROR_CODE).send({ message: `Error while creating user ${err}` });
    })
);

const likeCard = (req, res) => (
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(DATA_NOT_FOUND_ERROR_CODE).send({ message: 'Передан несуществующий _id карточки' });
        return;
      }
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(VALIDATION_ERROR_CODE).send({ message: `Invalid data ${err}` });

        return;
      }

      if (err.name === 'CastError') {
        res.status(VALIDATION_ERROR_CODE).send({ message: `Card not found ${err}` });

        return;
      }

      res.status(DEFAULT_ERROR_CODE).send({ message: `Error while creating user ${err}` });
    })
);

const dislikeCard = (req, res) => (
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        res.status(DATA_NOT_FOUND_ERROR_CODE).send({ message: 'Передан несуществующий _id карточки' });
        return;
      }
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(VALIDATION_ERROR_CODE).send({ message: `Invalid data ${err}` });

        return;
      }

      if (err.name === 'CastError') {
        res.status(VALIDATION_ERROR_CODE).send({ message: `Card not found ${err}` });

        return;
      }

      res.status(DEFAULT_ERROR_CODE).send({ message: `Error while creating user ${err}` });
    })
);

module.exports = { createCard, getCards, removeCard, likeCard, dislikeCard };
