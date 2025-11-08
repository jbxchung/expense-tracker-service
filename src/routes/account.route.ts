import { Router } from 'express';
import accountController from '../controllers/account.controller';
import { handle } from '../utils/api.util';

const router = Router();

router.get('/', handle(accountController.getAccounts));
router.get('/:id', handle(accountController.getAccountById));
router.post('/', handle(accountController.createAccount));
router.patch('/:id', handle(accountController.updateAccount));
router.delete('/:id', handle(accountController.deleteAccount));

export default router;
