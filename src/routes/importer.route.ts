import { Router } from 'express';
import multer from 'multer';
import importerController from 'controllers/importer.controller';
import { requireAuth } from 'middlewares/auth.middleware';
import { handle } from 'utils/api.util';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/', requireAuth, handle(importerController.getImporters));
router.post('/', requireAuth, handle(importerController.createImporter));
router.patch('/:id', requireAuth, handle(importerController.updateImporter));
router.delete('/:id', requireAuth, handle(importerController.deleteImporter));
router.post('/:id/execute', requireAuth, upload.single('inputFile'), handle(importerController.executeImporter));

export default router;
