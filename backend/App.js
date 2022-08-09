const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const usersRouter = require('./routes/users');

const app = express();

const { PORT = 300 } = process.env;

// подключаемся к серверу mongo
mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
  useCreateIndex: true,
    useFindAndModify: false
});

// подключаем мидлвары, роуты и всё остальное...
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
app.use("/", usersRouter);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
});
