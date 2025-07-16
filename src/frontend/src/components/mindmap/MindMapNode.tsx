'use client';

import React, { useState, memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';

const colors = [
  { bg: 'bg-blue-100', border: 'border-blue-500', text: 'text-blue-800' },
  { bg: 'bg-green-100', border: 'border-green-500', text: 'text-green-800' },
  { bg: 'bg-purple-100', border: 'border-purple-500', text: 'text-purple-800' },
  { bg: 'bg-yellow-100', border: 'border-yellow-500', text: 'text-yellow-800' },
  { bg: 'bg-red-100', border: 'border-red-500', text: 'text-red-800' },
  { bg: 'bg-indigo-100', border: 'border-indigo-500', text: 'text-indigo-800' },
  { bg: 'bg-pink-100', border: 'border-pink-500', text: 'text-pink-800' },
];

const MindMapNode = ({ data, id }: NodeProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [label, setLabel] = useState(data.label);
  const [colorIndex, setColorIndex] = useState(data.colorIndex || 0);
  const { bg, border, text } = colors[colorIndex % colors.length];

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    data.label = label;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setIsEditing(false);
      data.label = label;
    }
  };

  const changeColor = () => {
    const newColorIndex = (colorIndex + 1) % colors.length;
    setColorIndex(newColorIndex);
    data.colorIndex = newColorIndex;
  };

  return (
    <div className={`px-4 py-2 rounded-lg shadow-md border-2 ${bg} ${border} min-w-[100px] max-w-[250px]`}>
      <Handle type="target" position={Position.Top} className="w-3 h-3 bg-blue-500" />
      
      {isEditing ? (
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="w-full bg-white p-1 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          autoFocus
        />
      ) : (
        <div className="flex items-center justify-between">
          <div 
            className={`font-medium ${text} break-words`}
            onDoubleClick={handleDoubleClick}
          >
            {label}
          </div>
          <button 
            onClick={changeColor}
            className="ml-2 text-gray-400 hover:text-gray-600 focus:outline-none"
            title="Change color"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
          </button>
        </div>
      )}
      
      <Handle type="source" position={Position.Bottom} className="w-3 h-3 bg-blue-500" />
      <Handle type="source" position={Position.Left} className="w-3 h-3 bg-blue-500" />
      <Handle type="source" position={Position.Right} className="w-3 h-3 bg-blue-500" />
    </div>
  );
};

export default memo(MindMapNode);