const router = require('express').Router();
const { createCard, getCards, removeCard } = require("../controllers/cards");

router.get("/cards", getCards);
router.delete("/cards/:cardId", removeCard);
router.post("/cards", createCard);

module.exports = router;
