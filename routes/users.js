const router = require('express').Router();
const { createUser, getUser, getUsers, editUser, changeUserAvatar, login } = require('../controllers/users');

router.get('/users', getUsers);
router.get('/users/:userId', getUser);
router.post('/users', createUser);
router.post('/signin', login);
router.post('/signup', createUser);
router.patch('/users/me', editUser);
router.patch('/users/me/avatar', changeUserAvatar);

module.exports = router;
