import { Router } from 'express';
import categoryController from '../controllers/category.controller';
import { handle } from '../utils/api.util';

const router = Router();

router.get('/tree', handle(categoryController.getCategoryTree));
router.post('/tree', handle(categoryController.saveCategoryTree));
router.get('/', handle(categoryController.getCategories));
router.post('/', handle(categoryController.createCategory));
router.patch('/:id', handle(categoryController.updateCategory));
router.delete('/:id', handle(categoryController.deleteCategory));

export default router;
