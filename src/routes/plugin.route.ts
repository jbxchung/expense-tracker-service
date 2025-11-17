import { Router } from 'express';
import multer from 'multer';
import pluginController from '../controllers/plugin.controller';
import { handle } from '../utils/api.util';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/', handle(pluginController.getPlugins));
router.post('/', handle(pluginController.createPlugin));
router.patch('/:id', handle(pluginController.updatePlugin));
router.delete('/:id', handle(pluginController.deletePlugin));
router.get('/:id/execute', upload.single('file'), handle(pluginController.executePlugin));

export default router;
