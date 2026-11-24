
import { Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import RuleBuilder from './pages/RuleBuilder';
import Analytics from './pages/Analytics';
import WorkspaceLayout from './layouts/WorkspaceLayout';

function App() {
    return (
        <Routes>

            {/* Default Route */}
            <Route
                path="/"
                element={<Navigate to="/login" replace />}
            />

            {/* Authentication Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route element={<WorkspaceLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/rule-builder" element={<RuleBuilder />} />
                <Route path="/analytics" element={<Analytics />} />
            </Route>

            {/* Unknown Routes */}
            <Route
                path="*"
                element={<Navigate to="/login" replace />}
            />

        </Routes>
    );
}

export default App;
