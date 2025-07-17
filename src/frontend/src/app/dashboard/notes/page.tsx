'use client';

import React, { useState, useEffect } from 'react';
import UserGuide from '../../../components/UserGuide';
import ConfirmDeleteModal, { useConfirmDeleteModal } from '../../../components/ConfirmDeleteModal';
import { contentAPI, Note } from '../../../lib/contentApi';

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Confirmation modal hook
  const {
    isOpen: isDeleteModalOpen,
    pendingDelete,
    showDeleteConfirm,
    handleConfirm: confirmDelete,
    handleClose: closeDeleteModal,
  } = useConfirmDeleteModal();

  // Load notes from API on component mount
  useEffect(() => {
    loadNotes();
  }, []);

  const loadNotes = async () => {
    try {
      setLoading(true);
      const fetchedNotes = await contentAPI.getNotes();
      setNotes(fetchedNotes);
      
      // If no notes exist, create a welcome note
      if (fetchedNotes.length === 0) {
        const welcomeNote = await contentAPI.createNote({
          title: 'Welcome to Notes',
          content: {
            richText: 'This is your first note! You can create, edit, and organize your thoughts here. Everything is automatically saved to your cloud database.',
            format: 'richtext'
          },
          tags: ['welcome'],
          projectId: '507f1f77bcf86cd799439011'
        });
        setNotes([welcomeNote]);
        setSelectedNote(welcomeNote);
      } else {
        setSelectedNote(fetchedNotes[0]);
      }
    } catch (error) {
      console.error('Error loading notes:', error);
    } finally {
      setLoading(false);
    }
  };

  const createNewNote = async () => {
    try {
      setSaving(true);
      const newNote = await contentAPI.createNote({
        title: 'New Note',
        content: {
          richText: 'Start writing...',
          format: 'richtext'
        },
        tags: [],
        projectId: '507f1f77bcf86cd799439011'
      });
      
      setNotes([newNote, ...notes]);
      setSelectedNote(newNote);
      startEditing(newNote);
    } catch (error) {
      console.error('Error creating note:', error);
      alert('Error creating note. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const startEditing = (note: Note) => {
    setEditTitle(note.title);
    setEditContent(note.content.richText);
    setIsEditing(true);
  };

  const saveNote = async () => {
    if (!selectedNote || !editTitle.trim() || !editContent.trim()) {
      alert('Please fill in both title and content');
      return;
    }

    try {
      setSaving(true);
      const updatedNote = await contentAPI.updateNote(selectedNote._id!, {
        title: editTitle,
        content: {
          richText: editContent,
          format: 'richtext'
        }
      });

      setNotes(notes.map(note => 
        note._id === selectedNote._id ? updatedNote : note
      ));
      setSelectedNote(updatedNote);
      setIsEditing(false);
    } catch (error) {
      console.error('Error saving note:', error);
      alert('Error saving note. Please try again.');
    } finally {
      setSaving(false);
    }
  };

    const deleteNoteHandler = async (noteId: string) => {
    try {
      setSaving(true);
      await contentAPI.deleteNote(noteId);
      
      const updatedNotes = notes.filter(note => note._id !== noteId);
      setNotes(updatedNotes);
      
      if (selectedNote?._id === noteId) {
        setSelectedNote(updatedNotes.length > 0 ? updatedNotes[0] : null);
      }
    } catch (error) {
      console.error('Error deleting note:', error);
      alert('Error deleting note. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const initiateDelete = (noteId: string, noteTitle: string) => {
    showDeleteConfirm(noteId, noteTitle, 'note', () => deleteNoteHandler(noteId));
  };

  const cancelEditing = () => {
    setIsEditing(false);
    setEditTitle('');
    setEditContent('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your notes from the cloud...</p>
        </div>
      </div>
    );
  }

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
                key={note._id}
                onClick={() => setSelectedNote(note)}
                className={`p-3 rounded cursor-pointer border ${
                  selectedNote?._id === note._id 
                    ? 'bg-indigo-50 border-indigo-200 dark:bg-indigo-900 dark:border-indigo-700' 
                    : 'bg-gray-50 border-gray-200 dark:bg-gray-700 dark:border-gray-600'
                }`}
              >
                <div className="font-medium text-gray-900 dark:text-white truncate">
                  {note.title}
                </div>
                <div className="text-sm text-gray-500 dark:text-gray-400 truncate">
                  {note.content.richText}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {note.updatedAt ? new Date(note.updatedAt).toLocaleDateString() : 'Just now'}
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
                        disabled={saving}
                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 disabled:opacity-50 flex items-center gap-1"
                      >
                        {saving ? (
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white"></div>
                        ) : (
                          'Save'
                        )}
                      </button>
                      <button
                        onClick={cancelEditing}
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
                        onClick={() => initiateDelete(selectedNote._id!, selectedNote.title)}
                        disabled={saving}
                        className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 disabled:opacity-50"
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
                      {selectedNote.content.richText}
                    </div>
                    <div className="mt-4 pt-4 border-t border-gray-300 dark:border-gray-600 text-xs text-gray-500">
                      <div className="flex justify-between">
                        <span>Created: {selectedNote.createdAt ? new Date(selectedNote.createdAt).toLocaleString() : 'Just now'}</span>
                        <span>Updated: {selectedNote.updatedAt ? new Date(selectedNote.updatedAt).toLocaleString() : 'Just now'}</span>
                      </div>
                      <div className="mt-2 text-green-600 font-medium">
                        ✅ Saved to MongoDB Atlas
                      </div>
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

      {/* Confirmation Modal */}
      <ConfirmDeleteModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        itemType="note"
        itemName={pendingDelete?.name || ''}
        loading={saving}
      />
    </div>
  );
}
