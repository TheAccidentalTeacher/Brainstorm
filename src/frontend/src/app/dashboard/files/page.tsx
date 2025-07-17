'use client';

import React, { useState } from 'react';
import UserGuide from '../../../components/UserGuide';
import FileUpload from '../../../components/files/FileUpload';
import FileBrowser, { FileItem } from '../../../components/files/FileBrowser';

// Sample data for the file browser
const sampleFiles: FileItem[] = [
  {
    id: 'file-1',
    name: 'Project Proposal.pdf',
    type: 'file',
    size: 2500000,
    mimeType: 'application/pdf',
    extension: 'pdf',
    url: '#',
    createdAt: '2025-07-10T10:30:00Z',
    updatedAt: '2025-07-10T10:30:00Z',
    createdBy: {
      id: 'user-1',
      name: 'John Doe',
    },
    isStarred: true,
  },
  {
    id: 'file-2',
    name: 'Marketing Strategy.docx',
    type: 'file',
    size: 1800000,
    mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    extension: 'docx',
    url: '#',
    createdAt: '2025-07-08T14:20:00Z',
    updatedAt: '2025-07-12T09:15:00Z',
    createdBy: {
      id: 'user-2',
      name: 'Jane Smith',
    },
  },
  {
    id: 'file-3',
    name: 'Budget Forecast.xlsx',
    type: 'file',
    size: 3200000,
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    extension: 'xlsx',
    url: '#',
    createdAt: '2025-07-05T11:45:00Z',
    updatedAt: '2025-07-11T16:30:00Z',
    createdBy: {
      id: 'user-3',
      name: 'Mike Johnson',
    },
  },
  {
    id: 'file-4',
    name: 'Team Photo.jpg',
    type: 'file',
    size: 4500000,
    mimeType: 'image/jpeg',
    extension: 'jpg',
    url: '#',
    thumbnailUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c',
    createdAt: '2025-07-02T09:00:00Z',
    updatedAt: '2025-07-02T09:00:00Z',
    createdBy: {
      id: 'user-1',
      name: 'John Doe',
    },
  },
  {
    id: 'file-5',
    name: 'Product Mockup.png',
    type: 'file',
    size: 3800000,
    mimeType: 'image/png',
    extension: 'png',
    url: '#',
    thumbnailUrl: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c',
    createdAt: '2025-07-14T13:20:00Z',
    updatedAt: '2025-07-14T13:20:00Z',
    createdBy: {
      id: 'user-2',
      name: 'Jane Smith',
    },
    isShared: true,
  },
];

const sampleFolders: FileItem[] = [
  {
    id: 'folder-1',
    name: 'Marketing',
    type: 'folder',
    createdAt: '2025-07-01T08:00:00Z',
    updatedAt: '2025-07-15T11:30:00Z',
    createdBy: {
      id: 'user-1',
      name: 'John Doe',
    },
    isStarred: true,
  },
  {
    id: 'folder-2',
    name: 'Development',
    type: 'folder',
    createdAt: '2025-07-01T08:15:00Z',
    updatedAt: '2025-07-14T16:45:00Z',
    createdBy: {
      id: 'user-2',
      name: 'Jane Smith',
    },
  },
  {
    id: 'folder-3',
    name: 'Design Assets',
    type: 'folder',
    createdAt: '2025-07-03T10:20:00Z',
    updatedAt: '2025-07-12T14:10:00Z',
    createdBy: {
      id: 'user-3',
      name: 'Mike Johnson',
    },
    isShared: true,
  },
];

// Sample nested folders and files
const nestedContent: Record<string, { folders: FileItem[]; files: FileItem[] }> = {
  'folder-1': {
    folders: [
      {
        id: 'folder-1-1',
        name: 'Campaign 2025',
        type: 'folder',
        createdAt: '2025-07-05T09:30:00Z',
        updatedAt: '2025-07-13T14:20:00Z',
        createdBy: {
          id: 'user-1',
          name: 'John Doe',
        },
        parentId: 'folder-1',
      },
    ],
    files: [
      {
        id: 'file-1-1',
        name: 'Marketing Plan.pdf',
        type: 'file',
        size: 1800000,
        mimeType: 'application/pdf',
        extension: 'pdf',
        url: '#',
        createdAt: '2025-07-06T11:20:00Z',
        updatedAt: '2025-07-06T11:20:00Z',
        createdBy: {
          id: 'user-1',
          name: 'John Doe',
        },
        parentId: 'folder-1',
      },
      {
        id: 'file-1-2',
        name: 'Social Media Strategy.docx',
        type: 'file',
        size: 950000,
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        extension: 'docx',
        url: '#',
        createdAt: '2025-07-08T15:40:00Z',
        updatedAt: '2025-07-10T09:15:00Z',
        createdBy: {
          id: 'user-2',
          name: 'Jane Smith',
        },
        parentId: 'folder-1',
      },
    ],
  },
  'folder-2': {
    folders: [],
    files: [
      {
        id: 'file-2-1',
        name: 'API Documentation.md',
        type: 'file',
        size: 350000,
        mimeType: 'text/markdown',
        extension: 'md',
        url: '#',
        createdAt: '2025-07-09T16:30:00Z',
        updatedAt: '2025-07-14T10:45:00Z',
        createdBy: {
          id: 'user-3',
          name: 'Mike Johnson',
        },
        parentId: 'folder-2',
      },
      {
        id: 'file-2-2',
        name: 'Architecture Diagram.svg',
        type: 'file',
        size: 120000,
        mimeType: 'image/svg+xml',
        extension: 'svg',
        url: '#',
        createdAt: '2025-07-11T13:20:00Z',
        updatedAt: '2025-07-11T13:20:00Z',
        createdBy: {
          id: 'user-2',
          name: 'Jane Smith',
        },
        parentId: 'folder-2',
      },
    ],
  },
  'folder-3': {
    folders: [],
    files: [
      {
        id: 'file-3-1',
        name: 'Logo.ai',
        type: 'file',
        size: 5200000,
        mimeType: 'application/illustrator',
        extension: 'ai',
        url: '#',
        createdAt: '2025-07-04T09:15:00Z',
        updatedAt: '2025-07-04T09:15:00Z',
        createdBy: {
          id: 'user-2',
          name: 'Jane Smith',
        },
        parentId: 'folder-3',
      },
      {
        id: 'file-3-2',
        name: 'UI Kit.sketch',
        type: 'file',
        size: 8700000,
        mimeType: 'application/octet-stream',
        extension: 'sketch',
        url: '#',
        createdAt: '2025-07-07T14:30:00Z',
        updatedAt: '2025-07-12T11:20:00Z',
        createdBy: {
          id: 'user-3',
          name: 'Mike Johnson',
        },
        parentId: 'folder-3',
      },
    ],
  },
  'folder-1-1': {
    folders: [],
    files: [
      {
        id: 'file-1-1-1',
        name: 'Campaign Budget.xlsx',
        type: 'file',
        size: 1200000,
        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        extension: 'xlsx',
        url: '#',
        createdAt: '2025-07-10T10:15:00Z',
        updatedAt: '2025-07-13T16:40:00Z',
        createdBy: {
          id: 'user-1',
          name: 'John Doe',
        },
        parentId: 'folder-1-1',
      },
    ],
  },
};

export default function FilesPage() {
  const [currentPath, setCurrentPath] = useState<string[]>([]);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [files, setFiles] = useState<FileItem[]>(sampleFiles);
  const [folders, setFolders] = useState<FileItem[]>(sampleFolders);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [showUploadModal, setShowUploadModal] = useState<boolean>(false);

  // Handle folder navigation
  const handleFolderClick = (folder: FileItem) => {
    setCurrentPath([...currentPath, folder.name]);
    setCurrentFolderId(folder.id);
    
    // Get content for this folder
    if (nestedContent[folder.id]) {
      setFolders(nestedContent[folder.id].folders);
      setFiles(nestedContent[folder.id].files);
    } else {
      setFolders([]);
      setFiles([]);
    }
  };

  // Handle navigate up
  const handleNavigateUp = () => {
    if (currentPath.length === 0) return;
    
    const newPath = [...currentPath];
    newPath.pop();
    setCurrentPath(newPath);
    
    if (newPath.length === 0) {
      // Back to root
      setCurrentFolderId(null);
      setFolders(sampleFolders);
      setFiles(sampleFiles);
    } else {
      // Find parent folder
      const parentFolderName = newPath[newPath.length - 1];
      let parentFolderId: string | null = null;
      
      // This is simplified - in a real app, you'd have proper parent-child relationships
      for (const folderId in nestedContent) {
        const folderContent = nestedContent[folderId];
        const parentFolder = folderContent.folders.find(f => f.name === parentFolderName);
        if (parentFolder) {
          parentFolderId = parentFolder.id;
          break;
        }
      }
      
      if (parentFolderId && nestedContent[parentFolderId]) {
        setCurrentFolderId(parentFolderId);
        setFolders(nestedContent[parentFolderId].folders);
        setFiles(nestedContent[parentFolderId].files);
      } else {
        // Fallback to root if parent not found
        setCurrentFolderId(null);
        setFolders(sampleFolders);
        setFiles(sampleFiles);
      }
    }
  };

  // Handle file click
  const handleFileClick = (file: FileItem) => {
    // In a real app, this would open the file or show a preview
    console.log('File clicked:', file);
    alert(`Opening file: ${file.name}`);
  };

  // Handle file upload
  const handleFileUpload = (uploadedFiles: File[]) => {
    setIsUploading(true);
    
    // Simulate upload delay
    setTimeout(() => {
      // Create new file items from the uploaded files
      const newFiles: FileItem[] = uploadedFiles.map((file) => {
        const extension = file.name.split('.').pop() || '';
        
        return {
          id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: file.name,
          type: 'file',
          size: file.size,
          mimeType: file.type,
          extension: extension,
          url: '#',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: {
            id: 'user-1',
            name: 'Current User',
          },
          parentId: currentFolderId || undefined,
        };
      });
      
      // Add new files to the current directory
      setFiles([...files, ...newFiles]);
      setIsUploading(false);
      setShowUploadModal(false);
    }, 1500);
  };

  // Handle delete item
  const handleDeleteItem = (item: FileItem) => {
    if (item.type === 'folder') {
      setFolders(folders.filter((folder) => folder.id !== item.id));
    } else {
      setFiles(files.filter((file) => file.id !== item.id));
    }
  };

  // Handle star item
  const handleStarItem = (item: FileItem) => {
    if (item.type === 'folder') {
      setFolders(
        folders.map((folder) =>
          folder.id === item.id
            ? { ...folder, isStarred: !folder.isStarred }
            : folder
        )
      );
    } else {
      setFiles(
        files.map((file) =>
          file.id === item.id
            ? { ...file, isStarred: !file.isStarred }
            : file
        )
      );
    }
  };

  // Handle share item
  const handleShareItem = (item: FileItem) => {
    // In a real app, this would open a sharing dialog
    alert(`Share dialog for: ${item.name}`);
  };

  return (
    <div className="container mx-auto">
      <UserGuide />
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">File Management</h1>
        <p className="text-gray-600">
          Upload, organize, and share your files and folders.
        </p>
      </div>

      <div className="mb-6 flex justify-between items-center">
        <div className="flex space-x-2">
          <button
            onClick={() => setCurrentPath([])}
            className={`px-4 py-2 rounded-md ${
              currentPath.length === 0
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            All Files
          </button>
          <button
            className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300"
          >
            Recent
          </button>
          <button
            className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300"
          >
            Starred
          </button>
          <button
            className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300"
          >
            Shared
          </button>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={() => setShowUploadModal(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
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
            Upload
          </button>
          <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
              />
            </svg>
            New Folder
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <FileBrowser
          files={files}
          folders={folders}
          currentPath={currentPath}
          onFileClick={handleFileClick}
          onFolderClick={handleFolderClick}
          onNavigateUp={handleNavigateUp}
          onDeleteItem={handleDeleteItem}
          onStarItem={handleStarItem}
          onShareItem={handleShareItem}
          isLoading={isUploading}
        />
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Upload Files</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
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
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-500 mb-2">
                Upload files to{' '}
                <span className="font-medium">
                  {currentPath.length === 0 ? 'Root' : currentPath.join(' / ')}
                </span>
              </p>
              
              <FileUpload
                onUpload={handleFileUpload}
                multiple={true}
                maxSize={50 * 1024 * 1024} // 50MB
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // This would trigger the file input in a real implementation
                  // For now, we'll just close the modal
                  setShowUploadModal(false);
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Select Files
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Storage Usage</h2>
        <div className="mb-4">
          <div className="h-4 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500"
              style={{ width: '35%' }}
            ></div>
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>7.5 GB used</span>
            <span>21.5 GB free</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-4 border rounded-lg">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
              <span className="text-gray-700">Documents</span>
            </div>
            <div className="text-xl font-semibold mt-2">2.3 GB</div>
          </div>
          <div className="p-4 border rounded-lg">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <span className="text-gray-700">Images</span>
            </div>
            <div className="text-xl font-semibold mt-2">3.1 GB</div>
          </div>
          <div className="p-4 border rounded-lg">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-purple-500 mr-2"></div>
              <span className="text-gray-700">Videos</span>
            </div>
            <div className="text-xl font-semibold mt-2">1.8 GB</div>
          </div>
          <div className="p-4 border rounded-lg">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-gray-500 mr-2"></div>
              <span className="text-gray-700">Other</span>
            </div>
            <div className="text-xl font-semibold mt-2">0.3 GB</div>
          </div>
        </div>
      </div>
    </div>
  );
}