import { Router } from 'express';
import multer from 'multer';
import importerController from '../controllers/importer.controller';
import { handle } from '../utils/api.util';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/', handle(importerController.getImporters));
router.post('/', handle(importerController.createImporter));
router.patch('/:id', handle(importerController.updateImporter));
router.delete('/:id', handle(importerController.deleteImporter));
router.get('/:id/execute', upload.single('inputFile'), handle(importerController.executeImporter));

export default router;
