import express from 'express';
import * as aiChatController from '../controllers/aiChatController';
import { authenticate } from '../middleware/authMiddleware';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// AI chat routes
router.get('/project/:projectId', aiChatController.getProjectAIChats);
router.get('/:chatId', aiChatController.getAIChatById);
router.post('/project/:projectId', aiChatController.createAIChat);
router.post('/:chatId/message', aiChatController.sendMessage);
router.put('/:chatId/settings', aiChatController.updateAIChatSettings);
router.delete('/:chatId', aiChatController.deleteAIChat);

export default router;