// API utility functions for frontend-backend communication

const API_BASE_URL = typeof window !== 'undefined' && window.location.hostname === 'localhost' 
  ? 'http://localhost:5000/api'
  : 'https://brainstorm-production-fdab.up.railway.app/api';

// Helper function to get auth token
const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('authToken');
  }
  return null;
};

// Helper function to make authenticated requests
const makeRequest = async (url: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Request failed' }));
    throw new Error(errorData.message || `HTTP ${response.status}`);
  }

  return response.json();
};

// Authentication API calls
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Login failed' }));
      throw new Error(errorData.message || 'Login failed');
    }

    return response.json();
  },

  register: async (email: string, password: string, displayName: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, displayName }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Registration failed' }));
      throw new Error(errorData.message || 'Registration failed');
    }

    return response.json();
  },

  getCurrentUser: async () => {
    return makeRequest('/auth/me');
  },

  logout: async () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
    }
  },
};

// Projects API calls
export const projectsAPI = {
  getProjects: async () => {
    return makeRequest('/projects');
  },

  createProject: async (projectData: {
    name: string;
    description: string;
    color?: string;
    tags?: string[];
  }) => {
    return makeRequest('/projects', {
      method: 'POST',
      body: JSON.stringify(projectData),
    });
  },

  getProjectById: async (projectId: string) => {
    return makeRequest(`/projects/${projectId}`);
  },

  updateProject: async (projectId: string, updateData: any) => {
    return makeRequest(`/projects/${projectId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  },

  deleteProject: async (projectId: string) => {
    return makeRequest(`/projects/${projectId}`, {
      method: 'DELETE',
    });
  },
};

// Content API calls
export const contentAPI = {
  getContent: async (filters?: any) => {
    const params = filters ? `?${new URLSearchParams(filters).toString()}` : '';
    return makeRequest(`/content${params}`);
  },

  createContent: async (contentData: any) => {
    return makeRequest('/content', {
      method: 'POST',
      body: JSON.stringify(contentData),
    });
  },

  updateContent: async (contentId: string, updateData: any) => {
    return makeRequest(`/content/${contentId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  },

  deleteContent: async (contentId: string) => {
    return makeRequest(`/content/${contentId}`, {
      method: 'DELETE',
    });
  },
};

// AI Chat API calls
export const aiChatAPI = {
  getChats: async () => {
    return makeRequest('/ai-chat/chats');
  },

  createChat: async (title: string) => {
    return makeRequest('/ai-chat/chats', {
      method: 'POST',
      body: JSON.stringify({ title }),
    });
  },

  getMessages: async (chatId: string) => {
    return makeRequest(`/ai-chat/chats/${chatId}/messages`);
  },

  sendMessage: async (chatId: string, message: string) => {
    return makeRequest(`/ai-chat/chats/${chatId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ message }),
    });
  },
};

// Collaboration API calls
export const collaborationAPI = {
  getRealTimeSession: async (sessionId: string) => {
    return makeRequest(`/collaboration/sessions/${sessionId}`);
  },

  createSession: async (sessionData: any) => {
    return makeRequest('/collaboration/sessions', {
      method: 'POST',
      body: JSON.stringify(sessionData),
    });
  },
};

export default {
  auth: authAPI,
  projects: projectsAPI,
  content: contentAPI,
  aiChat: aiChatAPI,
  collaboration: collaborationAPI,
};
