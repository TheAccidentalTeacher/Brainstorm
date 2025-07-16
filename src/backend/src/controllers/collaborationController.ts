import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Note } from '../models/Content';
import Project from '../models/Project';

// Get document state for collaborative editing
export const getDocumentState = async (req: Request, res: Response): Promise<void> => {
  try {
    const { documentId } = req.params;
    const userId = (req as any).user?.id;
    
    if (!userId) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    // Validate documentId
    if (!mongoose.Types.ObjectId.isValid(documentId)) {
      res.status(400).json({ message: 'Invalid document ID' });
      return;
    }

    // Find document
    const document = await Note.findById(documentId);
    
    if (!document) {
      res.status(404).json({ message: 'Document not found' });
      return;
    }

    // Check if project exists and user has access
    const project = await Project.findById(document.projectId);
    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    // Add user to collaborators if not already present
    if (!document.content.collaborators.includes(userId)) {
      document.content.collaborators.push(userId);
      await document.save();
    }

    // Return document state
    res.status(200).json({
      document: {
        id: document._id,
        title: document.title,
        content: document.content.richText,
        format: document.content.format,
        version: document.version,
        lastEditedAt: document.content.lastEditedAt,
        collaborators: document.content.collaborators,
      }
    });
  } catch (error) {
    console.error('Get document state error:', error);
    res.status(500).json({ message: 'Server error while fetching document state' });
  }
};

// Update document state from collaborative editing
export const updateDocumentState = async (req: Request, res: Response): Promise<void> => {
  try {
    const { documentId } = req.params;
    const { content, version } = req.body;
    const userId = (req as any).user?.id;
    
    if (!userId) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    // Validate documentId
    if (!mongoose.Types.ObjectId.isValid(documentId)) {
      res.status(400).json({ message: 'Invalid document ID' });
      return;
    }

    // Find document
    const document = await Note.findById(documentId);
    
    if (!document) {
      res.status(404).json({ message: 'Document not found' });
      return;
    }

    // Check if project exists and user has access
    const project = await Project.findById(document.projectId);
    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    // Check for version conflicts
    if (version && version < document.version) {
      res.status(409).json({ 
        message: 'Version conflict', 
        currentVersion: document.version,
        yourVersion: version
      });
      return;
    }

    // Update document
    document.content.richText = content;
    document.updatedBy = userId;
    document.content.lastEditedAt = new Date();
    document.version += 1;

    // Add user to collaborators if not already present
    if (!document.content.collaborators.includes(userId)) {
      document.content.collaborators.push(userId);
    }

    await document.save();

    res.status(200).json({ 
      success: true,
      version: document.version,
      lastEditedAt: document.content.lastEditedAt
    });
  } catch (error) {
    console.error('Update document state error:', error);
    res.status(500).json({ message: 'Server error while updating document state' });
  }
};

// Get active collaborators for a document
export const getActiveCollaborators = async (req: Request, res: Response): Promise<void> => {
  try {
    const { documentId } = req.params;
    const userId = (req as any).user?.id;
    
    if (!userId) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    // Validate documentId
    if (!mongoose.Types.ObjectId.isValid(documentId)) {
      res.status(400).json({ message: 'Invalid document ID' });
      return;
    }

    // Find document
    const document = await Note.findById(documentId)
      .populate('content.collaborators', 'name email avatar');
    
    if (!document) {
      res.status(404).json({ message: 'Document not found' });
      return;
    }

    // Check if project exists and user has access
    const project = await Project.findById(document.projectId);
    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    // Return collaborators
    res.status(200).json({
      collaborators: document.content.collaborators
    });
  } catch (error) {
    console.error('Get active collaborators error:', error);
    res.status(500).json({ message: 'Server error while fetching collaborators' });
  }
};