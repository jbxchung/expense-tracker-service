import { Router } from 'express';
import multer from 'multer';
import pluginController from '../controllers/plugin.controller';
import { handle } from '../utils/api.util';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/', handle(pluginController.getPlugins));
router.post('/', upload.single('handlerFile'), handle(pluginController.createPlugin));
router.patch('/:id', upload.single('handlerFile'), handle(pluginController.updatePlugin));
router.delete('/:id', handle(pluginController.deletePlugin));
router.get('/:id/execute', upload.single('inputFile'), handle(pluginController.executePlugin));

export default router;
