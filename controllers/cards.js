const Card = require('../models/card');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const NotAuthorizedError = require('../errors/NotAuthorizedError');

const createCard = (req, res, next) => {
  const { name, link } = req.body;

  return Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.status(201).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Невалидные данные'));
      }

      next(err);
    });
};

const getCards = (req, res, next) => (
  Card.find({})
    .populate('owner')
    .then((card) => {
      res.status(200).send(card);
    })
    .catch(next)
);

const removeCard = (req, res, next) => (
  Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Передан несуществующий _id карточки');
      }
      if (card.owner !== req.user._id) {
        throw new NotAuthorizedError('Нет прав на удаление карточки');
      }
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new ValidationError('Переданы невалидные данные'));
      }

      next(err);
    })
);

const likeCard = (req, res, next) => (
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Передан несуществующий _id карточки');
      }
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Переданы невалидные данные'));
      }

      if (err.name === 'CastError') {
        next(new NotFoundError('Карточка не найдена'));
      }

      next(err);
    })
);

const dislikeCard = (req, res, next) => (
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError('Передан несуществующий _id карточки');
      }
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new ValidationError('Переданы невалидные данные'));
      }

      if (err.name === 'CastError') {
        next(new NotFoundError('Карточка не найдена'));
      }

      next(err);
    })
);

module.exports = { createCard, getCards, removeCard, likeCard, dislikeCard };
