import { useCallback } from 'react';
import {
    ReactFlow,
    Background,
    Controls,
    MiniMap,
    addEdge,
    useNodesState,
    useEdgesState,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import './WorkflowCanvas.css';

const initialNodes = [
    {
        id: '1',
        position: { x: 100, y: 100 },
        data: { label: 'Start Workflow' },
        type: 'input',
    },
    {
        id: '2',
        position: { x: 350, y: 100 },
        data: { label: 'Check Temperature' },
    },
    {
        id: '3',
        position: { x: 600, y: 100 },
        data: { label: 'Send Alert' },
        type: 'output',
    },
];

const initialEdges = [
    { id: 'e1-2', source: '1', target: '2' },
    { id: 'e2-3', source: '2', target: '3' },
];

function WorkflowCanvas() {
    const [nodes, setNodes, onNodesChange] =
        useNodesState(initialNodes);

    const [edges, setEdges, onEdgesChange] =
        useEdgesState(initialEdges);

    const onConnect = useCallback(
        (connection) => {
            setEdges((eds) => addEdge(connection, eds));
        },
        [setEdges]
    );

    return (
        <div className="workflow-canvas">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                fitView
            >
                <Background color="#cbd5e1" gap={20} />
                <Controls />
                <MiniMap />
            </ReactFlow>
        </div>
    );
}

export default WorkflowCanvas;