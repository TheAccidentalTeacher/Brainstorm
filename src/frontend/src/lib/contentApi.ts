// API utility for content management
const API_BASE_URL = typeof window !== 'undefined' && window.location.hostname === 'localhost' 
  ? 'http://localhost:5000'
  : 'https://brainstorm-production-fdab.up.railway.app';

// Types for content
export interface Note {
  _id?: string;
  title: string;
  content: {
    richText: string;
    format: string;
  };
  projectId: string;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Task {
  _id?: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo?: string;
  dueDate?: string;
  projectId: string;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface MindMapNode {
  id: string;
  data: {
    label: string;
    colorIndex?: number;
  };
  position: { x: number; y: number };
  type?: string;
}

export interface MindMapEdge {
  id: string;
  source: string;
  target: string;
  type?: string;
}

export interface MindMap {
  _id?: string;
  title: string;
  nodes: MindMapNode[];
  edges: MindMapEdge[];
  projectId: string;
  createdAt?: string;
  updatedAt?: string;
}

// Default project ID (since we're bypassing auth, we'll use a fixed project)
const DEFAULT_PROJECT_ID = '507f1f77bcf86cd799439011'; // This will be created if it doesn't exist

class ContentAPI {
  private async makeRequest(url: string, options: RequestInit = {}) {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer dummy-token', // Since we bypassed auth
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Notes API
  async getNotes(projectId: string = DEFAULT_PROJECT_ID): Promise<Note[]> {
    try {
      const result = await this.makeRequest(`/api/content/project/${projectId}?type=note`);
      return result.content || [];
    } catch (error) {
      console.error('Error fetching notes:', error);
      // Fallback to localStorage for development
      const stored = localStorage.getItem(`notes_${projectId}`);
      return stored ? JSON.parse(stored) : [];
    }
  }

  async createNote(note: Omit<Note, '_id' | 'createdAt' | 'updatedAt'>, projectId: string = DEFAULT_PROJECT_ID): Promise<Note> {
    try {
      const result = await this.makeRequest(`/api/content/project/${projectId}/note`, {
        method: 'POST',
        body: JSON.stringify({
          title: note.title,
          content: note.content.richText,
          format: note.content.format,
          tags: note.tags,
        }),
      });
      return result.note;
    } catch (error) {
      console.error('Error creating note:', error);
      // Fallback to localStorage for development
      const newNote: Note = {
        ...note,
        _id: Date.now().toString(),
        projectId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const existing = await this.getNotes(projectId);
      const updated = [...existing, newNote];
      localStorage.setItem(`notes_${projectId}`, JSON.stringify(updated));
      return newNote;
    }
  }

  async updateNote(noteId: string, updates: Partial<Note>): Promise<Note> {
    try {
      const result = await this.makeRequest(`/api/content/note/${noteId}`, {
        method: 'PUT',
        body: JSON.stringify({
          title: updates.title,
          content: updates.content?.richText,
          format: updates.content?.format,
          tags: updates.tags,
        }),
      });
      return result.note;
    } catch (error) {
      console.error('Error updating note:', error);
      // Fallback to localStorage for development
      const projectId = updates.projectId || DEFAULT_PROJECT_ID;
      const existing = await this.getNotes(projectId);
      const updated = existing.map(note => 
        note._id === noteId 
          ? { ...note, ...updates, updatedAt: new Date().toISOString() }
          : note
      );
      localStorage.setItem(`notes_${projectId}`, JSON.stringify(updated));
      return updated.find(note => note._id === noteId)!;
    }
  }

  async deleteNote(noteId: string, projectId: string = DEFAULT_PROJECT_ID): Promise<void> {
    try {
      await this.makeRequest(`/api/content/${noteId}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Error deleting note:', error);
      // Fallback to localStorage for development
      const existing = await this.getNotes(projectId);
      const filtered = existing.filter(note => note._id !== noteId);
      localStorage.setItem(`notes_${projectId}`, JSON.stringify(filtered));
    }
  }

  // Tasks API
  async getTasks(projectId: string = DEFAULT_PROJECT_ID): Promise<Task[]> {
    try {
      const result = await this.makeRequest(`/api/content/project/${projectId}?type=task`);
      return result.content || [];
    } catch (error) {
      console.error('Error fetching tasks:', error);
      const stored = localStorage.getItem(`tasks_${projectId}`);
      return stored ? JSON.parse(stored) : [];
    }
  }

  async createTask(task: Omit<Task, '_id' | 'createdAt' | 'updatedAt'>, projectId: string = DEFAULT_PROJECT_ID): Promise<Task> {
    try {
      const result = await this.makeRequest(`/api/content/project/${projectId}/task`, {
        method: 'POST',
        body: JSON.stringify({
          title: task.title,
          description: task.description,
          status: task.status,
          priority: task.priority,
          assignedTo: task.assignedTo,
          dueDate: task.dueDate,
          tags: task.tags,
        }),
      });
      return result.task;
    } catch (error) {
      console.error('Error creating task:', error);
      const newTask: Task = {
        ...task,
        _id: Date.now().toString(),
        projectId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const existing = await this.getTasks(projectId);
      const updated = [...existing, newTask];
      localStorage.setItem(`tasks_${projectId}`, JSON.stringify(updated));
      return newTask;
    }
  }

  async updateTask(taskId: string, updates: Partial<Task>): Promise<Task> {
    try {
      const result = await this.makeRequest(`/api/content/task/${taskId}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
      return result.task;
    } catch (error) {
      console.error('Error updating task:', error);
      const projectId = updates.projectId || DEFAULT_PROJECT_ID;
      const existing = await this.getTasks(projectId);
      const updated = existing.map(task => 
        task._id === taskId 
          ? { ...task, ...updates, updatedAt: new Date().toISOString() }
          : task
      );
      localStorage.setItem(`tasks_${projectId}`, JSON.stringify(updated));
      return updated.find(task => task._id === taskId)!;
    }
  }

  async deleteTask(taskId: string, projectId: string = DEFAULT_PROJECT_ID): Promise<void> {
    try {
      await this.makeRequest(`/api/content/${taskId}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Error deleting task:', error);
      const existing = await this.getTasks(projectId);
      const filtered = existing.filter(task => task._id !== taskId);
      localStorage.setItem(`tasks_${projectId}`, JSON.stringify(filtered));
    }
  }

  // Mind Maps API
  async getMindMaps(projectId: string = DEFAULT_PROJECT_ID): Promise<MindMap[]> {
    try {
      const result = await this.makeRequest(`/api/content/project/${projectId}?type=mindmap`);
      return result.content || [];
    } catch (error) {
      console.error('Error fetching mind maps:', error);
      const stored = localStorage.getItem(`mindmaps_${projectId}`);
      return stored ? JSON.parse(stored) : [];
    }
  }

  async createMindMap(mindMap: Omit<MindMap, '_id' | 'createdAt' | 'updatedAt'>, projectId: string = DEFAULT_PROJECT_ID): Promise<MindMap> {
    try {
      const result = await this.makeRequest(`/api/content/project/${projectId}/mindmap`, {
        method: 'POST',
        body: JSON.stringify({
          title: mindMap.title,
          nodes: mindMap.nodes,
          edges: mindMap.edges,
        }),
      });
      return result.mindmap;
    } catch (error) {
      console.error('Error creating mind map:', error);
      const newMindMap: MindMap = {
        ...mindMap,
        _id: Date.now().toString(),
        projectId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      const existing = await this.getMindMaps(projectId);
      const updated = [...existing, newMindMap];
      localStorage.setItem(`mindmaps_${projectId}`, JSON.stringify(updated));
      return newMindMap;
    }
  }

  async updateMindMap(mindMapId: string, updates: Partial<MindMap>): Promise<MindMap> {
    try {
      const result = await this.makeRequest(`/api/content/mindmap/${mindMapId}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      });
      return result.mindmap;
    } catch (error) {
      console.error('Error updating mind map:', error);
      const projectId = updates.projectId || DEFAULT_PROJECT_ID;
      const existing = await this.getMindMaps(projectId);
      const updated = existing.map(mindMap => 
        mindMap._id === mindMapId 
          ? { ...mindMap, ...updates, updatedAt: new Date().toISOString() }
          : mindMap
      );
      localStorage.setItem(`mindmaps_${projectId}`, JSON.stringify(updated));
      return updated.find(mindMap => mindMap._id === mindMapId)!;
    }
  }

  async deleteMindMap(mindMapId: string, projectId: string = DEFAULT_PROJECT_ID): Promise<void> {
    try {
      await this.makeRequest(`/api/content/${mindMapId}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Error deleting mind map:', error);
      const existing = await this.getMindMaps(projectId);
      const filtered = existing.filter(mindMap => mindMap._id !== mindMapId);
      localStorage.setItem(`mindmaps_${projectId}`, JSON.stringify(filtered));
    }
  }
}

export const contentAPI = new ContentAPI();
