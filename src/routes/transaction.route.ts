import { Router } from 'express';
import transactionController from '../controllers/transaction.controller';
import { requireAuth } from '../middlewares/auth.middleware';
import { handle } from '../utils/api.util';

const router = Router();

router.get('/', requireAuth, handle(transactionController.getTransactions));
router.post('/', requireAuth, handle(transactionController.createTransaction));
router.patch('/:id', requireAuth, handle(transactionController.updateTransaction));
router.delete('/:id', requireAuth, handle(transactionController.deleteTransaction));

export default router;
