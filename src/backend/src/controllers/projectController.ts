import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Project, { IProject } from '../models/Project';
import User from '../models/User';
import Team from '../models/Team';

// Get all projects for the current user
export const getUserProjects = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as any).user?.id;
    
    if (!userId) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    // Get user's teams
    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    // Find projects where user is creator or has a role in permissions
    const projects = await Project.find({
      $or: [
        { createdBy: userId },
        { teamId: { $in: user.teams } },
        { 'permissions.roles': { $exists: true, $ne: {} } }
      ]
    }).sort({ updatedAt: -1 });

    res.status(200).json({ projects });
  } catch (error) {
    console.error('Get user projects error:', error);
    res.status(500).json({ message: 'Server error while fetching projects' });
  }
};

// Get a single project by ID
export const getProjectById = async (req: Request, res: Response): Promise<void> => {
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

    // Find project
    const project = await Project.findById(projectId);
    
    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    // Check if user has access to the project
    const hasAccess = await checkProjectAccess(userId, project);
    
    if (!hasAccess) {
      res.status(403).json({ message: 'Access denied' });
      return;
    }

    res.status(200).json({ project });
  } catch (error) {
    console.error('Get project by ID error:', error);
    res.status(500).json({ message: 'Server error while fetching project' });
  }
};

// Create a new project
export const createProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, icon, color, teamId, isTemplate, templateId, tags, settings } = req.body;
    const userId = (req as any).user?.id;
    
    if (!userId) {
      res.status(401).json({ message: 'Not authenticated' });
      return;
    }

    // Validate required fields
    if (!name) {
      res.status(400).json({ message: 'Project name is required' });
      return;
    }

    // If teamId is provided, check if user is a member of the team
    if (teamId) {
      if (!mongoose.Types.ObjectId.isValid(teamId)) {
        res.status(400).json({ message: 'Invalid team ID' });
        return;
      }

      const team = await Team.findById(teamId);
      
      if (!team) {
        res.status(404).json({ message: 'Team not found' });
        return;
      }

      const isMember = team.members.some(member => 
        member.userId.toString() === userId
      );
      
      if (!isMember) {
        res.status(403).json({ message: 'You are not a member of this team' });
        return;
      }
    }

    // If templateId is provided, check if it exists
    if (templateId) {
      if (!mongoose.Types.ObjectId.isValid(templateId)) {
        res.status(400).json({ message: 'Invalid template ID' });
        return;
      }

      const template = await Project.findById(templateId);
      
      if (!template || !template.isTemplate) {
        res.status(404).json({ message: 'Template not found' });
        return;
      }
    }

    // Create new project
    const project = new Project({
      name,
      description,
      icon,
      color,
      createdBy: userId,
      teamId,
      isTemplate: isTemplate || false,
      templateId,
      tags: tags || [],
      settings: settings || {
        aiEnabled: true,
        features: {
          mindMaps: true,
          tasks: true,
          notes: true,
          files: true,
          aiChat: true,
        },
      },
      permissions: {
        public: false,
        roles: {},
      },
    });

    // Add creator as admin in permissions
    project.permissions.roles.set(userId, 'admin');

    await project.save();

    res.status(201).json({ project });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ message: 'Server error while creating project' });
  }
};

// Update a project
export const updateProject = async (req: Request, res: Response): Promise<void> => {
  try {
    const { projectId } = req.params;
    const { name, description, icon, color, status, progress, deadline, tags, settings } = req.body;
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

    // Find project
    const project = await Project.findById(projectId);
    
    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    // Check if user has admin access to the project
    const hasAdminAccess = await checkProjectAdminAccess(userId, project);
    
    if (!hasAdminAccess) {
      res.status(403).json({ message: 'Admin access required' });
      return;
    }

    // Update fields
    if (name) project.name = name;
    if (description !== undefined) project.description = description;
    if (icon !== undefined) project.icon = icon;
    if (color !== undefined) project.color = color;
    if (status) project.status = status;
    if (progress !== undefined) project.progress = progress;
    if (deadline !== undefined) project.deadline = deadline ? new Date(deadline) : undefined;
    if (tags) project.tags = tags;
    if (settings) {
      project.settings = {
        ...project.settings,
        ...settings,
      };
    }

    await project.save();

    res.status(200).json({ project });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ message: 'Server error while updating project' });
  }
};

// Delete a project
export const deleteProject = async (req: Request, res: Response): Promise<void> => {
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

    // Find project
    const project = await Project.findById(projectId);
    
    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    // Check if user has admin access to the project
    const hasAdminAccess = await checkProjectAdminAccess(userId, project);
    
    if (!hasAdminAccess) {
      res.status(403).json({ message: 'Admin access required' });
      return;
    }

    // Delete project
    await Project.findByIdAndDelete(projectId);

    // TODO: Delete all associated content (notes, tasks, mind maps, etc.)

    res.status(200).json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ message: 'Server error while deleting project' });
  }
};

// Update project permissions
export const updateProjectPermissions = async (req: Request, res: Response): Promise<void> => {
  try {
    const { projectId } = req.params;
    const { public: isPublic, roles } = req.body;
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

    // Find project
    const project = await Project.findById(projectId);
    
    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    // Check if user has admin access to the project
    const hasAdminAccess = await checkProjectAdminAccess(userId, project);
    
    if (!hasAdminAccess) {
      res.status(403).json({ message: 'Admin access required' });
      return;
    }

    // Update permissions
    if (isPublic !== undefined) {
      project.permissions.public = isPublic;
    }

    if (roles) {
      // Ensure creator remains admin
      const creatorId = project.createdBy.toString();
      const newRoles = new Map(Object.entries(roles));
      
      if (newRoles.has(creatorId) && newRoles.get(creatorId) !== 'admin') {
        newRoles.set(creatorId, 'admin');
      }
      
      project.permissions.roles = newRoles;
    }

    await project.save();

    res.status(200).json({ permissions: project.permissions });
  } catch (error) {
    console.error('Update project permissions error:', error);
    res.status(500).json({ message: 'Server error while updating permissions' });
  }
};

// Helper function to check if user has access to a project
const checkProjectAccess = async (userId: string, project: IProject): Promise<boolean> => {
  // If project is public, allow access
  if (project.permissions.public) {
    return true;
  }

  // If user is the creator, allow access
  if (project.createdBy.toString() === userId) {
    return true;
  }

  // If user has a role in project permissions, allow access
  if (project.permissions.roles.has(userId)) {
    return true;
  }

  // If project belongs to a team, check if user is a team member
  if (project.teamId) {
    const team = await Team.findById(project.teamId);
    
    if (team) {
      const isMember = team.members.some(member => 
        member.userId.toString() === userId
      );
      
      if (isMember) {
        return true;
      }
    }
  }

  return false;
};

// Helper function to check if user has admin access to a project
const checkProjectAdminAccess = async (userId: string, project: IProject): Promise<boolean> => {
  // If user is the creator, allow admin access
  if (project.createdBy.toString() === userId) {
    return true;
  }

  // If user has admin role in project permissions, allow admin access
  if (project.permissions.roles.has(userId) && project.permissions.roles.get(userId) === 'admin') {
    return true;
  }

  // If project belongs to a team, check if user is a team admin or owner
  if (project.teamId) {
    const team = await Team.findById(project.teamId);
    
    if (team) {
      const member = team.members.find(member => 
        member.userId.toString() === userId
      );
      
      if (member && (member.role === 'admin' || member.role === 'owner')) {
        return true;
      }
    }
  }

  return false;
};