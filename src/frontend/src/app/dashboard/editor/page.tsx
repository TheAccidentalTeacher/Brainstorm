'use client';

import React, { useState } from 'react';
import RichTextEditor from '../../../components/editor/RichTextEditor';

export default function EditorPage() {
  const [documentId] = useState<string>('demo-document-123');
  const [userName] = useState<string>('Demo User');
  const [userColor] = useState<string>('#' + Math.floor(Math.random() * 16777215).toString(16));
  const [initialContent] = useState<string>('<h1>Welcome to the Collaborative Editor</h1><p>This is a demonstration of real-time collaborative editing using TipTap and Y.js.</p><p>Try opening this page in multiple browser windows to see the collaboration in action!</p>');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Collaborative Document Editor</h1>
        <p className="text-gray-600">
          Edit this document collaboratively in real-time. Changes are synchronized across all connected users.
        </p>
      </div>

      <div className="mb-6">
        <div className="flex items-center mb-4">
          <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-bold mr-2">
            {userName.charAt(0)}
          </div>
          <div>
            <div className="text-sm font-medium">{userName}</div>
            <div className="text-xs text-gray-500">Currently editing</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="border-b border-gray-200 bg-gray-50 px-4 py-3 flex justify-between items-center">
          <h2 className="text-lg font-medium">Document Title</h2>
          <div className="text-sm text-gray-500">Last saved: just now</div>
        </div>
        
        <RichTextEditor
          documentId={documentId}
          initialContent={initialContent}
          userName={userName}
          userColor={userColor}
          onUpdate={(content) => {
            console.log('Content updated:', content.substring(0, 50) + '...');
          }}
        />
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">About This Editor</h2>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-2">Features</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>Real-time collaborative editing</li>
            <li>Rich text formatting (bold, italic, headings, lists, etc.)</li>
            <li>User presence indicators</li>
            <li>Cursor tracking</li>
            <li>Conflict-free editing</li>
          </ul>
          
          <h3 className="text-lg font-medium mt-4 mb-2">Technology</h3>
          <p className="text-gray-700">
            This editor is built using TipTap (based on ProseMirror) for the rich text editing capabilities
            and Y.js for the real-time collaboration features. The collaborative state is synchronized
            through a WebSocket connection.
          </p>
        </div>
      </div>
    </div>
  );
}