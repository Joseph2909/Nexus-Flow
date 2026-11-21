import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { Background, ReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import './styles.css';

const initialNodes = [
  {
    id: '1',
    position: { x: 120, y: 140 },
    data: { label: 'Start' },
  },
  {
    id: '2',
    position: { x: 420, y: 140 },
    data: { label: 'Workspace' },
  },
];

function App() {
  const [nodes, setNodes] = useState(initialNodes);

  return (
    <main className="app-shell">
      <div className="canvas-heading">
        <h1>NexusFlow</h1>
        <p>Basic workspace canvas</p>
      </div>
      <div className="flow-canvas">
        <ReactFlow
          nodes={nodes}
          onNodesChange={(changes) => setNodes((current) => changes.applyTo(current))}
          fitView
          nodesConnectable={false}
          proOptions={{ hideAttribution: true }}
        >
          <Background />
        </ReactFlow>
      </div>
    </main>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
