import { Handle, Position } from '@xyflow/react';

import './CustomNode.css';

function CustomNode({ data, type }) {
    const showTarget = type !== 'start';
    const showSource = type !== 'end';

    return (
        <div className={`custom-node custom-node-${type}`}>
            {showTarget && <Handle type="target" position={Position.Top} />}

            <strong>{data.label}</strong>
            {data.description && <span>{data.description}</span>}

            {showSource && <Handle type="source" position={Position.Bottom} />}
        </div>
    );
}

export default CustomNode;