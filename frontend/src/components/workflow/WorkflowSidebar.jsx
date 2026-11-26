import {
    Play,
    Cpu,
    Gauge,
    GitBranch,
    Workflow,
    Zap,
    Square,
    GripVertical,
} from 'lucide-react';

import './WorkflowSidebar.css';

const workflowGroups = [
    {
        label: 'Flow',
        components: [
            {
                type: 'start',
                label: 'Start',
                description: 'Start your workflow',
                icon: Play,
                color: 'blue',
                config: {},
            },
            {
                type: 'end',
                label: 'End',
                description: 'Finish your workflow',
                icon: Square,
                color: 'green',
                config: {},
            },
        ],
    },
    {
        label: 'Data',
        components: [
            {
                type: 'device',
                label: 'Device Input',
                description: 'Choose a telemetry device',
                icon: Cpu,
                color: 'blue',
                config: { deviceId: '' },
            },
            {
                type: 'sensor',
                label: 'Sensor Data',
                description: 'Read a sensor measurement',
                icon: Gauge,
                color: 'teal',
                config: { field: 'temperature' },
            },
        ],
    },
    {
        label: 'Logic',
        components: [
            {
                type: 'condition',
                label: 'Condition',
                description: 'Compare a sensor value',
                icon: GitBranch,
                color: 'orange',
                config: { operator: '>', value: null },
            },
            {
                type: 'logic',
                label: 'Logic Operator',
                description: 'Combine conditions with AND / OR',
                icon: Workflow,
                color: 'purple',
                config: { operator: 'AND' },
            },
        ],
    },
    {
        label: 'Actions',
        components: [
            {
                type: 'action',
                label: 'Action',
                description: 'Trigger an automation action',
                icon: Zap,
                color: 'purple',
                config: { actionType: 'webhook' },
            },
        ],
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

            {workflowGroups.map((group) => (
                <section className="workflow-component-group" key={group.label}>
                    <h4 className="workflow-component-group-title">{group.label}</h4>
                    <div className="workflow-component-list">
                        {group.components.map((component) => {
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
                </section>
            ))}
        </aside>
    );
}

export default WorkflowSidebar;