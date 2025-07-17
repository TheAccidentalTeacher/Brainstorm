'use client';

import React, { useState, useEffect } from 'react';
import UserGuide from '../../../components/UserGuide';
import KanbanBoard from '../../../components/tasks/KanbanBoard';
import ConfirmDeleteModal, { useConfirmDeleteModal } from '../../../components/ConfirmDeleteModal';
import { contentAPI, Task } from '../../../lib/contentApi';

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

export default function TasksPage() {
  const [viewMode, setViewMode] = useState<'kanban' | 'list'>('kanban');
  const [showModal, setShowModal] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // New task form state
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium' as const,
    status: 'todo' as const,
    dueDate: '',
  });

  // Confirmation modal hook
  const {
    isOpen: isDeleteModalOpen,
    pendingDelete,
    showDeleteConfirm,
    handleConfirm: confirmDelete,
    handleClose: closeDeleteModal,
  } = useConfirmDeleteModal();

  // Load tasks on component mount
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const fetchedTasks = await contentAPI.getTasks();
      setTasks(fetchedTasks);
      
      // If no tasks exist, create some sample tasks
      if (fetchedTasks.length === 0) {
        const sampleTasks = [
          {
            title: 'Welcome to Tasks - Cloud Saved!',
            description: 'All your tasks are automatically saved to MongoDB Atlas. Try creating, editing, and moving tasks around!',
            priority: 'high' as const,
            status: 'todo' as const,
            projectId: '507f1f77bcf86cd799439011'
          },
          {
            title: 'Complete project setup',
            description: 'Set up the development environment and dependencies.',
            priority: 'medium' as const,
            status: 'in-progress' as const,
            projectId: '507f1f77bcf86cd799439011'
          },
          {
            title: 'Review and test features',
            description: 'Test all the new functionality and ensure everything works properly.',
            priority: 'low' as const,
            status: 'done' as const,
            projectId: '507f1f77bcf86cd799439011'
          }
        ];

        const createdTasks = [];
        for (const task of sampleTasks) {
          try {
            const created = await contentAPI.createTask(task);
            createdTasks.push(created);
          } catch (error) {
            console.error('Error creating sample task:', error);
          }
        }
        setTasks(createdTasks);
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const createNewTask = async () => {
    if (!newTask.title.trim()) {
      alert('Please enter a task title');
      return;
    }

    try {
      setSaving(true);
      const createdTask = await contentAPI.createTask({
        title: newTask.title,
        description: newTask.description,
        priority: newTask.priority,
        status: newTask.status,
        dueDate: newTask.dueDate || undefined,
        projectId: '507f1f77bcf86cd799439011'
      });

      setTasks([createdTask, ...tasks]);
      setNewTask({
        title: '',
        description: '',
        priority: 'medium',
        status: 'todo',
        dueDate: '',
      });
      setShowModal(false);
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Error creating task. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const deleteTaskHandler = async (taskId: string) => {
    try {
      setSaving(true);
      await contentAPI.deleteTask(taskId);
      
      const updatedTasks = tasks.filter(task => task._id !== taskId);
      setTasks(updatedTasks);
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('Error deleting task. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const initiateDeleteTask = (taskId: string, taskTitle: string) => {
    showDeleteConfirm(taskId, taskTitle, 'task', () => deleteTaskHandler(taskId));
  };

  const handleTaskMove = async (result: DragResult) => {
    // Map column IDs to statuses
    const columnToStatus: { [key: string]: Task['status'] } = {
      'column-1': 'todo',
      'column-2': 'in-progress',
      'column-3': 'done',
    };

    if (!result.destination) return;

    const newStatus = columnToStatus[result.destination.droppableId];
    if (!newStatus) return;

    const taskId = result.draggableId;
    const taskToUpdate = tasks.find(task => task._id === taskId);
    
    if (taskToUpdate && taskToUpdate.status !== newStatus) {
      try {
        const updatedTask = await contentAPI.updateTask(taskId, { status: newStatus });
        setTasks(tasks.map(task => 
          task._id === taskId ? updatedTask : task
        ));
      } catch (error) {
        console.error('Error updating task status:', error);
      }
    }
  };

  // Convert tasks to board format for the KanbanBoard component
  const getBoardData = () => {
    const todoTasks = tasks.filter(task => task.status === 'todo');
    const inProgressTasks = tasks.filter(task => task.status === 'in-progress');
    const doneTasks = tasks.filter(task => task.status === 'done');

    return {
      tasks: tasks.reduce((acc, task) => {
        acc[task._id!] = {
          id: task._id!,
          title: task.title,
          description: task.description || '',
          priority: task.priority,
          assignee: { id: 'user-1', name: 'You' },
          dueDate: task.dueDate || '',
        };
        return acc;
      }, {} as any),
      columns: {
        'column-1': {
          id: 'column-1',
          title: 'To Do',
          taskIds: todoTasks.map(task => task._id!),
        },
        'column-2': {
          id: 'column-2',
          title: 'In Progress',
          taskIds: inProgressTasks.map(task => task._id!),
        },
        'column-3': {
          id: 'column-3',
          title: 'Done',
          taskIds: doneTasks.map(task => task._id!),
        },
      },
      columnOrder: ['column-1', 'column-2', 'column-3'],
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your tasks from the cloud...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <UserGuide />
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Tasks</h1>
        <p className="text-gray-600">Manage your tasks and track progress. All changes are automatically saved to the cloud.</p>
      </div>

      {/* View Controls */}
      <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow">
        <div className="flex space-x-2">
          <button
            onClick={() => setViewMode('kanban')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              viewMode === 'kanban'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Kanban Board
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              viewMode === 'list'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            List View
          </button>
        </div>
        
        <button
          onClick={() => setShowModal(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
        >
          <span className="text-lg">+</span>
          New Task
        </button>
      </div>

      {/* Task Views */}
      <div className="bg-white rounded-lg shadow p-6">
        {viewMode === 'kanban' && <KanbanBoard initialBoard={getBoardData()} onTaskMove={handleTaskMove} />}
        
        {viewMode === 'list' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">All Tasks</h3>
            {tasks.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <div className="text-6xl mb-4">📋</div>
                <p className="text-lg">No tasks yet. Create your first task!</p>
              </div>
            ) : (
              tasks.map((task) => (
                <div key={task._id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{task.title}</h4>
                      {task.description && (
                        <p className="text-gray-600 mt-1">{task.description}</p>
                      )}
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span className={`px-2 py-1 rounded text-xs ${
                          task.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                          task.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                          task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {task.priority}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          task.status === 'todo' ? 'bg-blue-100 text-blue-800' :
                          task.status === 'in-progress' ? 'bg-purple-100 text-purple-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {task.status.replace('-', ' ')}
                        </span>
                        {task.dueDate && (
                          <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <button
                        onClick={() => initiateDeleteTask(task._id!, task.title)}
                        disabled={saving}
                        className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded transition-colors disabled:opacity-50"
                        title="Delete task"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Task Statistics */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900">Total Tasks</h4>
            <div className="text-blue-500 text-2xl font-bold">{tasks.length}</div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg">
            <h4 className="font-medium text-yellow-900">In Progress</h4>
            <div className="text-yellow-500 text-2xl font-bold">
              {tasks.filter(task => task.status === 'in-progress').length}
            </div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg">
            <h4 className="font-medium text-red-900">High Priority</h4>
            <div className="text-red-500 text-2xl font-bold">
              {tasks.filter(task => task.priority === 'high' || task.priority === 'urgent').length}
            </div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h4 className="font-medium text-green-900">Completed</h4>
            <div className="text-green-500 text-2xl font-bold">
              {tasks.filter(task => task.status === 'done').length}
            </div>
          </div>
        </div>
        
        <div className="mt-4 text-center text-sm text-green-600 font-medium">
          ✅ All tasks automatically saved to MongoDB Atlas
        </div>
      </div>

      {/* New Task Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Task</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter task title..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Enter task description..."
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    value={newTask.status}
                    onChange={(e) => setNewTask({ ...newTask, status: e.target.value as any })}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="todo">To Do</option>
                    <option value="in-progress">In Progress</option>
                    <option value="done">Done</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Due Date (Optional)</label>
                <input
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={createNewTask}
                disabled={saving}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {saving ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                ) : (
                  'Create Task'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        itemType="task"
        itemName={pendingDelete?.name || ''}
        loading={saving}
      />
    </div>
  );
}
