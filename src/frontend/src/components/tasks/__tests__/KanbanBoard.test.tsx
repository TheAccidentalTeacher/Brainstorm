import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import KanbanBoard from '../KanbanBoard';

// Mock the drag and drop library
jest.mock('@hello-pangea/dnd', () => ({
  DragDropContext: ({ children }) => children,
  Droppable: ({ children }) => children({
    innerRef: jest.fn(),
    droppableProps: {},
    placeholder: null,
  }),
  Draggable: ({ children }) => children({
    innerRef: jest.fn(),
    draggableProps: {},
    dragHandleProps: {},
  }),
}));

describe('KanbanBoard Component', () => {
  const mockInitialBoard = {
    tasks: {
      'task-1': {
        id: 'task-1',
        title: 'Task 1',
        description: 'Description for task 1',
        priority: 'medium',
        assignee: {
          id: 'user-1',
          name: 'John Doe',
        },
        dueDate: '2025-08-01',
      },
      'task-2': {
        id: 'task-2',
        title: 'Task 2',
        description: 'Description for task 2',
        priority: 'high',
      },
    },
    columns: {
      'column-1': {
        id: 'column-1',
        title: 'To Do',
        taskIds: ['task-1'],
      },
      'column-2': {
        id: 'column-2',
        title: 'In Progress',
        taskIds: ['task-2'],
      },
      'column-3': {
        id: 'column-3',
        title: 'Done',
        taskIds: [],
      },
    },
    columnOrder: ['column-1', 'column-2', 'column-3'],
  };

  const mockOnTaskMove = jest.fn();

  it('renders the kanban board with columns and tasks', () => {
    render(<KanbanBoard initialBoard={mockInitialBoard} onTaskMove={mockOnTaskMove} />);
    
    // Check if columns are rendered
    expect(screen.getByText('To Do')).toBeInTheDocument();
    expect(screen.getByText('In Progress')).toBeInTheDocument();
    expect(screen.getByText('Done')).toBeInTheDocument();
    
    // Check if tasks are rendered
    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 2')).toBeInTheDocument();
    
    // Check if task details are rendered
    expect(screen.getByText('Description for task 1')).toBeInTheDocument();
    expect(screen.getByText('Description for task 2')).toBeInTheDocument();
    
    // Check if priority badges are rendered
    expect(screen.getByText('Medium')).toBeInTheDocument();
    expect(screen.getByText('High')).toBeInTheDocument();
    
    // Check if assignee is rendered
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    
    // Check if unassigned text is rendered for task without assignee
    expect(screen.getByText('Unassigned')).toBeInTheDocument();
    
    // Check if due date is rendered
    expect(screen.getByText('Due: 8/1/2025')).toBeInTheDocument();
  });

  it('renders "Add Task" buttons for each column', () => {
    render(<KanbanBoard initialBoard={mockInitialBoard} onTaskMove={mockOnTaskMove} />);
    
    const addTaskButtons = screen.getAllByText('Add Task');
    expect(addTaskButtons).toHaveLength(3); // One for each column
  });

  it('renders "Add Column" button', () => {
    render(<KanbanBoard initialBoard={mockInitialBoard} onTaskMove={mockOnTaskMove} />);
    
    expect(screen.getByText('Add Column')).toBeInTheDocument();
  });

  // Additional tests would be added for interaction testing
  // such as dragging tasks, adding columns, etc.
  // These would require more complex mocking of the drag and drop library
});