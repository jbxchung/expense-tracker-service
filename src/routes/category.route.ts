import { Router } from 'express';
import categoryController from '../controllers/category.controller';
import { requireAuth } from '../middlewares/auth.middleware';
import { handle } from '../utils/api.util';

const router = Router();

router.get('/tree', requireAuth, handle(categoryController.getCategoryTree));
router.post('/tree', requireAuth, handle(categoryController.saveCategoryTree));
router.get('/', requireAuth, handle(categoryController.getCategories));
router.post('/', requireAuth, handle(categoryController.createCategory));
router.patch('/:id', requireAuth, handle(categoryController.updateCategory));
router.delete('/:id', requireAuth, handle(categoryController.deleteCategory));

export default router;
