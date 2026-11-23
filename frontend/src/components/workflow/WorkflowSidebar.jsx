import {
    Play,
    GitBranch,
    Zap,
    Square,
    GripVertical,
} from 'lucide-react';

import './WorkflowSidebar.css';

const workflowComponents = [
    {
        type: 'start',
        label: 'Start',
        description: 'Start your workflow',
        icon: Play,
        color: 'blue',
    },
    {
        type: 'condition',
        label: 'Condition',
        description: 'Check a condition',
        icon: GitBranch,
        color: 'orange',
    },
    {
        type: 'action',
        label: 'Action',
        description: 'Perform an action',
        icon: Zap,
        color: 'purple',
    },
    {
        type: 'end',
        label: 'End',
        description: 'Finish your workflow',
        icon: Square,
        color: 'green',
    },
];

function WorkflowSidebar() {
    const handleDragStart = (event, component) => {
        event.dataTransfer.setData(
            'application/reactflow',
            JSON.stringify(component)
        );

        event.dataTransfer.effectAllowed = 'move';
    };

    return (
        <aside className="workflow-sidebar">
            <div className="workflow-sidebar-heading">
                <h3>Components</h3>
                <p>Drag components onto the canvas</p>
            </div>

            <div className="workflow-component-list">
                {workflowComponents.map((component) => {
                    const Icon = component.icon;

                    return (
                        <div
                            key={component.type}
                            className="workflow-component"
                            draggable
                            onDragStart={(event) =>
                                handleDragStart(event, component)
                            }
                        >
                            <div className={`workflow-component-icon ${component.color}`}>
                                <Icon size={19} />
                            </div>

                            <div className="workflow-component-info">
                                <h4>{component.label}</h4>
                                <p>{component.description}</p>
                            </div>

                            <GripVertical
                                size={18}
                                className="workflow-drag-icon"
                            />
                        </div>
                    );
                })}
            </div>
        </aside>
    );
}

export default WorkflowSidebar;