'use client';

import React, { useState, useRef } from 'react';

interface FileUploadProps {
  onUpload: (files: File[]) => void;
  multiple?: boolean;
  accept?: string;
  maxSize?: number; // in bytes
  className?: string;
}

const FileUpload: React.FC<FileUploadProps> = ({
  onUpload,
  multiple = false,
  accept = '*/*',
  maxSize = 10 * 1024 * 1024, // 10MB default
  className = '',
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const validateFiles = (files: File[]): File[] => {
    setError(null);
    
    // Filter files by size and type
    const validFiles = Array.from(files).filter(file => {
      // Check file size
      if (file.size > maxSize) {
        setError(`File "${file.name}" exceeds the maximum size of ${maxSize / 1024 / 1024}MB`);
        return false;
      }
      
      // Check file type if accept is specified and not wildcard
      if (accept !== '*/*') {
        const acceptTypes = accept.split(',').map(type => type.trim());
        const fileType = file.type;
        const fileExtension = `.${file.name.split('.').pop()}`;
        
        const isValidType = acceptTypes.some(type => {
          if (type.startsWith('.')) {
            // Check by extension
            return fileExtension.toLowerCase() === type.toLowerCase();
          } else if (type.endsWith('/*')) {
            // Check by MIME type category
            const category = type.split('/')[0];
            return fileType.startsWith(`${category}/`);
          } else {
            // Check exact MIME type
            return fileType === type;
          }
        });
        
        if (!isValidType) {
          setError(`File "${file.name}" is not an accepted file type`);
          return false;
        }
      }
      
      return true;
    });
    
    return validFiles;
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = e.dataTransfer.files;
      const filesToUpload = multiple ? Array.from(droppedFiles) : [droppedFiles[0]];
      const validFiles = validateFiles(filesToUpload);
      
      if (validFiles.length > 0) {
        onUpload(validFiles);
      }
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = e.target.files;
      const filesToUpload = multiple ? Array.from(selectedFiles) : [selectedFiles[0]];
      const validFiles = validateFiles(filesToUpload);
      
      if (validFiles.length > 0) {
        onUpload(validFiles);
      }
      
      // Reset the input so the same file can be uploaded again if needed
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className={`w-full ${className}`}>
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleButtonClick}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileInputChange}
          multiple={multiple}
          accept={accept}
        />
        
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
        
        <p className="mt-2 text-sm font-medium text-gray-900">
          {isDragging ? 'Drop files here' : 'Drag and drop files here'}
        </p>
        <p className="mt-1 text-xs text-gray-500">
          or <span className="text-blue-500 hover:underline">browse</span> to upload
        </p>
        
        {multiple && (
          <p className="mt-1 text-xs text-gray-500">You can upload multiple files</p>
        )}
        
        {accept !== '*/*' && (
          <p className="mt-1 text-xs text-gray-500">
            Accepted file types: {accept.split(',').join(', ')}
          </p>
        )}
        
        <p className="mt-1 text-xs text-gray-500">
          Max file size: {maxSize / 1024 / 1024}MB
        </p>
      </div>
      
      {error && (
        <div className="mt-2 text-sm text-red-600">
          {error}
        </div>
      )}
    </div>
  );
};

export default FileUpload;