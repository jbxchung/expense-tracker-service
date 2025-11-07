import { Router } from 'express';
import userController from '../controllers/user.controller';

const router = Router();

router.get('/', userController.getAll);
router.get('/id/:id', userController.getById);
router.get('/email/:email', userController.getByEmail);
router.get('/search', userController.getByName);

export default router;