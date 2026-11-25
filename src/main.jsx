import React, { useCallback, useRef } from 'react';
import ReactDOM from 'react-dom/client';
import {
  addEdge,
  Background,
  Controls,
  Handle,
  MiniMap,
  Position,
  ReactFlow,
  ReactFlowProvider,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from '@xyflow/react';
import { BrowserRouter, Link, NavLink, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import '@xyflow/react/dist/style.css';
import './styles.css';

const initialNodes = [
  {
    id: 'sensor',
    type: 'dataSource',
    position: { x: 80, y: 40 },
    data: {
      category: 'dataSource',
      label: 'Browser Input',
      description: 'Frontend input',
      detail: 'User or page event',
      icon: 'IN',
    },
  },
  {
    id: 'average',
    type: 'mathOperation',
    position: { x: 80, y: 200 },
    data: {
      category: 'mathOperation',
      label: 'Client Logic',
      description: 'Frontend operation',
      detail: 'Process in the browser',
      icon: 'fx',
    },
  },
  {
    id: 'alert',
    type: 'actionTrigger',
    position: { x: 80, y: 360 },
    data: {
      category: 'actionTrigger',
      label: 'UI Notification',
      description: 'Interface trigger',
      detail: 'Update the screen',
      icon: 'GO',
    },
  },
];

const nodeTemplates = [
  {
    type: 'dataSource',
    category: 'dataSource',
    label: 'Input',
    description: 'Capture a frontend event',
    detail: 'User or page event',
    icon: 'IN',
  },
  {
    type: 'mathOperation',
    category: 'mathOperation',
    label: 'Logic',
    description: 'Process values in the browser',
    detail: 'Run client-side logic',
    icon: 'fx',
  },
  {
    type: 'actionTrigger',
    category: 'actionTrigger',
    label: 'Action Trigger',
    description: 'Send an alert',
    detail: 'When rule matches',
    icon: 'GO',
  },
];

const nodeDragType = 'application/nexus-flow-node';
const nodeTypes = {
  dataSource: WorkflowNode,
  mathOperation: WorkflowNode,
  actionTrigger: WorkflowNode,
};

function WorkflowNode({ data }) {
  return (
    <div className={`flow-node flow-node-${data.category}`}>
      {data.category !== 'dataSource' && <Handle type="target" position={Position.Top} />}
      <div className="flow-node-heading">
        <span className="flow-node-icon" aria-hidden="true">{data.icon}</span>
        <span className="flow-node-copy">
          <strong>{data.label}</strong>
          <span>{data.description}</span>
        </span>
        <span className="flow-node-menu" aria-hidden="true">···</span>
      </div>
      <div className="flow-node-detail">{data.detail}</div>
      {data.category !== 'actionTrigger' && <Handle type="source" position={Position.Bottom} />}
    </div>
  );
}

function AppLayout() {
  const { pathname } = useLocation();
  const pageTitle = pathname === '/canvas' ? 'Flow canvas' : 'Overview';

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <Link className="brand" to="/" aria-label="NexusFlow home">
          <span className="brand-mark">N</span>
          <span>Nexus<span className="brand-light">Flow</span></span>
        </Link>

        <div className="nav-label">WORKSPACE</div>
        <nav className="main-nav" aria-label="Main navigation">
          <NavLink to="/" end className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            <span className="nav-icon" aria-hidden="true">⌂</span>
            Overview
          </NavLink>
          <NavLink to="/canvas" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>
            <span className="nav-icon" aria-hidden="true">◇</span>
            Canvas
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <span className="status-dot" />
          Your workspace is ready
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <div className="breadcrumb">NEXUSFLOW <span>/</span> WORKSPACE</div>
            <h1>{pageTitle}</h1>
          </div>
          {pathname !== '/canvas' && (
            <Link className="button button-primary topbar-action" to="/canvas">
              Open canvas <span aria-hidden="true">-&gt;</span>
            </Link>
          )}
        </header>

        <div className="page-content">
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/canvas" element={<CanvasPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

function Overview() {
  return (
    <section className="overview-page">
      <div className="welcome-card">
        <div className="welcome-copy">
          <span className="section-kicker">VISUAL WORKFLOW BUILDER</span>
          <h2>Make your ideas flow.</h2>
          <p>Build a workflow by placing nodes on the canvas and connecting the steps together.</p>
          <Link className="button button-light" to="/canvas">Go to canvas <span aria-hidden="true">-&gt;</span></Link>
        </div>
        <div className="welcome-art" aria-hidden="true">
          <div className="art-node art-node-start">Start</div>
          <div className="art-connector" />
          <div className="art-node art-node-action">Action</div>
          <div className="art-connector art-connector-short" />
          <div className="art-node art-node-output">Output</div>
        </div>
      </div>

      <div className="overview-heading">
        <div>
          <span className="section-kicker">GETTING STARTED</span>
          <h2>Your workspace</h2>
        </div>
        <span className="workspace-badge"><span className="status-dot" /> Ready to build</span>
      </div>

      <div className="getting-started-card">
        <div className="getting-started-icon" aria-hidden="true">01</div>
        <div>
          <h3>Create your first flow</h3>
          <p>Drag a node from the library onto the canvas. Connect nodes by dragging between their handles.</p>
        </div>
        <Link className="text-link" to="/canvas">Open canvas <span aria-hidden="true">-&gt;</span></Link>
      </div>
    </section>
  );
}

function CanvasPage() {
  return (
    <ReactFlowProvider>
      <CanvasEditor />
    </ReactFlowProvider>
  );
}

function CanvasEditor() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([
    { id: 'sensor-average', source: 'sensor', target: 'average' },
    { id: 'average-alert', source: 'average', target: 'alert' },
  ]);
  const { screenToFlowPosition, fitView } = useReactFlow();
  const canvasRef = useRef(null);
  const nextNodeId = useRef(3);

  const addNode = useCallback((template, position) => {
    setNodes((currentNodes) => [
      ...currentNodes,
      {
        id: String(nextNodeId.current++),
        type: template.type,
        position,
        data: {
          category: template.category,
          label: template.label,
          description: template.description,
          detail: template.detail,
          icon: template.icon,
        },
      },
    ]);
  }, [setNodes]);

  const addNodeAtCanvasCenter = useCallback((template) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const bounds = canvas.getBoundingClientRect();
    addNode(
      template,
      screenToFlowPosition({
        x: bounds.left + bounds.width / 2,
        y: bounds.top + bounds.height / 2,
      }),
    );
  }, [addNode, screenToFlowPosition]);

  const onConnect = useCallback((connection) => {
    setEdges((currentEdges) => addEdge(connection, currentEdges));
  }, [setEdges]);

  const onDragStart = (event, template) => {
    event.dataTransfer.setData(nodeDragType, template.type);
    event.dataTransfer.effectAllowed = 'move';
  };

  const onDrop = (event) => {
    event.preventDefault();
    const type = event.dataTransfer.getData(nodeDragType);
    const template = nodeTemplates.find((item) => item.type === type);
    if (!template) return;

    addNode(
      template,
      screenToFlowPosition({ x: event.clientX, y: event.clientY }),
    );
  };

  const resetCanvas = () => {
    setNodes(initialNodes);
    setEdges([
      { id: 'sensor-average', source: 'sensor', target: 'average' },
      { id: 'average-alert', source: 'average', target: 'alert' },
    ]);
    nextNodeId.current = 4;
    requestAnimationFrame(() => fitView({ padding: 0.2 }));
  };

  return (
    <section className="canvas-page">
      <aside className="node-library">
        <div className="library-heading">
          <span className="section-kicker">BUILD YOUR FLOW</span>
          <h2>Node library</h2>
          <p>Add steps to your canvas, then connect them.</p>
        </div>

        <div className="node-list">
          {nodeTemplates.map((template, index) => (
            <button
              className="node-palette-item"
              type="button"
              draggable="true"
              key={template.type}
              onDragStart={(event) => onDragStart(event, template)}
              onClick={() => addNodeAtCanvasCenter(template)}
            >
              <span className={`palette-symbol palette-symbol-${template.type}`}>{String(index + 1).padStart(2, '0')}</span>
              <span className="palette-copy">
                <strong>{template.label}</strong>
                <span>{template.description}</span>
              </span>
              <span className="drag-indicator" aria-hidden="true">+</span>
            </button>
          ))}
        </div>

        <div className="library-tip">
          <span className="tip-icon" aria-hidden="true">i</span>
          <p>Drag a step onto the canvas, or click to add it in the center.</p>
        </div>
      </aside>

      <div className="canvas-workspace">
        <div className="canvas-toolbar">
          <div className="canvas-title">
            <strong>Untitled flow</strong>
            <span>{nodes.length} nodes <span className="toolbar-divider">/</span> {edges.length} connections</span>
          </div>
          <button className="button button-secondary" type="button" onClick={resetCanvas}>Reset</button>
        </div>

        <div
          className="flow-canvas"
          ref={canvasRef}
          onDrop={onDrop}
          onDragOver={(event) => {
            event.preventDefault();
            event.dataTransfer.dropEffect = 'move';
          }}
        >
          <ReactFlow
            nodeTypes={nodeTypes}
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
            fitViewOptions={{ padding: 0.2 }}
          >
            <Background gap={20} size={1} color="#e5e8f0" bgColor="#fcfcfe" />
            <Controls />
            <MiniMap pannable zoomable />
          </ReactFlow>
        </div>
      </div>
    </section>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  </React.StrictMode>,
);
