import { Router } from 'express';
import userController from '../controllers/user.controller';
import { requireAuth } from '../middlewares/auth.middleware';
import { handle } from '../utils/api.util';

const router = Router();

router.get('/', requireAuth, handle(userController.getAll));
router.get('/id/:id', requireAuth, handle(userController.getById));
router.get('/email/:email', requireAuth, handle(userController.getByEmail));
router.get('/search', requireAuth, handle(userController.getByName));

export default router;