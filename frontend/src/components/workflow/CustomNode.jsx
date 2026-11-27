import { Handle, Position } from '@xyflow/react';
import {
    Cpu,
    Gauge,
    GitBranch,
    Play,
    Square,
    Workflow,
    Zap,
} from 'lucide-react';

import './CustomNode.css';

function CustomNode({ data, type }) {
    const showTarget = type !== 'start';
    const showSource = type !== 'end';
    const icons = {
        start: Play,
        device: Cpu,
        sensor: Gauge,
        condition: GitBranch,
        logic: Workflow,
        action: Zap,
        end: Square,
    };
    const Icon = icons[type];
    const configText = type === 'device'
        ? data.config?.deviceId || 'Choose device'
        : type === 'sensor'
            ? data.config?.field || 'Choose sensor'
            : type === 'condition'
                ? `${data.config?.operator || '> '} ${data.config?.value ?? 'set value'}`
                : type === 'logic'
                    ? data.config?.operator || 'AND'
                    : type === 'action'
                        ? data.config?.actionType || 'Choose action'
                        : null;

    return (
        <div className={`custom-node custom-node-${type}`}>
            {showTarget && <Handle type="target" position={Position.Top} />}

            <div className="custom-node-heading">
                {Icon && <Icon size={16} />}
                <strong>{data.label}</strong>
            </div>
            {data.description && <span>{data.description}</span>}
            {configText && <small>{configText}</small>}

            {showSource && <Handle type="source" position={Position.Bottom} />}
        </div>
    );
}

export default CustomNode;