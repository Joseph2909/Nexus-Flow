import WorkflowCanvas from '../components/workflow/WorkflowCanvas';
import WorkflowSidebar from '../components/workflow/WorkflowSidebar';

import './RuleBuilder.css';

function RuleBuilder() {
    return (
        <div className="rule-builder-page">
            <div className="rule-builder-header">
                <div>
                    <h1>Visual Rule Builder</h1>
                    <p>Create and manage your automation workflows.</p>
                </div>

                <button className="save-workflow-btn">
                    Save Workflow
                </button>
            </div>

            <div className="workflow-editor-layout">
                <WorkflowSidebar />

                <div className="workflow-editor-canvas">
                    <WorkflowCanvas />
                </div>
            </div>
        </div>
    );
}

export default RuleBuilder;