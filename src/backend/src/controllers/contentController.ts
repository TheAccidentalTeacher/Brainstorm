import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Content, { Note, Task, MindMap } from '../models/Content';
import Project from '../models/Project';

// Get all content for a project
export const getProjectContent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { projectId } = req.params;
    const { type, parentId } = req.query;
    const userId = (req as any).user?.id;
    
    if (!userId) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    // Validate projectId
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      res.status(400).json({ message: 'Invalid project ID' });
      return;
    }

    // Check if project exists and user has access
    const project = await Project.findById(projectId);
    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    // Build query
    const query: any = { projectId };
    
    // Filter by content type if specified
    if (type) {
      query.type = type;
    }
    
    // Filter by parent if specified
    if (parentId) {
      if (parentId === 'root') {
        query.parentId = { $exists: false };
      } else if (mongoose.Types.ObjectId.isValid(parentId as string)) {
        query.parentId = parentId;
      } else {
        res.status(400).json({ message: 'Invalid parent ID' });
        return;
      }
    }

    // Get content
    const content = await Content.find(query).sort({ order: 1, updatedAt: -1 });

    res.status(200).json({ content });
  } catch (error) {
    console.error('Get project content error:', error);
    res.status(500).json({ message: 'Server error while fetching content' });
  }
};

// Get a single content item by ID
export const getContentById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { contentId } = req.params;
    const userId = (req as any).user?.id;
    
    if (!userId) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    // Validate contentId
    if (!mongoose.Types.ObjectId.isValid(contentId)) {
      res.status(400).json({ message: 'Invalid content ID' });
      return;
    }

    // Find content
    const content = await Content.findById(contentId);
    
    if (!content) {
      res.status(404).json({ message: 'Content not found' });
      return;
    }

    // Check if project exists and user has access
    const project = await Project.findById(content.projectId);
    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    res.status(200).json({ content });
  } catch (error) {
    console.error('Get content by ID error:', error);
    res.status(500).json({ message: 'Server error while fetching content' });
  }
};

// Create a note
export const createNote = async (req: Request, res: Response): Promise<void> => {
  try {
    const { projectId } = req.params;
    const { title, content, format, parentId, tags } = req.body;
    const userId = (req as any).user?.id;
    
    if (!userId) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    // Validate required fields
    if (!title || !content) {
      res.status(400).json({ message: 'Title and content are required' });
      return;
    }

    // Validate projectId
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      res.status(400).json({ message: 'Invalid project ID' });
      return;
    }

    // Check if project exists and user has access
    const project = await Project.findById(projectId);
    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    // Validate parentId if provided
    if (parentId && !mongoose.Types.ObjectId.isValid(parentId)) {
      res.status(400).json({ message: 'Invalid parent ID' });
      return;
    }

    // Create note
    const note = new Note({
      type: 'note',
      title,
      projectId,
      createdBy: userId,
      updatedBy: userId,
      parentId: parentId || undefined,
      tags: tags || [],
      content: {
        richText: content,
        format: format || 'richtext',
        attachments: [],
        collaborators: [userId],
        lastEditedAt: new Date(),
      },
      contentType: 'note',
      version: 1,
      isArchived: false,
    });

    await note.save();

    res.status(201).json({ note });
  } catch (error) {
    console.error('Create note error:', error);
    res.status(500).json({ message: 'Server error while creating note' });
  }
};

// Update a note
export const updateNote = async (req: Request, res: Response): Promise<void> => {
  try {
    const { contentId } = req.params;
    const { title, content, format, tags } = req.body;
    const userId = (req as any).user?.id;
    
    if (!userId) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    // Validate contentId
    if (!mongoose.Types.ObjectId.isValid(contentId)) {
      res.status(400).json({ message: 'Invalid content ID' });
      return;
    }

    // Find note
    const note = await Note.findById(contentId);
    
    if (!note) {
      res.status(404).json({ message: 'Note not found' });
      return;
    }

    // Check if project exists and user has access
    const project = await Project.findById(note.projectId);
    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    // Update fields
    if (title) note.title = title;
    if (content) note.content.richText = content;
    if (format) note.content.format = format;
    if (tags) note.tags = tags;
    
    note.updatedBy = userId;
    note.content.lastEditedAt = new Date();
    note.version += 1;

    // Add user to collaborators if not already present
    if (!note.content.collaborators.includes(userId)) {
      note.content.collaborators.push(userId);
    }

    await note.save();

    res.status(200).json({ note });
  } catch (error) {
    console.error('Update note error:', error);
    res.status(500).json({ message: 'Server error while updating note' });
  }
};

// Create a task
export const createTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { projectId } = req.params;
    const { 
      title, description, status, priority, assignees, 
      dueDate, startDate, parentId, tags 
    } = req.body;
    const userId = (req as any).user?.id;
    
    if (!userId) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    // Validate required fields
    if (!title || !description) {
      res.status(400).json({ message: 'Title and description are required' });
      return;
    }

    // Validate projectId
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      res.status(400).json({ message: 'Invalid project ID' });
      return;
    }

    // Check if project exists and user has access
    const project = await Project.findById(projectId);
    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    // Validate parentId if provided
    if (parentId && !mongoose.Types.ObjectId.isValid(parentId)) {
      res.status(400).json({ message: 'Invalid parent ID' });
      return;
    }

    // Create task
    const task = new Task({
      type: 'task',
      title,
      projectId,
      createdBy: userId,
      updatedBy: userId,
      parentId: parentId || undefined,
      tags: tags || [],
      content: {
        description,
        status: status || 'todo',
        priority: priority || 'medium',
        assignees: assignees || [userId],
        dueDate: dueDate ? new Date(dueDate) : undefined,
        startDate: startDate ? new Date(startDate) : undefined,
        subtasks: [],
        dependencies: [],
        comments: [],
      },
      contentType: 'task',
      version: 1,
      isArchived: false,
    });

    await task.save();

    res.status(201).json({ task });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ message: 'Server error while creating task' });
  }
};

// Update a task
export const updateTask = async (req: Request, res: Response): Promise<void> => {
  try {
    const { contentId } = req.params;
    const { 
      title, description, status, priority, assignees, 
      dueDate, startDate, completedAt, tags 
    } = req.body;
    const userId = (req as any).user?.id;
    
    if (!userId) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    // Validate contentId
    if (!mongoose.Types.ObjectId.isValid(contentId)) {
      res.status(400).json({ message: 'Invalid content ID' });
      return;
    }

    // Find task
    const task = await Task.findById(contentId);
    
    if (!task) {
      res.status(404).json({ message: 'Task not found' });
      return;
    }

    // Check if project exists and user has access
    const project = await Project.findById(task.projectId);
    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    // Update fields
    if (title) task.title = title;
    if (description) task.content.description = description;
    if (status) task.content.status = status;
    if (priority) task.content.priority = priority;
    if (assignees) task.content.assignees = assignees;
    if (dueDate !== undefined) task.content.dueDate = dueDate ? new Date(dueDate) : undefined;
    if (startDate !== undefined) task.content.startDate = startDate ? new Date(startDate) : undefined;
    if (completedAt !== undefined) {
      task.content.completedAt = completedAt ? new Date(completedAt) : undefined;
      
      // If task is marked as completed, update status
      if (completedAt && task.content.status !== 'done') {
        task.content.status = 'done';
      }
      
      // If task is marked as not completed, update status if it was done
      if (!completedAt && task.content.status === 'done') {
        task.content.status = 'inprogress';
      }
    }
    if (tags) task.tags = tags;
    
    task.updatedBy = userId;
    task.version += 1;

    await task.save();

    res.status(200).json({ task });
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ message: 'Server error while updating task' });
  }
};

// Create a mind map
export const createMindMap = async (req: Request, res: Response): Promise<void> => {
  try {
    const { projectId } = req.params;
    const { title, nodes, edges, layout, parentId, tags } = req.body;
    const userId = (req as any).user?.id;
    
    if (!userId) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    // Validate required fields
    if (!title || !nodes || !Array.isArray(nodes) || nodes.length === 0) {
      res.status(400).json({ message: 'Title and at least one node are required' });
      return;
    }

    // Validate projectId
    if (!mongoose.Types.ObjectId.isValid(projectId)) {
      res.status(400).json({ message: 'Invalid project ID' });
      return;
    }

    // Check if project exists and user has access
    const project = await Project.findById(projectId);
    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    // Validate parentId if provided
    if (parentId && !mongoose.Types.ObjectId.isValid(parentId)) {
      res.status(400).json({ message: 'Invalid parent ID' });
      return;
    }

    // Create mind map
    const mindMap = new MindMap({
      type: 'mindmap',
      title,
      projectId,
      createdBy: userId,
      updatedBy: userId,
      parentId: parentId || undefined,
      tags: tags || [],
      content: {
        nodes: nodes.map((node: any) => ({
          id: node.id,
          content: node.content,
          position: node.position || { x: 0, y: 0 },
          style: node.style || {},
          parentId: node.parentId,
        })),
        edges: edges || [],
        layout: layout || 'radial',
        viewport: {
          zoom: 1,
          position: { x: 0, y: 0 },
        },
      },
      contentType: 'mindmap',
      version: 1,
      isArchived: false,
    });

    await mindMap.save();

    res.status(201).json({ mindMap });
  } catch (error) {
    console.error('Create mind map error:', error);
    res.status(500).json({ message: 'Server error while creating mind map' });
  }
};

// Update a mind map
export const updateMindMap = async (req: Request, res: Response): Promise<void> => {
  try {
    const { contentId } = req.params;
    const { title, nodes, edges, layout, viewport, tags } = req.body;
    const userId = (req as any).user?.id;
    
    if (!userId) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    // Validate contentId
    if (!mongoose.Types.ObjectId.isValid(contentId)) {
      res.status(400).json({ message: 'Invalid content ID' });
      return;
    }

    // Find mind map
    const mindMap = await MindMap.findById(contentId);
    
    if (!mindMap) {
      res.status(404).json({ message: 'Mind map not found' });
      return;
    }

    // Check if project exists and user has access
    const project = await Project.findById(mindMap.projectId);
    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    // Update fields
    if (title) mindMap.title = title;
    if (nodes) mindMap.content.nodes = nodes;
    if (edges) mindMap.content.edges = edges;
    if (layout) mindMap.content.layout = layout;
    if (viewport) mindMap.content.viewport = viewport;
    if (tags) mindMap.tags = tags;
    
    mindMap.updatedBy = userId;
    mindMap.version += 1;

    await mindMap.save();

    res.status(200).json({ mindMap });
  } catch (error) {
    console.error('Update mind map error:', error);
    res.status(500).json({ message: 'Server error while updating mind map' });
  }
};

// Delete content
export const deleteContent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { contentId } = req.params;
    const userId = (req as any).user?.id;
    
    if (!userId) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    // Validate contentId
    if (!mongoose.Types.ObjectId.isValid(contentId)) {
      res.status(400).json({ message: 'Invalid content ID' });
      return;
    }

    // Find content
    const content = await Content.findById(contentId);
    
    if (!content) {
      res.status(404).json({ message: 'Content not found' });
      return;
    }

    // Check if project exists and user has access
    const project = await Project.findById(content.projectId);
    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    // Check if user is creator or has admin permissions
    if (content.createdBy.toString() !== userId) {
      // TODO: Check if user has admin permissions
      // For now, only allow creator to delete
      res.status(403).json({ message: 'Permission denied' });
      return;
    }

    // Delete content
    await Content.findByIdAndDelete(contentId);

    // TODO: Delete any child content if applicable

    res.status(200).json({ message: 'Content deleted successfully' });
  } catch (error) {
    console.error('Delete content error:', error);
    res.status(500).json({ message: 'Server error while deleting content' });
  }
};