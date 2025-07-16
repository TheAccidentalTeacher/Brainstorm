'use client';

import React, { useState, useRef, useEffect } from 'react';

interface Tag {
  id: string;
  name: string;
  color?: string;
}

interface TagInputProps {
  tags: Tag[];
  onAddTag: (tag: Tag) => void;
  onRemoveTag: (tagId: string) => void;
  suggestedTags?: Tag[];
  maxTags?: number;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

const TagInput: React.FC<TagInputProps> = ({
  tags,
  onAddTag,
  onRemoveTag,
  suggestedTags = [],
  maxTags = Infinity,
  placeholder = 'Add a tag...',
  disabled = false,
  className = '',
}) => {
  const [inputValue, setInputValue] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState<Tag[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Generate a random color for new tags
  const getRandomColor = () => {
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
    return colors[Math.floor(Math.random() * colors.length)];
  };

  // Filter suggestions based on input value
  useEffect(() => {
    if (inputValue.trim()) {
      const filtered = suggestedTags.filter(
        (tag) =>
          tag.name.toLowerCase().includes(inputValue.toLowerCase()) &&
          !tags.some((t) => t.id === tag.id)
      );
      setFilteredSuggestions(filtered);
    } else {
      setFilteredSuggestions([]);
    }
  }, [inputValue, suggestedTags, tags]);

  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    setShowSuggestions(true);
  };

  // Handle key down events
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      e.preventDefault();
      addTag(inputValue.trim());
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      onRemoveTag(tags[tags.length - 1].id);
    }
  };

  // Add a new tag
  const addTag = (tagName: string) => {
    if (tags.length >= maxTags) return;

    // Check if tag already exists
    if (tags.some((tag) => tag.name.toLowerCase() === tagName.toLowerCase())) {
      return;
    }

    // Check if tag exists in suggestions
    const existingSuggestion = suggestedTags.find(
      (tag) => tag.name.toLowerCase() === tagName.toLowerCase()
    );

    if (existingSuggestion) {
      onAddTag(existingSuggestion);
    } else {
      // Create new tag
      const newTag: Tag = {
        id: `tag-${Date.now()}`,
        name: tagName,
        color: getRandomColor(),
      };
      onAddTag(newTag);
    }

    setInputValue('');
    setShowSuggestions(false);
  };

  // Handle suggestion click
  const handleSuggestionClick = (tag: Tag) => {
    onAddTag(tag);
    setInputValue('');
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  return (
    <div className={`relative ${className}`}>
      <div className="flex flex-wrap items-center gap-2 p-2 border rounded-md bg-white">
        {tags.map((tag) => (
          <div
            key={tag.id}
            className={`flex items-center px-2 py-1 rounded-md ${tag.color || 'bg-gray-100 text-gray-800 border-gray-200'}`}
          >
            <span className="text-sm">{tag.name}</span>
            {!disabled && (
              <button
                type="button"
                onClick={() => onRemoveTag(tag.id)}
                className="ml-1 text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-3 w-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        ))}
        {!disabled && tags.length < maxTags && (
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setShowSuggestions(true)}
            placeholder={tags.length === 0 ? placeholder : ''}
            className="flex-grow min-w-[120px] outline-none text-sm"
          />
        )}
      </div>

      {/* Tag suggestions */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-auto"
        >
          {filteredSuggestions.map((tag) => (
            <div
              key={tag.id}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
              onClick={() => handleSuggestionClick(tag)}
            >
              {tag.name}
            </div>
          ))}
        </div>
      )}

      {/* Max tags limit indicator */}
      {tags.length >= maxTags && (
        <div className="mt-1 text-xs text-gray-500">
          Maximum of {maxTags} tags reached
        </div>
      )}
    </div>
  );
};

export default TagInput;