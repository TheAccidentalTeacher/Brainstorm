import express from 'express';
import * as projectController from '../controllers/projectController';
import { authenticate } from '../middleware/authMiddleware';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Project routes
router.get('/', projectController.getUserProjects);
router.post('/', projectController.createProject);
router.get('/:projectId', projectController.getProjectById);
router.put('/:projectId', projectController.updateProject);
router.delete('/:projectId', projectController.deleteProject);
router.put('/:projectId/permissions', projectController.updateProjectPermissions);

export default router;