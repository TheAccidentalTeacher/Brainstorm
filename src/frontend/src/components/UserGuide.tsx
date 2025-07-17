'use client';

import React, { useState } from 'react';

export default function UserGuide() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="mb-6 p-4 bg-indigo-50 dark:bg-gray-800 rounded-lg shadow">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-indigo-700 dark:text-indigo-300">
          🧭 Ultimate Project Hub Guide
        </h2>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-200"
        >
          {isExpanded ? '▼ Hide' : '▶ Show'}
        </button>
      </div>
      
      {isExpanded && (
        <div className="mt-4">
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">📋 Core Features:</h3>
              <ul className="space-y-1 text-gray-700 dark:text-gray-300">
                <li>• <b>Dashboard</b>: Your control center</li>
                <li>• <b>Projects</b>: Organize work into containers</li>
                <li>• <b>Tasks</b>: Kanban board for to-dos</li>
                <li>• <b>Notes</b>: Capture ideas and thoughts</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-2 text-gray-800 dark:text-gray-200">🎯 Advanced Tools:</h3>
              <ul className="space-y-1 text-gray-700 dark:text-gray-300">
                <li>• <b>Mind Maps</b>: Visual brainstorming</li>
                <li>• <b>AI Chat</b>: Your smart assistant</li>
                <li>• <b>Files</b>: Document management</li>
                <li>• <b>Editor</b>: Rich text editing</li>
              </ul>
            </div>
          </div>
          <div className="mt-3 p-3 bg-blue-100 dark:bg-blue-900 rounded text-sm">
            <b>💡 Quick Start:</b> Start with Projects → Create tasks → Use AI Chat for help → Visualize with Mind Maps
          </div>
        </div>
      )}
    </div>
  );
}
