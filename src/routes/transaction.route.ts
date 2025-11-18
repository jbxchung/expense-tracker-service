import { Router } from 'express';
import transactionController from '../controllers/transaction.controller';
import { handle } from '../utils/api.util';

const router = Router();

router.get('/', handle(transactionController.getTransactions));
router.post('/', handle(transactionController.createTransaction));
router.patch('/:id', handle(transactionController.updateTransaction));
router.delete('/:id', handle(transactionController.deleteTransaction));

export default router;
