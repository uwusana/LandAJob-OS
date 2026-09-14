import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import {
  ArrowUpRight,
  Check,
  ChevronDown,
  CircleHelp,
  MoreHorizontal,
  Moon,
  Sun,
  Target,
  TrendingUp,
  X,
} from 'lucide-react';
import './design-system.css';

const scoreData = [42, 56, 51, 68, 74, 81, 86].map((score, index) => ({
  day: ['M', 'T', 'W', 'T', 'F', 'S', 'S'][index],
  score,
}));

function Button({ children, variant = 'primary', icon, ...props }) {
  return (
    <button className={`button button-${variant}`} {...props}>
      {icon}
      {children}
    </button>
  );
}

function Badge({ children, tone = 'green' }) {
  return <span className={`badge badge-${tone}`}>{children}</span>;
}

function Card({ children, className = '' }) {
  return <div className={`card ${className}`}>{children}</div>;
}

function SectionHeader({ eyebrow, title, action }) {
  return (
    <div className="section-header">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
      </div>
      {action}
    </div>
  );
}

function ProgressBar({ value, label }) {
  return (
    <div className="progress-wrap">
      <div className="progress-label">
        <span>{label}</span>
        <span className="mono">{value}%</span>
      </div>
      <div className="progress-track">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          className="progress-fill"
        />
      </div>
    </div>
  );
}

function ProgressRing({ value }) {
  return (
    <div className="ring">
      <svg viewBox="0 0 80 80">
        <circle className="ring-track" cx="40" cy="40" r="34" />
        <circle className="ring-value" cx="40" cy="40" r="34" />
      </svg>
      <strong className="mono">{value}%</strong>
    </div>
  );
}

function Modal({ onClose }) {
  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-heading">
          <div>
            <span className="eyebrow">Quick note</span>
            <h3 id="modal-title">Capture a thought</h3>
          </div>
          <button
            className="icon-button"
            aria-label="Close modal"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>
        <label className="field-label" htmlFor="note">
          Note
        </label>
        <textarea
          id="note"
          className="input textarea"
          placeholder="What did you learn today?"
        />
        <div className="modal-actions">
          <Button variant="quiet" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onClose}>Save note</Button>
        </div>
      </motion.div>
    </div>
  );
}

function AppShell({ children, theme, onThemeChange }) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">LJ</div>
          <div>
            <strong>Land a Job</strong>
            <span>OS / system 01</span>
          </div>
        </div>
        <nav className="nav-list">
          <span className="nav-label">Workspace</span>
          {['Today', 'Rotation', 'Progress', 'Tests', 'Projects'].map(
            (item, index) => (
              <button
                className={`nav-item ${index === 0 ? 'active' : ''}`}
                key={item}
              >
                <span className="nav-dot" />
                {item}
                {item === 'Tests' && <span className="nav-count">3</span>}
              </button>
            )
          )}
          <span className="nav-label nav-label-spaced">System</span>
          <button className="nav-item">
            <span className="nav-dot" />
            Analytics
          </button>
          <button className="nav-item">
            <span className="nav-dot" />
            Settings
          </button>
        </nav>
        <div className="sidebar-footer">
          <div className="avatar">AS</div>
          <div>
            <strong>Arjun Singh</strong>
            <span>Focused mode</span>
          </div>
          <MoreHorizontal size={18} />
        </div>
      </aside>
      <main className="main-content">
        <header className="topbar">
          <div>
            <span className="eyebrow">Saturday, 05 September 2026</span>
            <h1>Design system</h1>
          </div>
          <div className="topbar-actions">
            <button
              className="theme-toggle"
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
              onClick={() =>
                onThemeChange(theme === 'light' ? 'dark' : 'light')
              }
            >
              {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
              <span>{theme === 'light' ? 'Dark' : 'Light'}</span>
            </button>
            <div className="avatar avatar-small">AS</div>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}

function DesignSystem() {
  const [theme, setTheme] = useState(
    () => localStorage.getItem('land-a-job-theme') || 'light'
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [checked, setChecked] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('land-a-job-theme', theme);
  }, [theme]);

  return (
    <AppShell theme={theme} onThemeChange={setTheme}>
      <div className="content-grid">
        <section className="intro-panel">
          <div>
            <Badge>Design system / v0.1</Badge>
            <h2>A calm system for focused progress.</h2>
            <p>
              Foundations for the Land a Job OS: clear signals, useful rhythm,
              and enough quiet to think.
            </p>
          </div>
          <div className="intro-aside">
            <span className="mono">THEME</span>
            <strong>
              {theme === 'light' ? 'Light / garden' : 'Dark / forest'}
            </strong>
            <span className="muted">Persisted locally</span>
          </div>
        </section>
        <SectionHeader
          eyebrow="Foundations"
          title="Core components"
          action={
            <Button variant="outline" icon={<CircleHelp size={16} />}>
              Guidelines
            </Button>
          }
        />
        <div className="component-grid">
          <Card>
            <div className="card-heading">
              <div>
                <span className="eyebrow">Typography</span>
                <h3>Make progress legible</h3>
              </div>
              <Badge tone="soft">Zalando Sans</Badge>
            </div>
            <p className="type-display">The work is the way.</p>
            <p>
              Headings, navigation, body copy, and controls use a warm,
              editorial sans.{' '}
              <span className="mono">Numbers stay precise.</span>
            </p>
            <div className="type-meta">
              <span className="mono">JetBrains Mono</span>
              <span className="muted">Statistics / timestamps / metadata</span>
            </div>
          </Card>
          <Card>
            <div className="card-heading">
              <div>
                <span className="eyebrow">Buttons & status</span>
                <h3>Small actions, clear signal</h3>
              </div>
              <Badge>On track</Badge>
            </div>
            <div className="button-row">
              <Button>
                Complete block <ArrowUpRight size={15} />
              </Button>
              <Button variant="outline">View details</Button>
              <Button
                variant="quiet"
                icon={<MoreHorizontal size={17} />}
                aria-label="More options"
              />
            </div>
            <div className="badge-row">
              <Badge>Completed</Badge>
              <Badge tone="amber">In progress</Badge>
              <Badge tone="muted">Planned</Badge>
            </div>
          </Card>
          <Card>
            <div className="card-heading">
              <div>
                <span className="eyebrow">Progress</span>
                <h3>Momentum, at a glance</h3>
              </div>
              <ProgressRing value={72} />
            </div>
            <ProgressBar value={72} label="DSA foundations" />
            <ProgressBar value={48} label="React modules" />
            <div className="stat-row">
              <div>
                <span className="mono">17</span>
                <small>Days active</small>
              </div>
              <div>
                <span className="mono">04:32</span>
                <small>Study time</small>
              </div>
            </div>
          </Card>
          <Card>
            <div className="card-heading">
              <div>
                <span className="eyebrow">Form controls</span>
                <h3>Quietly capable</h3>
              </div>
              <button className="icon-button" aria-label="Open tooltip">
                <CircleHelp size={17} />
              </button>
            </div>
            <label className="field-label" htmlFor="subject">
              Subject
            </label>
            <div className="select-wrap">
              <select className="input" id="subject" defaultValue="dsa">
                <option value="dsa">Data Structures & Algorithms</option>
                <option value="react">React</option>
              </select>
              <ChevronDown size={16} />
            </div>
            <label className="check-row">
              <input
                type="checkbox"
                checked={checked}
                onChange={(event) => setChecked(event.target.checked)}
              />
              <span className="custom-check">
                {checked && <Check size={13} />}
              </span>
              <span>Include in today&apos;s plan</span>
            </label>
            <div className="toggle-row">
              <span>Focus mode</span>
              <button
                className={`toggle ${checked ? 'is-on' : ''}`}
                role="switch"
                aria-checked={checked}
                onClick={() => setChecked(!checked)}
              >
                <span />
              </button>
            </div>
          </Card>
        </div>
        <SectionHeader
          eyebrow="Data & feedback"
          title="Information surfaces"
          action={
            <Button variant="quiet" onClick={() => setModalOpen(true)}>
              Open modal
            </Button>
          }
        />
        <div className="surface-grid">
          <Card className="chart-card">
            <div className="card-heading">
              <div>
                <span className="eyebrow">Test performance</span>
                <h3>Consistency is compounding</h3>
              </div>
              <span className="trend">
                <TrendingUp size={15} /> +12.4%
              </span>
            </div>
            <div className="chart-value">
              <span className="mono">86</span>
              <span>/ 100 avg. score</span>
            </div>
            <div className="chart">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={scoreData}>
                  <defs>
                    <linearGradient id="scoreFill" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor="var(--primary)"
                        stopOpacity=".24"
                      />
                      <stop
                        offset="100%"
                        stopColor="var(--primary)"
                        stopOpacity="0"
                      />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'var(--text-muted)', fontSize: 11 }}
                  />
                  <Tooltip
                    contentStyle={{
                      background: 'var(--surface-raised)',
                      border: '1px solid var(--border)',
                      borderRadius: 3,
                      fontFamily: 'var(--mono)',
                      fontSize: 11,
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="var(--primary)"
                    fill="url(#scoreFill)"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
          <Card className="schedule-card">
            <div className="card-heading">
              <div>
                <span className="eyebrow">Today / 03 blocks</span>
                <h3>Daily rhythm</h3>
              </div>
              <Badge tone="soft">72% done</Badge>
            </div>
            {[
              ['09:00', 'Solve 2 DSA problems', true],
              ['11:30', 'React: state & effects', true],
              ['16:00', 'Ship portfolio polish', false],
            ].map(([time, label, done]) => (
              <div className="schedule-item" key={label}>
                <span className="mono schedule-time">{time}</span>
                <span className={`schedule-check ${done ? 'done' : ''}`}>
                  {done && <Check size={13} />}
                </span>
                <span className={done ? 'schedule-done' : ''}>{label}</span>
              </div>
            ))}
            <button className="text-button">
              View full planner <ArrowUpRight size={14} />
            </button>
          </Card>
          <Card className="notice-card">
            <div className="notice-icon">
              <Target size={18} />
            </div>
            <div>
              <span className="eyebrow">Empty state</span>
              <h3>One intentional next step</h3>
              <p>
                Your project shelf is ready for the first thing you want to
                ship.
              </p>
              <Button variant="outline">Add a project</Button>
            </div>
          </Card>
        </div>
        <div className="utility-row">
          <div className="toast">
            <div className="toast-icon">
              <Check size={15} />
            </div>
            <div>
              <strong>Saved to today</strong>
              <span className="muted">Your progress is up to date.</span>
            </div>
            <button className="icon-button" aria-label="Dismiss notification">
              <X size={15} />
            </button>
          </div>
          <div className="dropdown-wrap">
            <Button variant="outline" onClick={() => setMenuOpen(!menuOpen)}>
              More actions <ChevronDown size={15} />
            </Button>
            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="dropdown"
                >
                  <button>Duplicate block</button>
                  <button>Move to tomorrow</button>
                  <button>Delete activity</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      {modalOpen && <Modal onClose={() => setModalOpen(false)} />}
    </AppShell>
  );
}

export default DesignSystem;
