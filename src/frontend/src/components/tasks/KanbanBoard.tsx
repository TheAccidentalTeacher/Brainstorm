'use client';

import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

// Task type definition
interface Task {
  id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignee?: {
    id: string;
    name: string;
    avatar?: string;
  };
  dueDate?: string;
}

// Column type definition
interface Column {
  id: string;
  title: string;
  taskIds: string[];
}

// Board type definition
interface Board {
  tasks: {
    [key: string]: Task;
  };
  columns: {
    [key: string]: Column;
  };
  columnOrder: string[];
}

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

interface KanbanBoardProps {
  initialBoard: Board;
  onTaskMove?: (result: DragResult) => void;
}

const KanbanBoard: React.FC<KanbanBoardProps> = ({ initialBoard, onTaskMove }) => {
  const [board, setBoard] = useState<Board>(initialBoard);

  const onDragEnd = (result: DragResult) => {
    const { destination, source, draggableId } = result;

    // If there's no destination or the item was dropped back in the same place
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return;
    }

    // Get source and destination columns
    const sourceColumn = board.columns[source.droppableId];
    const destinationColumn = board.columns[destination.droppableId];

    // If moving within the same column
    if (sourceColumn === destinationColumn) {
      const newTaskIds = Array.from(sourceColumn.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...sourceColumn,
        taskIds: newTaskIds,
      };

      const newBoard = {
        ...board,
        columns: {
          ...board.columns,
          [newColumn.id]: newColumn,
        },
      };

      setBoard(newBoard);
      if (onTaskMove) onTaskMove(result);
      return;
    }

    // Moving from one column to another
    const sourceTaskIds = Array.from(sourceColumn.taskIds);
    sourceTaskIds.splice(source.index, 1);
    const newSourceColumn = {
      ...sourceColumn,
      taskIds: sourceTaskIds,
    };

    const destinationTaskIds = Array.from(destinationColumn.taskIds);
    destinationTaskIds.splice(destination.index, 0, draggableId);
    const newDestinationColumn = {
      ...destinationColumn,
      taskIds: destinationTaskIds,
    };

    const newBoard = {
      ...board,
      columns: {
        ...board.columns,
        [newSourceColumn.id]: newSourceColumn,
        [newDestinationColumn.id]: newDestinationColumn,
      },
    };

    setBoard(newBoard);
    if (onTaskMove) onTaskMove(result);
  };

  // Priority badge component
  const PriorityBadge = ({ priority }: { priority: Task['priority'] }) => {
    const priorityStyles = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-blue-100 text-blue-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800',
    };

    return (
      <span className={`text-xs font-medium px-2 py-1 rounded-full ${priorityStyles[priority]}`}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    );
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex space-x-4 overflow-x-auto pb-4">
        {board.columnOrder.map((columnId) => {
          const column = board.columns[columnId];
          const tasks = column.taskIds.map((taskId) => board.tasks[taskId]);

          return (
            <div key={column.id} className="flex-shrink-0 w-80">
              <div className="bg-gray-100 rounded-lg shadow p-4">
                <h3 className="font-medium text-gray-800 mb-3 flex items-center justify-between">
                  <span>{column.title}</span>
                  <span className="bg-gray-200 text-gray-700 text-xs font-medium px-2 py-1 rounded-full">
                    {column.taskIds.length}
                  </span>
                </h3>

                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`min-h-[200px] transition-colors ${
                        snapshot.isDraggingOver ? 'bg-blue-50' : ''
                      }`}
                    >
                      {tasks.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className={`bg-white p-3 rounded-md shadow mb-2 border-l-4 ${
                                task.priority === 'urgent'
                                  ? 'border-red-500'
                                  : task.priority === 'high'
                                  ? 'border-orange-500'
                                  : task.priority === 'medium'
                                  ? 'border-blue-500'
                                  : 'border-green-500'
                              } ${snapshot.isDragging ? 'shadow-lg' : ''}`}
                            >
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-medium text-gray-800">{task.title}</h4>
                                <PriorityBadge priority={task.priority} />
                              </div>
                              <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                              <div className="flex justify-between items-center">
                                {task.assignee ? (
                                  <div className="flex items-center">
                                    <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center text-white text-xs">
                                      {task.assignee.name.charAt(0)}
                                    </div>
                                    <span className="text-xs text-gray-500 ml-1">{task.assignee.name}</span>
                                  </div>
                                ) : (
                                  <div className="text-xs text-gray-400">Unassigned</div>
                                )}
                                {task.dueDate && (
                                  <div className="text-xs text-gray-500">
                                    Due: {new Date(task.dueDate).toLocaleDateString()}
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>

                <button className="mt-2 w-full py-2 flex items-center justify-center text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-200 rounded transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 mr-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                  Add Task
                </button>
              </div>
            </div>
          );
        })}

        <div className="flex-shrink-0 w-80">
          <button className="w-full h-12 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:bg-gray-200 transition-colors">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Column
          </button>
        </div>
      </div>
    </DragDropContext>
  );
};

export default KanbanBoard;