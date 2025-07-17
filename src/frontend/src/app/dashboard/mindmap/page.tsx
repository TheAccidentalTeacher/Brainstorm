'use client';

import React, { useState } from 'react';
import UserGuide from '../../../components/UserGuide';
import MindMap from '../../../components/mindmap/MindMap';
import { Node, Edge, NodeChange, EdgeChange, Connection } from 'reactflow';

// Initial nodes and edges for the mind map
const initialNodes: Node[] = [
  {
    id: 'node-1',
    type: 'mindmap',
    data: { label: 'Project Hub', colorIndex: 0 },
    position: { x: 0, y: 0 },
  },
  {
    id: 'node-2',
    type: 'mindmap',
    data: { label: 'Content Creation', colorIndex: 1 },
    position: { x: -200, y: 100 },
  },
  {
    id: 'node-3',
    type: 'mindmap',
    data: { label: 'Task Management', colorIndex: 2 },
    position: { x: 200, y: 100 },
  },
  {
    id: 'node-4',
    type: 'mindmap',
    data: { label: 'Rich Text Editor', colorIndex: 1 },
    position: { x: -300, y: 200 },
  },
  {
    id: 'node-5',
    type: 'mindmap',
    data: { label: 'File Management', colorIndex: 1 },
    position: { x: -100, y: 200 },
  },
  {
    id: 'node-6',
    type: 'mindmap',
    data: { label: 'Kanban Board', colorIndex: 2 },
    position: { x: 100, y: 200 },
  },
  {
    id: 'node-7',
    type: 'mindmap',
    data: { label: 'Calendar View', colorIndex: 2 },
    position: { x: 300, y: 200 },
  },
];

const initialEdges: Edge[] = [
  { id: 'edge-1-2', source: 'node-1', target: 'node-2', type: 'smoothstep', animated: true },
  { id: 'edge-1-3', source: 'node-1', target: 'node-3', type: 'smoothstep', animated: true },
  { id: 'edge-2-4', source: 'node-2', target: 'node-4', type: 'smoothstep', animated: true },
  { id: 'edge-2-5', source: 'node-2', target: 'node-5', type: 'smoothstep', animated: true },
  { id: 'edge-3-6', source: 'node-3', target: 'node-6', type: 'smoothstep', animated: true },
  { id: 'edge-3-7', source: 'node-3', target: 'node-7', type: 'smoothstep', animated: true },
];

export default function MindMapPage() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges] = useState<Edge[]>(initialEdges);
  const [currentMindMap, setCurrentMindMap] = useState<string>('Project Hub');

  // Handle nodes change
  const onNodesChange = (changes: NodeChange[]) => {
    setNodes((nds) => {
      const updatedNodes = [...nds];
      changes.forEach((change) => {
        if (change.type === 'position' && change.position && change.id) {
          const nodeIndex = updatedNodes.findIndex((n) => n.id === change.id);
          if (nodeIndex !== -1) {
            updatedNodes[nodeIndex] = {
              ...updatedNodes[nodeIndex],
              position: change.position,
            };
          }
        }
      });
      return updatedNodes;
    });
  };

  // Handle edges change
  const onEdgesChange = (changes: EdgeChange[]) => {
    // In a real app, we would update the backend here
    console.log('Edges changed:', changes);
  };

  // Handle connect
  const onConnect = (connection: Connection) => {
    // In a real app, we would update the backend here
    console.log('Connection created:', connection);
  };

  // Save mind map
  const saveMindMap = () => {
    // In a real app, we would save to the backend here
    console.log('Saving mind map:', { nodes, edges });
    alert('Mind map saved successfully!');
  };

  return (
    <div className="container mx-auto">
      <UserGuide />
      
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Mind Map</h1>
        <p className="text-gray-600">
          Visualize your ideas and create connections between concepts.
        </p>
      </div>

      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center">
          <span className="mr-2 text-gray-700">Current Mind Map:</span>
          <select
            value={currentMindMap}
            onChange={(e) => setCurrentMindMap(e.target.value)}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="Project Hub">Project Hub</option>
            <option value="Marketing Campaign">Marketing Campaign</option>
            <option value="Product Launch">Product Launch</option>
          </select>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={saveMindMap}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center"
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
                d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
              />
            </svg>
            Save
          </button>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center">
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
                d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
              />
            </svg>
            Export
          </button>
          <button className="px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 flex items-center">
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
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
              />
            </svg>
            Share
          </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden" style={{ height: '600px' }}>
        <MindMap
          initialNodes={nodes}
          initialEdges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
        />
      </div>

      <div className="mt-8 bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Mind Mapping Tips</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium mb-2">Getting Started</h3>
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              <li>Double-click on any node to edit its text</li>
              <li>Click the color icon on a node to change its color</li>
              <li>Drag from one node&apos;s handle to another to create connections</li>
              <li>Use the panel in the top-left to add new nodes</li>
              <li>Drag nodes to rearrange your mind map</li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-medium mb-2">Best Practices</h3>
            <ul className="list-disc pl-5 space-y-1 text-gray-700">
              <li>Start with a central idea in the middle</li>
              <li>Use different colors to categorize related concepts</li>
              <li>Keep node text concise and clear</li>
              <li>Create a hierarchical structure from general to specific</li>
              <li>Save your mind map regularly to avoid losing work</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}