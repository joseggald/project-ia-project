const { Router } = require('express');
const { register, login, confirmUser, verifySession } = require('../controllers/auth.controller');
const { getUserByToken } = require('../controllers/user.controller');

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/confirm', confirmUser);
router.post('/getUserByToken', getUserByToken);
router.post('/verifySession', verifySession);

module.exports =  router;
