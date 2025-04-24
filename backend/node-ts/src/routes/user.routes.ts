import { Router } from 'express';
import { register, login, confirmUser, verifySession } from '../controllers/auth.controller';
import { getUserByToken } from '../controllers/user.controller';

const router = Router();

// Rutas de autenticación
router.post('/register', register);
router.post('/login', login);
router.post('/confirm', confirmUser);
router.post('/getUserByToken', getUserByToken);
router.post('/verifySession', verifySession);

module.exports = router;
