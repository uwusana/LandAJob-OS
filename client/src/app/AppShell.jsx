import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BarChart3,
  BookOpen,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  FolderKanban,
  LayoutDashboard,
  Menu,
  Moon,
  MoreHorizontal,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  Sun,
  Target,
  X,
} from 'lucide-react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';
import '../design-system/design-system.css';

const navigation = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Today', path: '/today', icon: CalendarDays },
  { label: 'Weekly Plan', path: '/weekly-plan', icon: ClipboardCheck },
  { label: 'Learning', path: '/learning', icon: BookOpen },
  { label: 'DSA', path: '/dsa', icon: Target },
  { label: 'Tests', path: '/tests', icon: ClipboardCheck, count: 3 },
  { label: 'Projects', path: '/projects', icon: FolderKanban },
  { label: 'Analytics', path: '/analytics', icon: BarChart3 },
  { label: 'Settings', path: '/settings', icon: Settings },
];

const routeNames = Object.fromEntries(
  navigation.map(({ label, path }) => [path, label])
);

function EmptyState({ title, description, icon: Icon }) {
  return (
    <section className="page-empty-state">
      <div className="empty-state-icon">
        <Icon size={21} strokeWidth={1.7} />
      </div>
      <span className="eyebrow">Module ready</span>
      <h2>{title}</h2>
      <p>{description}</p>
      <span className="empty-state-note mono">
        FEATURE MODULE / COMING NEXT
      </span>
    </section>
  );
}

function ShellPage() {
  const location = useLocation();
  const pageName = routeNames[location.pathname] || 'Dashboard';
  const pageConfig =
    navigation.find(({ path }) => path === location.pathname) || navigation[0];

  return (
    <div className="page-content">
      <div className="breadcrumb" aria-label="Breadcrumb">
        <NavLink to="/dashboard">Workspace</NavLink>
        <ChevronRight size={13} />
        <span>{pageName}</span>
      </div>
      <div className="page-heading">
        <div>
          <span className="eyebrow">Personal operating system</span>
          <h2>{pageName}</h2>
        </div>
        <span className="page-index mono">
          {String(
            navigation.findIndex(({ path }) => path === location.pathname) + 1
          ).padStart(2, '0')}{' '}
          / 09
        </span>
      </div>
      <EmptyState
        icon={pageConfig.icon}
        title={`${pageName} is ready for your workflow.`}
        description={`The ${pageName.toLowerCase()} workspace will appear here once its feature module is connected.`}
      />
    </div>
  );
}

function Sidebar({
  collapsed,
  onCollapse,
  mobileOpen,
  onClose,
  user,
  onLogout,
}) {
  return (
    <>
      <AnimatePresence>
        {mobileOpen && (
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="drawer-backdrop"
            aria-label="Close navigation"
            onClick={onClose}
          />
        )}
      </AnimatePresence>
      <aside
        className={`sidebar ${collapsed ? 'is-collapsed' : ''} ${mobileOpen ? 'is-mobile-open' : ''}`}
      >
        <div className="brand">
          <div className="brand-mark">LJ</div>
          {!collapsed && (
            <div>
              <strong>Land a Job</strong>
              <span>OS / system 01</span>
            </div>
          )}
          <button
            className="mobile-close icon-button"
            aria-label="Close navigation"
            onClick={onClose}
          >
            <X size={17} />
          </button>
        </div>
        <nav className="nav-list" aria-label="Primary navigation">
          <span className="nav-label">Workspace</span>
          {navigation.slice(0, 7).map(({ label, path, icon: Icon, count }) => (
            <NavLink
              className="nav-item"
              to={path}
              key={path}
              onClick={onClose}
              title={collapsed ? label : undefined}
            >
              <Icon className="nav-icon" size={16} strokeWidth={1.8} />
              {!collapsed && <span>{label}</span>}
              {!collapsed && count && (
                <span className="nav-count">{count}</span>
              )}
            </NavLink>
          ))}
          <span className="nav-label nav-label-spaced">System</span>
          {navigation.slice(7).map(({ label, path, icon: Icon }) => (
            <NavLink
              className="nav-item"
              to={path}
              key={path}
              onClick={onClose}
              title={collapsed ? label : undefined}
            >
              <Icon className="nav-icon" size={16} strokeWidth={1.8} />
              {!collapsed && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-footer">
          <div className="avatar">AS</div>
          {!collapsed && (
            <div>
              <strong>{user.name}</strong>
              <span>{user.email}</span>
            </div>
          )}
          {!collapsed && (
            <button
              className="icon-button footer-menu"
              aria-label="Sign out"
              onClick={onLogout}
            >
              <MoreHorizontal size={17} />
            </button>
          )}
        </div>
        <button
          className="collapse-button"
          onClick={onCollapse}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? (
            <PanelLeftOpen size={16} />
          ) : (
            <PanelLeftClose size={16} />
          )}
          {!collapsed && <span>Collapse</span>}
        </button>
      </aside>
    </>
  );
}

function AppShell() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem('land-a-job-theme') || 'light'
  );
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const location = useLocation();
  const pageName = routeNames[location.pathname] || 'Dashboard';
  const today = new Intl.DateTimeFormat('en-GB', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(new Date());

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('land-a-job-theme', theme);
  }, [theme]);

  return (
    <div className={`app-shell ${collapsed ? 'sidebar-collapsed' : ''}`}>
      <Sidebar
        collapsed={collapsed}
        onCollapse={() => setCollapsed(!collapsed)}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        user={user}
        onLogout={logout}
      />
      <main className="main-content">
        <header className="topbar">
          <div className="mobile-topbar-row">
            <button
              className="mobile-menu icon-button"
              aria-label="Open navigation"
              onClick={() => setMobileOpen(true)}
            >
              <Menu size={19} />
            </button>
            <div className="mobile-brand-mark">LJ</div>
          </div>
          <div className="topbar-copy">
            <span className="eyebrow">{today}</span>
            <h1>{pageName}</h1>
          </div>
          <div className="topbar-actions">
            <button
              className="notification-button icon-button"
              aria-label="Notifications"
            >
              <span className="notification-dot" />
              <ClipboardCheck size={17} />
            </button>
            <button
              className="theme-toggle"
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            >
              {theme === 'light' ? <Moon size={15} /> : <Sun size={15} />}
              <span>{theme === 'light' ? 'Dark' : 'Light'}</span>
            </button>
            <button
              className="profile-button"
              onClick={() => navigate('/settings')}
            >
              <span className="avatar avatar-small">
                {user.name.slice(0, 2).toUpperCase()}
              </span>
              <span className="profile-copy">
                <strong>{user.name}</strong>
                <small>{user.email}</small>
              </span>
              <ChevronLeft className="profile-chevron" size={14} />
            </button>
          </div>
        </header>
        <Outlet />
      </main>
    </div>
  );
}

export { AppShell, ShellPage };
