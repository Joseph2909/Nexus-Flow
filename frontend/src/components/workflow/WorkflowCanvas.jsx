import { useCallback, useEffect, useRef } from 'react';
import {
    ReactFlow,
    Background,
    Controls,
    MiniMap,
    addEdge,
    ReactFlowProvider,
    useReactFlow,
    useNodesState,
    useEdgesState,
} from '@xyflow/react';

import '@xyflow/react/dist/style.css';
import CustomNode from './CustomNode';
import './WorkflowCanvas.css';

const initialNodes = [
    {
        id: '1',
        position: { x: 100, y: 100 },
        data: { label: 'Start Workflow', description: 'Begin workflow' },
        type: 'start',
    },
    {
        id: '2',
        position: { x: 350, y: 100 },
        data: { label: 'Check Temperature', description: 'Evaluate sensor data' },
        type: 'condition',
    },
    {
        id: '3',
        position: { x: 600, y: 100 },
        data: { label: 'Send Alert', description: 'Notify the team' },
        type: 'action',
    },
];

const initialEdges = [
    { id: 'e1-2', source: '1', target: '2' },
    { id: 'e2-3', source: '2', target: '3' },
];

const nodeTypes = {
    start: CustomNode,
    condition: CustomNode,
    action: CustomNode,
    end: CustomNode,
};

function WorkflowCanvasContent({ onWorkflowChange }) {
    const [nodes, setNodes, onNodesChange] =
        useNodesState(initialNodes);
    const [edges, setEdges, onEdgesChange] =
        useEdgesState(initialEdges);
    const { screenToFlowPosition } = useReactFlow();
    const nextNodeId = useRef(4);

    useEffect(() => {
        onWorkflowChange?.({ nodes, edges });
    }, [edges, nodes, onWorkflowChange]);

    const onConnect = useCallback(
        (connection) => {
            if (connection.source === connection.target) {
                return;
            }

            setEdges((eds) => addEdge(connection, eds));
        },
        [setEdges]
    );

    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    const onDrop = useCallback((event) => {
        event.preventDefault();

        const componentData = event.dataTransfer.getData('application/reactflow');

        if (!componentData) {
            return;
        }

        const component = JSON.parse(componentData);
        const position = screenToFlowPosition({
            x: event.clientX,
            y: event.clientY,
        });

        setNodes((currentNodes) => [
            ...currentNodes,
            {
                id: String(nextNodeId.current++),
                position,
                type: component.type,
                data: {
                    label: component.label,
                    description: component.description,
                },
            },
        ]);
    }, [screenToFlowPosition, setNodes]);

    return (
        <div className="workflow-canvas">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                nodeTypes={nodeTypes}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onDragOver={onDragOver}
                onDrop={onDrop}
                isValidConnection={(connection) =>
                    connection.source !== connection.target
                }
                fitView
            >
                <Background color="#cbd5e1" gap={20} />
                <Controls />
                <MiniMap />
            </ReactFlow>
        </div>
    );
}

function WorkflowCanvas({ onWorkflowChange }) {
    return (
        <ReactFlowProvider>
            <WorkflowCanvasContent onWorkflowChange={onWorkflowChange} />
        </ReactFlowProvider>
    );
}

export default WorkflowCanvas;