import { Router } from 'express';
import accountController from 'controllers/account.controller';
import { requireAuth } from 'middlewares/auth.middleware';
import { handle } from 'utils/api.util';

const router = Router();

router.get('/', requireAuth, handle(accountController.getAccounts));
router.get('/:id', requireAuth, handle(accountController.getAccountById));
router.post('/', requireAuth, handle(accountController.createAccount));
router.patch('/:id', requireAuth, handle(accountController.updateAccount));
router.delete('/:id', requireAuth, handle(accountController.deleteAccount));

export default router;
