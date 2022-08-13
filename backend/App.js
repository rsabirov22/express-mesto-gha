const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const usersRouter = require('./routes/users');
const cardsRouter = require('./routes/cards');

const app = express();

const { PORT = 3000 } = process.env;

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb');

// подключаем мидлвары, роуты и всё остальное...
app.use((req, res, next) => {
  req.user = {
    _id: '62f38de1979629b38bb58c6f' // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/", usersRouter);
app.use("/users/me", usersRouter);
app.use("/users/me/avatar", usersRouter);
app.use("/", cardsRouter);
app.use("/cards/:cardId", cardsRouter);
app.use("/cards/:cardId/likes", cardsRouter);

app.use(express.static(path.join(__dirname, "public")));
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
