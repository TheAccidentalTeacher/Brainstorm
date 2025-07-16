import express from 'express';
import * as collaborationController from '../controllers/collaborationController';
import { authenticate } from '../middleware/authMiddleware';

const router = express.Router();

// All routes require authentication
router.use(authenticate);

// Get document state for collaborative editing
router.get('/document/:documentId', collaborationController.getDocumentState);

// Update document state from collaborative editing
router.put('/document/:documentId', collaborationController.updateDocumentState);

// Get active collaborators for a document
router.get('/document/:documentId/collaborators', collaborationController.getActiveCollaborators);

export default router;