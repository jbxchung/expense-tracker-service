import { Router } from 'express';
import {
  uploadStatement,
  getStatements,
  getStatementById,
  deleteStatement,
} from '../controllers/statement.controller';

const router = Router();

router.post('/', uploadStatement);
router.get('/', getStatements);
router.get('/:id', getStatementById);
router.delete('/:id', deleteStatement);

export default router;