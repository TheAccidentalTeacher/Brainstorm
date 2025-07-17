'use client';

import React, { useState } from 'react';
import UserGuide from '../../../components/UserGuide';

interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
}

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      title: 'Welcome to Notes',
      content: 'This is your first note! You can create, edit, and organize your thoughts here.',
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: ['welcome']
    }
  ]);
  
  const [selectedNote, setSelectedNote] = useState<Note | null>(notes[0]);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');

  const createNewNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'New Note',
      content: 'Start writing...',
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: []
    };
    setNotes([newNote, ...notes]);
    setSelectedNote(newNote);
    startEditing(newNote);
  };

  const startEditing = (note: Note) => {
    setEditTitle(note.title);
    setEditContent(note.content);
    setIsEditing(true);
  };

  const saveNote = () => {
    if (!selectedNote) return;
    
    const updatedNote = {
      ...selectedNote,
      title: editTitle,
      content: editContent,
      updatedAt: new Date()
    };
    
    setNotes(notes.map(n => n.id === selectedNote.id ? updatedNote : n));
    setSelectedNote(updatedNote);
    setIsEditing(false);
  };

  const deleteNote = (noteId: string) => {
    setNotes(notes.filter(n => n.id !== noteId));
    if (selectedNote?.id === noteId) {
      setSelectedNote(notes.find(n => n.id !== noteId) || null);
    }
  };

  return (
    <div>
      <UserGuide />
      
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notes</h1>
        <p className="text-gray-600 dark:text-gray-400">Capture and organize your thoughts</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        {/* Notes List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-gray-900 dark:text-white">Your Notes</h2>
            <button
              onClick={createNewNote}
              className="bg-indigo-600 text-white px-3 py-1 rounded text-sm hover:bg-indigo-700"
            >
              + New
            </button>
          </div>
          
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {notes.map(note => (
              <div
                key={note.id}
                onClick={() => setSelectedNote(note)}
                className={`p-3 rounded cursor-pointer border ${
                  selectedNote?.id === note.id 
                    ? 'bg-indigo-50 border-indigo-200 dark:bg-indigo-900 dark:border-indigo-700' 
                    : 'bg-gray-50 border-gray-200 dark:bg-gray-700 dark:border-gray-600'
                }`}
              >
                <div className="font-medium text-gray-900 dark:text-white truncate">
                  {note.title}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {note.content}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {note.updatedAt.toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Note Editor */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          {selectedNote ? (
            <div className="h-full flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <div className="flex-1">
                  {isEditing ? (
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="text-xl font-bold w-full bg-transparent border-b border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white focus:outline-none focus:border-indigo-500"
                    />
                  ) : (
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      {selectedNote.title}
                    </h2>
                  )}
                </div>
                <div className="flex space-x-2">
                  {isEditing ? (
                    <>
                      <button
                        onClick={saveNote}
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="bg-gray-600 text-white px-3 py-1 rounded text-sm hover:bg-gray-700"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEditing(selectedNote)}
                        className="bg-indigo-600 text-white px-3 py-1 rounded text-sm hover:bg-indigo-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteNote(selectedNote.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
              
              <div className="flex-1">
                {isEditing ? (
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="w-full h-full p-3 border border-gray-300 dark:border-gray-600 rounded bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                    placeholder="Write your note here..."
                  />
                ) : (
                  <div className="h-full p-3 bg-gray-50 dark:bg-gray-700 rounded border border-gray-200 dark:border-gray-600">
                    <div className="whitespace-pre-wrap text-gray-900 dark:text-white">
                      {selectedNote.content}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
              Select a note to view or create a new one
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
