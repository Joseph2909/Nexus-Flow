import { useCallback, useState } from 'react';
import WorkflowCanvas from '../components/workflow/WorkflowCanvas';
import WorkflowSidebar from '../components/workflow/WorkflowSidebar';

import './RuleBuilder.css';

function RuleBuilder() {
    const [workflow, setWorkflow] = useState({ nodes: [], edges: [] });
    const [saveMessage, setSaveMessage] = useState('');

    const handleWorkflowChange = useCallback((nextWorkflow) => {
        setWorkflow(nextWorkflow);
    }, []);

    const handleSave = () => {
        localStorage.setItem('nexusflow-workflow', JSON.stringify(workflow));
        setSaveMessage('Workflow saved locally.');
    };

    return (
        <div className="rule-builder-page">
            <div className="rule-builder-header">
                <div>
                    <h1>Visual Rule Builder</h1>
                    <p>Create and manage your automation workflows.</p>
                </div>

                <button className="save-workflow-btn" onClick={handleSave}>
                    Save Workflow
                </button>
            </div>

            <div className="workflow-editor-layout">
                <WorkflowSidebar />

                <div className="workflow-editor-canvas">
                    <WorkflowCanvas onWorkflowChange={handleWorkflowChange} />
                </div>
            </div>

            {saveMessage && (
                <p className="workflow-save-message" role="status">
                    {saveMessage}
                </p>
            )}
        </div>
    );
}

export default RuleBuilder;