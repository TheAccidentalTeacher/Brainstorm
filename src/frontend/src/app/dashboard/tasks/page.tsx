'use client';

import React, { useState } from 'react';
import KanbanBoard from '../../../components/tasks/KanbanBoard';

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

  const handleTaskMove = (result: any) => {
    console.log('Task moved:', result);
    // In a real app, we would update the backend here
  };

  return (
    <div className="container mx-auto">
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

        <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center">
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
        {viewMode === 'kanban' && <KanbanBoard initialBoard={initialBoardData} onTaskMove={handleTaskMove} />}
        
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
    </div>
  );
}