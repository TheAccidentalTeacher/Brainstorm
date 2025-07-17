'use client';

import React, { useState } from 'react';
import UserGuide from '../../../components/UserGuide';
import KanbanBoard from '../../../components/tasks/KanbanBoard';

interface DragResult {
  source: {
    droppableId: string;
    index: number;
  };
  destination: {
    droppableId: string;
    index: number;
  } | null;
  draggableId: string;
}

// Sample data for the Kanban board
const initialBoardData = {
  tasks: {
    'task-1': {
      id: 'task-1',
      title: 'Create project plan',
      description: 'Develop a comprehensive project plan with milestones and deliverables.',
      priority: 'high' as const,
      assignee: {
        id: 'user-1',
        name: 'John Doe',
      },
      dueDate: '2025-07-25',
    },
    'task-2': {
      id: 'task-2',
      title: 'Design homepage mockup',
      description: 'Create wireframes and visual design for the homepage.',
      priority: 'medium' as const,
      assignee: {
        id: 'user-2',
        name: 'Jane Smith',
      },
      dueDate: '2025-07-20',
    },
    'task-3': {
      id: 'task-3',
      title: 'Implement authentication',
      description: 'Set up user authentication system with login and registration.',
      priority: 'high' as const,
      assignee: {
        id: 'user-3',
        name: 'Mike Johnson',
      },
      dueDate: '2025-07-18',
    },
    'task-4': {
      id: 'task-4',
      title: 'Write API documentation',
      description: 'Document all API endpoints with examples and response formats.',
      priority: 'low' as const,
      assignee: {
        id: 'user-1',
        name: 'John Doe',
      },
      dueDate: '2025-07-30',
    },
    'task-5': {
      id: 'task-5',
      title: 'Set up CI/CD pipeline',
      description: 'Configure continuous integration and deployment workflow.',
      priority: 'medium' as const,
      assignee: {
        id: 'user-3',
        name: 'Mike Johnson',
      },
      dueDate: '2025-07-22',
    },
    'task-6': {
      id: 'task-6',
      title: 'Conduct user testing',
      description: 'Organize and conduct user testing sessions for the prototype.',
      priority: 'urgent' as const,
      assignee: {
        id: 'user-2',
        name: 'Jane Smith',
      },
      dueDate: '2025-07-17',
    },
    'task-7': {
      id: 'task-7',
      title: 'Fix responsive layout issues',
      description: 'Address layout problems on mobile and tablet devices.',
      priority: 'high' as const,
      assignee: {
        id: 'user-2',
        name: 'Jane Smith',
      },
      dueDate: '2025-07-19',
    },
    'task-8': {
      id: 'task-8',
      title: 'Optimize database queries',
      description: 'Improve performance of slow database queries.',
      priority: 'medium' as const,
      assignee: {
        id: 'user-3',
        name: 'Mike Johnson',
      },
      dueDate: '2025-07-24',
    },
  },
  columns: {
    'column-1': {
      id: 'column-1',
      title: 'To Do',
      taskIds: ['task-1', 'task-4', 'task-8'],
    },
    'column-2': {
      id: 'column-2',
      title: 'In Progress',
      taskIds: ['task-2', 'task-3', 'task-5'],
    },
    'column-3': {
      id: 'column-3',
      title: 'Review',
      taskIds: ['task-7'],
    },
    'column-4': {
      id: 'column-4',
      title: 'Done',
      taskIds: ['task-6'],
    },
  },
  columnOrder: ['column-1', 'column-2', 'column-3', 'column-4'],
};

export default function TasksPage() {
  const [viewMode, setViewMode] = useState<'kanban' | 'list' | 'calendar'>('kanban');
  const [boardData, setBoardData] = useState(initialBoardData);
  const [showNewTaskModal, setShowNewTaskModal] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');

  const createNewTask = () => {
    if (!newTaskTitle.trim()) return;
    
    const taskId = `task-${Date.now()}`;
    const newTask = {
      id: taskId,
      title: newTaskTitle,
      description: newTaskDescription,
      priority: 'medium' as const,
      assignee: {
        id: 'user-1',
        name: 'You',
      },
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 7 days from now
    };

    // Add to tasks and to the first column (To Do)
    const updatedBoardData = {
      ...boardData,
      tasks: {
        ...boardData.tasks,
        [taskId]: newTask,
      },
      columns: {
        ...boardData.columns,
        'column-1': {
          ...boardData.columns['column-1'],
          taskIds: [taskId, ...boardData.columns['column-1'].taskIds],
        },
      },
    };

    setBoardData(updatedBoardData);
    setNewTaskTitle('');
    setNewTaskDescription('');
    setShowNewTaskModal(false);
  };

  const handleTaskMove = (result: DragResult) => {
    console.log('Task moved:', result);
    // In a real app, we would update the backend here
  };

  return (
    <div className="container mx-auto">
      <UserGuide />
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Task Management</h1>
        <p className="text-gray-600">
          Organize and track your tasks across different stages of completion.
        </p>
      </div>

      <div className="mb-6 flex justify-between items-center">
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode('kanban')}
            className={`px-4 py-2 rounded-md ${
              viewMode === 'kanban'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Kanban
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded-md ${
              viewMode === 'list'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            List
          </button>
          <button
            onClick={() => setViewMode('calendar')}
            className={`px-4 py-2 rounded-md ${
              viewMode === 'calendar'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Calendar
          </button>
        </div>

        <button 
          onClick={() => setShowNewTaskModal(true)}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Task
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        {viewMode === 'kanban' && <KanbanBoard initialBoard={boardData} onTaskMove={handleTaskMove} />}
        
        {viewMode === 'list' && (
          <div className="text-center py-12">
            <p className="text-gray-500">List view is coming soon!</p>
          </div>
        )}
        
        {viewMode === 'calendar' && (
          <div className="text-center py-12">
            <p className="text-gray-500">Calendar view is coming soon!</p>
          </div>
        )}
      </div>

      <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Task Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-blue-500 text-2xl font-bold">{Object.keys(initialBoardData.tasks).length}</div>
            <div className="text-gray-600">Total Tasks</div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <div className="text-yellow-500 text-2xl font-bold">{initialBoardData.columns['column-2'].taskIds.length}</div>
            <div className="text-gray-600">In Progress</div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <div className="text-red-500 text-2xl font-bold">
              {Object.values(initialBoardData.tasks).filter(task => task.priority === 'urgent').length}
            </div>
            <div className="text-gray-600">Urgent</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="text-green-500 text-2xl font-bold">{initialBoardData.columns['column-4'].taskIds.length}</div>
            <div className="text-gray-600">Completed</div>
          </div>
        </div>
      </div>

      {/* New Task Modal */}
      {showNewTaskModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Create New Task</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Task Title
                </label>
                <input
                  type="text"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter task title..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={newTaskDescription}
                  onChange={(e) => setNewTaskDescription(e.target.value)}
                  className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white h-20"
                  placeholder="Enter task description..."
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowNewTaskModal(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              >
                Cancel
              </button>
              <button
                onClick={createNewTask}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Create Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}