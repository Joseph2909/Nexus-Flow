

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import {
    Network,
    LayoutDashboard,
    Workflow,
    Cpu,
    ChartNoAxesColumn,
    Bell,
    Settings,
    Menu,
    Search,
    ChevronDown,
    LogOut,
    UserRound,
    CircleUserRound,
    CheckCheck,
    FolderKanban,
    Monitor,
    GitBranch,
    Activity,
    ArrowUpRight,
    BarChart3,
    Clock3,
    CheckCircle2,
    AlertTriangle,
    Server,
    Wifi,
    Database,
    X
} from 'lucide-react';

import './Dashboard.css';


function Dashboard() {
    const summaryCards = [
        {
            title: 'Total Projects',
            value: '24',
            description: 'Across your workspace',
            change: '+12%',
            icon: FolderKanban,
            color: 'blue',
        },
        {
            title: 'Connected Devices',
            value: '156',
            description: 'Devices registered',
            change: '+8%',
            icon: Monitor,
            color: 'purple',
        },
        {
            title: 'Active Rules',
            value: '18',
            description: 'Automation rules running',
            change: 'Active',
            icon: GitBranch,
            color: 'orange',
        },
        {
            title: 'System Uptime',
            value: '99.9%',
            description: 'Overall system availability',
            change: 'Healthy',
            icon: Activity,
            color: 'green',
        },
    ];
    const deviceActivity = [
        { day: 'Mon', value: 45 },
        { day: 'Tue', value: 65 },
        { day: 'Wed', value: 52 },
        { day: 'Thu', value: 82 },
        { day: 'Fri', value: 70 },
        { day: 'Sat', value: 92 },
        { day: 'Sun', value: 76 },
    ];

    const recentActivities = [
        {
            id: 1,
            title: 'New device connected',
            description: 'Temperature Sensor #104 connected',
            time: '2 minutes ago',
            type: 'success',
        },
        {
            id: 2,
            title: 'Automation rule executed',
            description: 'Temperature monitoring rule completed',
            time: '15 minutes ago',
            type: 'info',
        },
        {
            id: 3,
            title: 'Device alert detected',
            description: 'Humidity Sensor #208 needs attention',
            time: '35 minutes ago',
            type: 'warning',
        },
        {
            id: 4,
            title: 'System backup completed',
            description: 'Your workspace backup was successful',
            time: '1 hour ago',
            type: 'success',
        },
    ];

    const systemStatuses = [
        { name: 'API Server', status: 'Operational', icon: Server },
        { name: 'Database', status: 'Operational', icon: Database },
        { name: 'Device Network', status: 'Operational', icon: Wifi },
    ];
    const [activeMenu, setActiveMenu] = useState('Dashboard');
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const menuItems = [
        { name: 'Dashboard', icon: LayoutDashboard },
        { name: 'Rule Builder', icon: Workflow },
        { name: 'Devices', icon: Cpu },
        { name: 'Analytics', icon: ChartNoAxesColumn },
        { name: 'Settings', icon: Settings }
    ];

    const navigate = useNavigate();

    const [searchQuery, setSearchQuery] = useState('');
    const [notificationOpen, setNotificationOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    const [notifications, setNotifications] = useState([
        {
            id: 1,
            title: 'Welcome to NexusFlow',
            message: 'Your workspace is ready to explore.',
            time: 'Just now',
            unread: true
        },
        {
            id: 2,
            title: 'System Status',
            message: 'All systems are currently operational.',
            time: '5 minutes ago',
            unread: true
        },
        {
            id: 3,
            title: 'Account Update',
            message: 'Your profile is ready to configure.',
            time: '1 hour ago',
            unread: false
        }
    ]);

    const headerRef = useRef(null);

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (
                headerRef.current &&
                !headerRef.current.contains(event.target)
            ) {
                setNotificationOpen(false);
                setProfileOpen(false);
            }
        };

        document.addEventListener('mousedown', handleOutsideClick);

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, []);

    const unreadCount = notifications.filter(
        notification => notification.unread
    ).length;

    const markAllRead = () => {
        setNotifications(prev =>
            prev.map(notification => ({
                ...notification,
                unread: false
            }))
        );
    };

    const handleLogout = () => {
        navigate('/login');
    };


    return (
        <div className="dashboard-container">

            {/* Sidebar */}
            <aside className={`dashboard-sidebar ${sidebarOpen ? 'sidebar-open' : ''}`}>

                <div className="sidebar-brand">
                    <Network size={30} />
                    <span>NexusFlow</span>
                </div>

                <div className="sidebar-menu">

                    <p className="sidebar-label">WORKSPACE</p>

                    {menuItems.map((item) => {
                        const Icon = item.icon;

                        return (
                            <button
                                key={item.name}
                                className={`sidebar-menu-item ${activeMenu === item.name ? 'active' : ''
                                    }`}
                                onClick={() => {
                                    setActiveMenu(item.name);
                                    setSidebarOpen(false);
                                }}
                            >
                                <Icon size={19} />
                                <span>{item.name}</span>
                            </button>
                        );
                    })}

                </div>

                <div className="sidebar-bottom">
                    <button className="sidebar-logout">
                        <LogOut size={18} />
                        <span>Logout</span>
                    </button>
                </div>

            </aside>

            {/* Main Workspace */}
            <main className="dashboard-main">

                {/* Header */}

                <header className="dashboard-header" ref={headerRef}>

                    {/* Header Left */}
                    <div className="header-left">

                        <button
                            className="mobile-menu-button"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            aria-label="Toggle sidebar"
                        >
                            <Menu size={22} />
                        </button>

                        <div>
                            <h2>{activeMenu}</h2>
                            <p>Welcome back to NexusFlow</p>
                        </div>

                    </div>

                    {/* Header Right */}
                    <div className="header-right">

                        {/* Search */}
                        <div className="header-search">
                            <Search size={17} />

                            <input
                                type="search"
                                placeholder="Search anything..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                aria-label="Search dashboard"
                            />

                            {searchQuery && (
                                <button
                                    type="button"
                                    className="search-clear"
                                    onClick={() => setSearchQuery('')}
                                    aria-label="Clear search"
                                >
                                    <X size={15} />
                                </button>
                            )}
                        </div>

                        {/* Notifications */}
                        <div className="header-dropdown-wrapper">

                            <button
                                className={`notification-button ${notificationOpen ? 'dropdown-active' : ''
                                    }`}
                                onClick={() => {
                                    setNotificationOpen(!notificationOpen);
                                    setProfileOpen(false);
                                }}
                                aria-label="Notifications"
                                aria-expanded={notificationOpen}
                            >
                                <Bell size={20} />

                                {unreadCount > 0 && (
                                    <span className="notification-count">
                                        {unreadCount}
                                    </span>
                                )}
                            </button>

                            {notificationOpen && (
                                <div className="notification-dropdown">

                                    <div className="dropdown-heading">
                                        <div>
                                            <h3>Notifications</h3>
                                            <p>{unreadCount} unread messages</p>
                                        </div>

                                        <button
                                            onClick={markAllRead}
                                            className="mark-read-button"
                                        >
                                            <CheckCheck size={15} />
                                            Mark all read
                                        </button>
                                    </div>

                                    <div className="notification-list">

                                        {notifications.length > 0 ? (
                                            notifications.map(notification => (
                                                <div
                                                    key={notification.id}
                                                    className={`notification-item ${notification.unread ? 'unread' : ''
                                                        }`}
                                                >
                                                    <div className="notification-icon">
                                                        <Bell size={16} />
                                                    </div>

                                                    <div className="notification-details">
                                                        <h4>{notification.title}</h4>
                                                        <p>{notification.message}</p>
                                                        <span>{notification.time}</span>
                                                    </div>

                                                    {notification.unread && (
                                                        <span className="unread-dot"></span>
                                                    )}
                                                </div>
                                            ))
                                        ) : (
                                            <p className="empty-notifications">
                                                No notifications available.
                                            </p>
                                        )}

                                    </div>

                                </div>
                            )}

                        </div>

                        {/* User Profile */}
                        <div className="header-dropdown-wrapper">

                            <button
                                className="header-profile"
                                onClick={() => {
                                    setProfileOpen(!profileOpen);
                                    setNotificationOpen(false);
                                }}
                                aria-expanded={profileOpen}
                            >

                                <div className="profile-avatar">
                                    S
                                </div>

                                <div className="profile-info">
                                    <h4>Sathish</h4>
                                    <p>Administrator</p>
                                </div>

                                <ChevronDown
                                    size={16}
                                    className={profileOpen ? 'chevron-rotate' : ''}
                                />

                            </button>

                            {profileOpen && (
                                <div className="profile-dropdown">

                                    <div className="profile-dropdown-header">
                                        <div className="profile-avatar large">
                                            S
                                        </div>

                                        <div>
                                            <h4>Sathish</h4>
                                            <p>Administrator</p>
                                        </div>
                                    </div>

                                    <div className="profile-dropdown-divider"></div>

                                    <button
                                        className="profile-dropdown-item"
                                        onClick={() => setProfileOpen(false)}
                                    >
                                        <UserRound size={17} />
                                        My Profile
                                    </button>

                                    <button
                                        className="profile-dropdown-item"
                                        onClick={() => setProfileOpen(false)}
                                    >
                                        <Settings size={17} />
                                        Account Settings
                                    </button>

                                    <div className="profile-dropdown-divider"></div>

                                    <button
                                        className="profile-dropdown-item logout-item"
                                        onClick={handleLogout}
                                    >
                                        <LogOut size={17} />
                                        Sign Out
                                    </button>

                                </div>
                            )}

                        </div>

                    </div>

                </header>

                {/* Dashboard Content */}
                <section className="dashboard-content">

                    <div className="dashboard-welcome">
                        <div>
                            <h1>Dashboard Overview</h1>
                            <p>
                                Monitor your devices, telemetry and automation
                                from one place.
                            </p>
                        </div>

                        <div className="system-status">
                            <span className="status-indicator"></span>
                            All Systems Operational
                        </div>
                    </div>

                    <section className="summary-section">
                        <div className="summary-grid">
                            {summaryCards.map((card, index) => {
                                const Icon = card.icon;

                                return (
                                    <div className="summary-card" key={index}>
                                        <div className="summary-card-top">
                                            <div className={`summary-icon ${card.color}`}>
                                                <Icon size={22} />
                                            </div>

                                            <span className={`summary-change ${card.color}`}>
                                                {card.change}
                                            </span>
                                        </div>

                                        <div className="summary-card-content">
                                            <h2>{card.value}</h2>
                                            <h3>{card.title}</h3>
                                            <p>{card.description}</p>
                                        </div>

                                        <div className="summary-card-footer">
                                            <span>View details</span>
                                            <ArrowUpRight size={16} />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    <section className="dashboard-overview-grid">

                        {/* Device Activity */}
                        <div className="overview-panel activity-panel">
                            <div className="panel-heading">
                                <div>
                                    <h3>Device Activity</h3>
                                    <p>Weekly device activity overview</p>
                                </div>

                                <div className="panel-icon">
                                    <BarChart3 size={20} />
                                </div>
                            </div>

                            <div className="activity-summary">
                                <div>
                                    <h2>1,284</h2>
                                    <span>Total activity this week</span>
                                </div>

                                <span className="activity-growth">
                                    <ArrowUpRight size={15} />
                                    12.5%
                                </span>
                            </div>

                            <div className="activity-chart">
                                {deviceActivity.map((item) => (
                                    <div className="chart-column" key={item.day}>
                                        <div className="chart-bar-wrapper">
                                            <div
                                                className="chart-bar"
                                                style={{ height: `${item.value}%` }}
                                                title={`${item.value}%`}
                                            />
                                        </div>

                                        <span>{item.day}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="overview-panel recent-panel">
                            <div className="panel-heading">
                                <div>
                                    <h3>Recent Activity</h3>
                                    <p>Latest workspace updates</p>
                                </div>

                                <Clock3 size={20} className="heading-icon" />
                            </div>

                            <div className="recent-activity-list">
                                {recentActivities.map((activity) => (
                                    <div className="activity-item" key={activity.id}>
                                        <div className={`activity-indicator ${activity.type}`}>
                                            {activity.type === 'success' && <CheckCircle2 size={17} />}
                                            {activity.type === 'info' && <Activity size={17} />}
                                            {activity.type === 'warning' && <AlertTriangle size={17} />}
                                        </div>

                                        <div className="activity-details">
                                            <h4>{activity.title}</h4>
                                            <p>{activity.description}</p>
                                            <span>{activity.time}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* System Status */}
                        <div className="overview-panel system-panel">
                            <div className="panel-heading">
                                <div>
                                    <h3>System Status</h3>
                                    <p>Live infrastructure overview</p>
                                </div>

                                <span className="system-live">
                                    <span /> Live
                                </span>
                            </div>

                            <div className="system-status-list">
                                {systemStatuses.map((item) => {
                                    const Icon = item.icon;

                                    return (
                                        <div className="system-status-item" key={item.name}>
                                            <div className="system-service">
                                                <Icon size={19} />
                                                <span>{item.name}</span>
                                            </div>

                                            <div className="operational-status">
                                                <span />
                                                {item.status}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="system-footer">
                                <div>
                                    <span>Overall health</span>
                                    <h2>Excellent</h2>
                                </div>

                                <div className="health-score">99.9%</div>
                            </div>
                        </div>

                    </section>

                </section>

            </main>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="sidebar-overlay"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

        </div>
    );
}

export default Dashboard;
