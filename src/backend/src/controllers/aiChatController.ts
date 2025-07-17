import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import AIChat from '../models/AIChat';
import Project from '../models/Project';
import Content from '../models/Content';

// Get all AI chats for a project
export const getProjectAIChats = async (req: Request, res: Response): Promise<void> => {
  try {
    const { projectId } = req.params;
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

    // Get AI chats
    const aiChats = await AIChat.find({ projectId }).sort({ updatedAt: -1 });

    res.status(200).json({ aiChats });
  } catch (error) {
    console.error('Get project AI chats error:', error);
    res.status(500).json({ message: 'Server error while fetching AI chats' });
  }
};

// Get a single AI chat by ID
export const getAIChatById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { chatId } = req.params;
    const userId = (req as any).user?.id;
    
    if (!userId) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    // Validate chatId
    if (!mongoose.Types.ObjectId.isValid(chatId)) {
      res.status(400).json({ message: 'Invalid chat ID' });
      return;
    }

    // Find AI chat
    const aiChat = await AIChat.findById(chatId);
    
    if (!aiChat) {
      res.status(404).json({ message: 'AI chat not found' });
      return;
    }

    // Check if project exists and user has access
    const project = await Project.findById(aiChat.projectId);
    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    res.status(200).json({ aiChat });
  } catch (error) {
    console.error('Get AI chat by ID error:', error);
    res.status(500).json({ message: 'Server error while fetching AI chat' });
  }
};

// Create a new AI chat
export const createAIChat = async (req: Request, res: Response): Promise<void> => {
  try {
    const { projectId } = req.params;
    const { title, initialMessage } = req.body;
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

    // Check if AI is enabled for the project
    if (!project.settings.aiEnabled) {
      res.status(403).json({ message: 'AI features are disabled for this project' });
      return;
    }

    // Create AI chat
    const aiChat = new AIChat({
      projectId,
      createdBy: userId,
      title: title || 'New Chat',
      messages: [],
      context: {
        personality: {
          formality: 'neutral',
          verbosity: 'balanced',
          tone: 'friendly',
          approach: 'helpful',
        },
        relevantContent: [],
        settings: {
          proactiveMode: true,
          contextWindow: 10,
          suggestionsEnabled: true,
        },
      },
    });

    // Add initial message if provided
    if (initialMessage) {
      // Add user message
      aiChat.messages.push({
        id: uuidv4(),
        sender: 'user',
        senderId: userId,
        content: initialMessage,
        timestamp: new Date(),
      });

      // Add AI response (placeholder - in a real implementation, this would come from the AI service)
      aiChat.messages.push({
        id: uuidv4(),
        sender: 'ai',
        content: 'Hello! How can I help you with this project today?',
        timestamp: new Date(),
      });
    }

    await aiChat.save();

    res.status(201).json({ aiChat });
  } catch (error) {
    console.error('Create AI chat error:', error);
    res.status(500).json({ message: 'Server error while creating AI chat' });
  }
};

// Send a message to AI chat
export const sendMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { chatId } = req.params;
    const { content, attachments } = req.body;
    const userId = (req as any).user?.id;
    
    if (!userId) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    // Validate chatId
    if (!mongoose.Types.ObjectId.isValid(chatId)) {
      res.status(400).json({ message: 'Invalid chat ID' });
      return;
    }

    // Validate content
    if (!content) {
      res.status(400).json({ message: 'Message content is required' });
      return;
    }

    // Find AI chat
    const aiChat = await AIChat.findById(chatId);
    
    if (!aiChat) {
      res.status(404).json({ message: 'AI chat not found' });
      return;
    }

    // Check if project exists and user has access
    const project = await Project.findById(aiChat.projectId);
    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    // Check if AI is enabled for the project
    if (!project.settings.aiEnabled) {
      res.status(403).json({ message: 'AI features are disabled for this project' });
      return;
    }

    // Add user message
    const userMessage: IMessage = {
      id: uuidv4(),
      sender: 'user' as const,
      senderId: userId,
      content,
      timestamp: new Date(),
      attachments: attachments || [],
    };
    
    aiChat.messages.push(userMessage);

    // In a real implementation, we would call the AI service here
    // For now, we'll just add a placeholder response
    const aiResponse: IMessage = {
      id: uuidv4(),
      sender: 'ai' as const,
      content: `I received your message: "${content}". This is a placeholder response. In the actual implementation, this would be generated by the AI service.`,
      timestamp: new Date(),
    };
    
    aiChat.messages.push(aiResponse);

    await aiChat.save();

    res.status(200).json({ 
      message: userMessage,
      response: aiResponse
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Server error while sending message' });
  }
};

// Update AI chat settings
export const updateAIChatSettings = async (req: Request, res: Response): Promise<void> => {
  try {
    const { chatId } = req.params;
    const { personality, settings } = req.body;
    const userId = (req as any).user?.id;
    
    if (!userId) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    // Validate chatId
    if (!mongoose.Types.ObjectId.isValid(chatId)) {
      res.status(400).json({ message: 'Invalid chat ID' });
      return;
    }

    // Find AI chat
    const aiChat = await AIChat.findById(chatId);
    
    if (!aiChat) {
      res.status(404).json({ message: 'AI chat not found' });
      return;
    }

    // Check if project exists and user has access
    const project = await Project.findById(aiChat.projectId);
    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    // Update settings
    if (personality) {
      aiChat.context.personality = {
        ...aiChat.context.personality,
        ...personality,
      };
    }

    if (settings) {
      aiChat.context.settings = {
        ...aiChat.context.settings,
        ...settings,
      };
    }

    await aiChat.save();

    res.status(200).json({ 
      context: aiChat.context
    });
  } catch (error) {
    console.error('Update AI chat settings error:', error);
    res.status(500).json({ message: 'Server error while updating AI chat settings' });
  }
};

// Delete an AI chat
export const deleteAIChat = async (req: Request, res: Response): Promise<void> => {
  try {
    const { chatId } = req.params;
    const userId = (req as any).user?.id;
    
    if (!userId) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    // Validate chatId
    if (!mongoose.Types.ObjectId.isValid(chatId)) {
      res.status(400).json({ message: 'Invalid chat ID' });
      return;
    }

    // Find AI chat
    const aiChat = await AIChat.findById(chatId);
    
    if (!aiChat) {
      res.status(404).json({ message: 'AI chat not found' });
      return;
    }

    // Check if project exists and user has access
    const project = await Project.findById(aiChat.projectId);
    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    // Check if user is creator
    if (aiChat.createdBy.toString() !== userId) {
      res.status(403).json({ message: 'Permission denied' });
      return;
    }

    // Delete AI chat
    await AIChat.findByIdAndDelete(chatId);

    res.status(200).json({ message: 'AI chat deleted successfully' });
  } catch (error) {
    console.error('Delete AI chat error:', error);
    res.status(500).json({ message: 'Server error while deleting AI chat' });
  }
};