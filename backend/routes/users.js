const router = require('express').Router();
const { createUser, getUser, getUsers, editUser, changeUserAvatar } = require("../controllers/users");

router.get("/users", getUsers);
router.get("/users/:userId", getUser);
router.post("/users", createUser);
router.patch("/users/me", editUser);
router.patch("/users/me/avatar", changeUserAvatar);

module.exports = router;
