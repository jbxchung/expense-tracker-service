import { Router } from 'express';
import {
  getAccounts,
  getAccountById,
  createAccount,
  deleteAccount,
} from '../controllers/accountController';

const router = Router();

router.get('/', getAccounts);
router.get('/:id', getAccountById);
router.post('/', createAccount);
router.delete('/:id', deleteAccount);

export default router;