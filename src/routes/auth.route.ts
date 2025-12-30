import { Router } from 'express';
import authController from '../controllers/auth.controller';
import { requireAuth } from '../middlewares/auth.middleware';
import { handle } from '../utils/api.util';

const router = Router();

router.get('/session', requireAuth, handle(authController.getSession));
router.post('/signup', handle(authController.signup));
router.post('/login', handle(authController.login));
router.post('/logout', handle(authController.logout));

export default router;
