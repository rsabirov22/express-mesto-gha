const router = require('express').Router();
const { createCard, getCards, removeCard, likeCard, dislikeCard } = require("../controllers/cards");

router.get("/cards", getCards);
router.delete("/cards/:cardId", removeCard);
router.post("/cards", createCard);
router.put("/cards/:cardId/likes", likeCard);
router.delete("/cards/:cardId/likes", dislikeCard);

module.exports = router;
