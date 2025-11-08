import { Router } from 'express';
import userController from '../controllers/user.controller';
import { handle } from '../utils/api.util';

const router = Router();

router.get('/', handle(userController.getAll));
router.get('/id/:id', handle(userController.getById));
router.get('/email/:email', handle(userController.getByEmail));
router.get('/search', handle(userController.getByName));

export default router;