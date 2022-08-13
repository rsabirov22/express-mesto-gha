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
  console.log(req.user._id)
  const { name, link } = req.body;

  return Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      res.status(201).send(card);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(400).send({ message: `Invalid data ${err}` });

        return;
      }

      res.status(500).send({ message: `Error while creating card ${err}` });
    });
}

const getCards = (req, res) => {
  return Card.find({})
    .populate('owner')
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(400).send({ message: `Invalid data ${err}` });

        return;
      }

      res.status(500).send({ message: `Error while creating user ${err}` });
    });
}

const removeCard = (req, res) => {
  return Card.findByIdAndRemove(req.params.cardId)
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(400).send({ message: `Invalid data ${err}` });

        return;
      }

      res.status(500).send({ message: `Error while creating user ${err}` });
    });
}

const likeCard = (req, res) => {
  return Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(400).send({ message: `Invalid data ${err}` });

        return;
      }

      res.status(500).send({ message: `Error while creating user ${err}` });
    });
}

const dislikeCard = (req, res) => {
  return Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((card) => {
      res.status(200).send(card);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(400).send({ message: `Invalid data ${err}` });

        return;
      }

      res.status(500).send({ message: `Error while creating user ${err}` });
    });
}

module.exports = { createCard, getCards, removeCard, likeCard, dislikeCard };
