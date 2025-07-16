'use client';

import React, { useState } from 'react';
import TagInput from '../../../components/tags/TagInput';

// Sample tag data
const sampleTags = [
  { id: 'tag-1', name: 'Marketing', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  { id: 'tag-2', name: 'Development', color: 'bg-green-100 text-green-800 border-green-200' },
  { id: 'tag-3', name: 'Design', color: 'bg-purple-100 text-purple-800 border-purple-200' },
  { id: 'tag-4', name: 'Urgent', color: 'bg-red-100 text-red-800 border-red-200' },
  { id: 'tag-5', name: 'Low Priority', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  { id: 'tag-6', name: 'Bug', color: 'bg-pink-100 text-pink-800 border-pink-200' },
  { id: 'tag-7', name: 'Feature', color: 'bg-indigo-100 text-indigo-800 border-indigo-200' },
  { id: 'tag-8', name: 'Documentation', color: 'bg-gray-100 text-gray-800 border-gray-200' },
];

// Sample content with tags
const sampleContent = [
  {
    id: 'content-1',
    title: 'Marketing Campaign Plan',
    type: 'note',
    tags: ['tag-1', 'tag-5'],
    createdAt: '2025-07-10T10:30:00Z',
  },
  {
    id: 'content-2',
    title: 'Homepage Redesign',
    type: 'task',
    tags: ['tag-3', 'tag-4'],
    createdAt: '2025-07-12T14:20:00Z',
  },
  {
    id: 'content-3',
    title: 'API Documentation',
    type: 'note',
    tags: ['tag-2', 'tag-8'],
    createdAt: '2025-07-08T09:15:00Z',
  },
  {
    id: 'content-4',
    title: 'Fix Login Issue',
    type: 'task',
    tags: ['tag-2', 'tag-6', 'tag-4'],
    createdAt: '2025-07-15T11:45:00Z',
  },
  {
    id: 'content-5',
    title: 'User Flow Diagram',
    type: 'mindmap',
    tags: ['tag-3', 'tag-8'],
    createdAt: '2025-07-11T16:30:00Z',
  },
  {
    id: 'content-6',
    title: 'Add Payment Integration',
    type: 'task',
    tags: ['tag-2', 'tag-7'],
    createdAt: '2025-07-14T13:20:00Z',
  },
];

export default function TagsPage() {
  const [tags, setTags] = useState(sampleTags);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [newTagName, setNewTagName] = useState('');
  const [editingTag, setEditingTag] = useState<{ id: string; name: string } | null>(null);

  // Add a new tag
  const handleAddTag = () => {
    if (!newTagName.trim()) return;
    
    // Check if tag already exists
    if (tags.some((tag) => tag.name.toLowerCase() === newTagName.toLowerCase())) {
      alert('A tag with this name already exists');
      return;
    }
    
    // Generate a random color
    const colors = [
      'bg-blue-100 text-blue-800 border-blue-200',
      'bg-green-100 text-green-800 border-green-200',
      'bg-yellow-100 text-yellow-800 border-yellow-200',
      'bg-red-100 text-red-800 border-red-200',
      'bg-purple-100 text-purple-800 border-purple-200',
      'bg-pink-100 text-pink-800 border-pink-200',
      'bg-indigo-100 text-indigo-800 border-indigo-200',
      'bg-gray-100 text-gray-800 border-gray-200',
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    const newTag = {
      id: `tag-${Date.now()}`,
      name: newTagName,
      color: randomColor,
    };
    
    setTags([...tags, newTag]);
    setNewTagName('');
  };

  // Delete a tag
  const handleDeleteTag = (tagId: string) => {
    setTags(tags.filter((tag) => tag.id !== tagId));
    setSelectedTags(selectedTags.filter((id) => id !== tagId));
  };

  // Start editing a tag
  const handleEditTag = (tag: { id: string; name: string }) => {
    setEditingTag(tag);
  };

  // Save edited tag
  const handleSaveTag = () => {
    if (!editingTag) return;
    
    // Check if tag name already exists
    if (
      tags.some(
        (tag) =>
          tag.id !== editingTag.id &&
          tag.name.toLowerCase() === editingTag.name.toLowerCase()
      )
    ) {
      alert('A tag with this name already exists');
      return;
    }
    
    setTags(
      tags.map((tag) =>
        tag.id === editingTag.id ? { ...tag, name: editingTag.name } : tag
      )
    );
    setEditingTag(null);
  };

  // Toggle tag selection
  const handleTagSelection = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId)
        ? prev.filter((id) => id !== tagId)
        : [...prev, tagId]
    );
  };

  // Filter content by selected tags
  const filteredContent = selectedTags.length > 0
    ? sampleContent.filter((content) =>
        selectedTags.every((tagId) => content.tags.includes(tagId))
      )
    : sampleContent;

  // Format date
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Get content type icon
  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'note':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-blue-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            />
          </svg>
        );
      case 'task':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-green-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
            />
          </svg>
        );
      case 'mindmap':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-purple-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
            />
          </svg>
        );
      default:
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
            />
          </svg>
        );
    }
  };

  return (
    <div className="container mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Tag Management</h1>
        <p className="text-gray-600">
          Create, edit, and organize tags to categorize your content.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Tag Management Section */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Manage Tags</h2>
            
            {/* Add new tag */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Create New Tag
              </label>
              <div className="flex">
                <input
                  type="text"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  placeholder="Enter tag name"
                  className="flex-grow border rounded-l-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  onClick={handleAddTag}
                  disabled={!newTagName.trim()}
                  className={`px-4 py-2 rounded-r-md ${
                    newTagName.trim()
                      ? 'bg-blue-500 text-white hover:bg-blue-600'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Add
                </button>
              </div>
            </div>
            
            {/* Tag list */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Tags ({tags.length})
              </label>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {tags.map((tag) => (
                  <div
                    key={tag.id}
                    className="flex items-center justify-between p-2 border rounded-md hover:bg-gray-50"
                  >
                    {editingTag && editingTag.id === tag.id ? (
                      <div className="flex flex-grow mr-2">
                        <input
                          type="text"
                          value={editingTag.name}
                          onChange={(e) =>
                            setEditingTag({ ...editingTag, name: e.target.value })
                          }
                          className="flex-grow border rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          autoFocus
                        />
                      </div>
                    ) : (
                      <div
                        className={`px-2 py-1 rounded-md ${tag.color}`}
                        onClick={() => handleTagSelection(tag.id)}
                      >
                        <span className="text-sm">{tag.name}</span>
                      </div>
                    )}
                    
                    <div className="flex space-x-1">
                      {editingTag && editingTag.id === tag.id ? (
                        <button
                          onClick={handleSaveTag}
                          className="p-1 text-green-500 hover:text-green-700"
                          title="Save"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleEditTag(tag)}
                          className="p-1 text-gray-500 hover:text-gray-700"
                          title="Edit"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                            />
                          </svg>
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteTag(tag.id)}
                        className="p-1 text-gray-500 hover:text-red-700"
                        title="Delete"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
                
                {tags.length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    No tags created yet
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Tag Usage Stats */}
          <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
            <h2 className="text-xl font-semibold mb-4">Tag Usage</h2>
            <div className="space-y-2">
              {tags.map((tag) => {
                const count = sampleContent.filter((content) =>
                  content.tags.includes(tag.id)
                ).length;
                
                return (
                  <div key={tag.id} className="flex items-center justify-between">
                    <div className={`px-2 py-1 rounded-md ${tag.color}`}>
                      <span className="text-sm">{tag.name}</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {count} {count === 1 ? 'item' : 'items'}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Tagged Content</h2>
            
            {/* Filter by tags */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Filter by Tags
              </label>
              <TagInput
                tags={tags.filter((tag) => selectedTags.includes(tag.id))}
                onAddTag={(tag) => handleTagSelection(tag.id)}
                onRemoveTag={(tagId) => handleTagSelection(tagId)}
                suggestedTags={tags}
                placeholder="Select tags to filter..."
              />
              {selectedTags.length > 0 && (
                <div className="mt-2 text-sm text-gray-500">
                  Showing content with all selected tags
                </div>
              )}
            </div>
            
            {/* Content list */}
            <div className="space-y-4">
              {filteredContent.map((content) => (
                <div
                  key={content.id}
                  className="border rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      {getContentTypeIcon(content.type)}
                      <h3 className="text-lg font-medium ml-2">{content.title}</h3>
                    </div>
                    <div className="text-sm text-gray-500">
                      {formatDate(content.createdAt)}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-2">
                    {content.tags.map((tagId) => {
                      const tag = tags.find((t) => t.id === tagId);
                      return tag ? (
                        <div
                          key={tag.id}
                          className={`px-2 py-1 rounded-md ${tag.color}`}
                        >
                          <span className="text-sm">{tag.name}</span>
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
              ))}
              
              {filteredContent.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  {selectedTags.length > 0
                    ? 'No content matches all selected tags'
                    : 'No content available'}
                </div>
              )}
            </div>
          </div>
          
          {/* Tag a New Item */}
          <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
            <h2 className="text-xl font-semibold mb-4">Tag a New Item</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  placeholder="Enter item title"
                  className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Type
                </label>
                <select className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="note">Note</option>
                  <option value="task">Task</option>
                  <option value="mindmap">Mind Map</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tags
                </label>
                <TagInput
                  tags={[]}
                  onAddTag={() => {}}
                  onRemoveTag={() => {}}
                  suggestedTags={tags}
                  placeholder="Add tags..."
                  maxTags={5}
                />
              </div>
              
              <div className="pt-4">
                <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                  Create Item
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}