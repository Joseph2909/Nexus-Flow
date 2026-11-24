import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
    Activity,
    ChartNoAxesColumn,
    Cpu,
    LayoutDashboard,
    LogOut,
    Menu,
    Network,
    Settings,
    Workflow,
    X,
} from 'lucide-react';

import './WorkspaceLayout.css';

const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { name: 'Rule Builder', icon: Workflow, path: '/rule-builder' },
    { name: 'Devices', icon: Cpu },
    { name: 'Analytics', icon: ChartNoAxesColumn, path: '/analytics' },
    { name: 'Settings', icon: Settings },
];

function WorkspaceLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const navigate = useNavigate();

    return (
        <div className="workspace-layout">
            <aside className={`workspace-sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>
                <div className="workspace-sidebar-brand">
                    <Network size={34} />
                    <span>NexusFlow</span>
                </div>

                <nav aria-label="Workspace navigation">
                    <p className="workspace-sidebar-label">WORKSPACE</p>
                    <div className="workspace-sidebar-menu">
                        {menuItems.map((item) => {
                            const Icon = item.icon;

                            return item.path ? (
                                <NavLink
                                    key={item.name}
                                    to={item.path}
                                    end
                                    className={({ isActive }) =>
                                        `workspace-nav-item${isActive ? ' active' : ''}`
                                    }
                                    onClick={() => setSidebarOpen(false)}
                                >
                                    <Icon size={20} />
                                    <span>{item.name}</span>
                                </NavLink>
                            ) : (
                                <button
                                    key={item.name}
                                    type="button"
                                    className="workspace-nav-item"
                                    disabled
                                    title={`${item.name} page is not available yet`}
                                >
                                    <Icon size={20} />
                                    <span>{item.name}</span>
                                </button>
                            );
                        })}
                    </div>
                </nav>

                <div className="workspace-sidebar-bottom">
                    <button
                        type="button"
                        className="workspace-nav-item workspace-logout"
                        onClick={() => navigate('/login')}
                    >
                        <LogOut size={19} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            {sidebarOpen && (
                <button
                    type="button"
                    className="workspace-sidebar-overlay"
                    aria-label="Close navigation"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <div className="workspace-content">
                <div className="workspace-mobile-bar">
                    <button
                        type="button"
                        className="workspace-mobile-menu"
                        onClick={() => setSidebarOpen((open) => !open)}
                        aria-label={sidebarOpen ? 'Close navigation' : 'Open navigation'}
                        aria-expanded={sidebarOpen}
                    >
                        {sidebarOpen ? <X size={21} /> : <Menu size={21} />}
                    </button>
                    <span><Activity size={17} /> NexusFlow</span>
                </div>
                <Outlet />
            </div>
        </div>
    );
}

export default WorkspaceLayout;
