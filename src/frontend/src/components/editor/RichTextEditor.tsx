'use client';

import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Collaboration from '@tiptap/extension-collaboration';
import CollaborationCursor from '@tiptap/extension-collaboration-cursor';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';

interface RichTextEditorProps {
  documentId: string;
  initialContent?: string;
  readOnly?: boolean;
  onUpdate?: (content: string) => void;
  userName?: string;
  userColor?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  documentId,
  initialContent = '',
  readOnly = false,
  onUpdate,
  userName = 'Anonymous',
  userColor = '#' + Math.floor(Math.random() * 16777215).toString(16), // Random color
}) => {
  const [ydoc, setYdoc] = useState<Y.Doc | null>(null);
  const [provider, setProvider] = useState<WebsocketProvider | null>(null);

  useEffect(() => {
    // Initialize Yjs document and provider
    const doc = new Y.Doc();
    
    // In a real application, replace with your actual WebSocket server URL
    const websocketProvider = new WebsocketProvider(
      'ws://localhost:1234', // This should be replaced with your actual WebSocket server URL
      `document-${documentId}`,
      doc
    );

    websocketProvider.on('status', (event: { status: string }) => {
      console.log('WebSocket connection status:', event.status);
    });

    setYdoc(doc);
    setProvider(websocketProvider);

    return () => {
      // Clean up
      websocketProvider.disconnect();
      doc.destroy();
    };
  }, [documentId]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        history: false, // Disable history as it's handled by Yjs
      }),
      // Only add collaboration extensions if ydoc is available
      ...(ydoc
        ? [
            Collaboration.configure({
              document: ydoc,
            }),
            CollaborationCursor.configure({
              provider: provider!,
              user: {
                name: userName,
                color: userColor,
              },
            }),
          ]
        : []),
    ],
    content: initialContent,
    editable: !readOnly,
    onUpdate: ({ editor }) => {
      if (onUpdate) {
        onUpdate(editor.getHTML());
      }
    },
  }, [ydoc, provider, readOnly]);

  // Toolbar component for basic formatting
  const Toolbar = () => {
    if (!editor || readOnly) return null;

    return (
      <div className="flex flex-wrap gap-2 p-2 border-b border-gray-200 bg-gray-50">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`px-2 py-1 rounded ${
            editor.isActive('bold') ? 'bg-blue-100 text-blue-800' : 'bg-white border border-gray-300'
          }`}
          title="Bold"
        >
          <strong>B</strong>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`px-2 py-1 rounded ${
            editor.isActive('italic') ? 'bg-blue-100 text-blue-800' : 'bg-white border border-gray-300'
          }`}
          title="Italic"
        >
          <em>I</em>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`px-2 py-1 rounded ${
            editor.isActive('strike') ? 'bg-blue-100 text-blue-800' : 'bg-white border border-gray-300'
          }`}
          title="Strike"
        >
          <span className="line-through">S</span>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`px-2 py-1 rounded ${
            editor.isActive('heading', { level: 1 }) ? 'bg-blue-100 text-blue-800' : 'bg-white border border-gray-300'
          }`}
          title="Heading 1"
        >
          H1
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`px-2 py-1 rounded ${
            editor.isActive('heading', { level: 2 }) ? 'bg-blue-100 text-blue-800' : 'bg-white border border-gray-300'
          }`}
          title="Heading 2"
        >
          H2
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`px-2 py-1 rounded ${
            editor.isActive('bulletList') ? 'bg-blue-100 text-blue-800' : 'bg-white border border-gray-300'
          }`}
          title="Bullet List"
        >
          • List
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`px-2 py-1 rounded ${
            editor.isActive('orderedList') ? 'bg-blue-100 text-blue-800' : 'bg-white border border-gray-300'
          }`}
          title="Ordered List"
        >
          1. List
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`px-2 py-1 rounded ${
            editor.isActive('codeBlock') ? 'bg-blue-100 text-blue-800' : 'bg-white border border-gray-300'
          }`}
          title="Code Block"
        >
          {'</>'}
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`px-2 py-1 rounded ${
            editor.isActive('blockquote') ? 'bg-blue-100 text-blue-800' : 'bg-white border border-gray-300'
          }`}
          title="Quote"
        >
          &quot;
        </button>
        <button
          onClick={() => editor.chain().focus().undo().run()}
          className="px-2 py-1 rounded bg-white border border-gray-300"
          title="Undo"
          disabled={!editor.can().undo()}
        >
          ↩
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          className="px-2 py-1 rounded bg-white border border-gray-300"
          title="Redo"
          disabled={!editor.can().redo()}
        >
          ↪
        </button>
      </div>
    );
  };

  return (
    <div className="border border-gray-300 rounded-md overflow-hidden">
      <Toolbar />
      <div className="p-4 min-h-[200px]">
        <EditorContent editor={editor} className="prose max-w-none" />
      </div>
      {!readOnly && provider && (
        <div className="px-4 py-2 bg-gray-50 text-sm text-gray-500 border-t border-gray-200">
          {provider.wsconnected ? (
            <span className="flex items-center">
              <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
              Connected • {userName}
            </span>
          ) : (
            <span className="flex items-center">
              <span className="w-2 h-2 rounded-full bg-red-500 mr-2"></span>
              Disconnected
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default RichTextEditor;