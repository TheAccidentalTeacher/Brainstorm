import express from 'express';
import * as contentController from '../controllers/contentController';
import { authenticate } from '../middleware/authMiddleware';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get all content for a project
router.get('/project/:projectId', contentController.getProjectContent);

// Get a single content item by ID
router.get('/:contentId', contentController.getContentById);

// Create content
router.post('/project/:projectId/note', contentController.createNote);
router.post('/project/:projectId/task', contentController.createTask);
router.post('/project/:projectId/mindmap', contentController.createMindMap);

// Update content
router.put('/note/:contentId', contentController.updateNote);
router.put('/task/:contentId', contentController.updateTask);
router.put('/mindmap/:contentId', contentController.updateMindMap);

// Delete content
router.delete('/:contentId', contentController.deleteContent);

export default router;