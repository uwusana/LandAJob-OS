import { useMemo, useState } from 'react';
import {
  ArrowUpRight,
  BookOpen,
  ClipboardCheck,
  Check,
  Clock3,
  Code2,
  Dumbbell,
  FolderKanban,
  Plus,
  Rocket,
  Target,
  Timer,
} from 'lucide-react';
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { NavLink } from 'react-router-dom';

const schedule = [
  { id: 1, time: '07:30', duration: '30m', activity: 'Morning run and reset', category: 'Exercise', complete: true, icon: Dumbbell },
  { id: 2, time: '09:00', duration: '90m', activity: 'Solve 2 array problems', category: 'DSA', complete: true, icon: Code2 },
  { id: 3, time: '11:00', duration: '60m', activity: 'React state and effects', category: 'React', complete: false, icon: BookOpen },
  { id: 4, time: '13:00', duration: '45m', activity: 'Lunch and screen break', category: 'Meal', complete: false, icon: Clock3 },
  { id: 5, time: '15:00', duration: '90m', activity: 'Portfolio project polish', category: 'Projects', complete: false, icon: FolderKanban },
];

const learningTracks = [
  { name: 'Striver DSA', completed: 87, total: 191, tone: 'primary' },
  { name: 'Abdul Bari', completed: 18, total: 34, tone: 'secondary' },
  { name: 'JavaScript', completed: 24, total: 40, tone: 'tertiary' },
  { name: 'React', completed: 14, total: 28, tone: 'primary' },
  { name: 'Java Full Stack', completed: 9, total: 32, tone: 'secondary' },
];

const testTrend = [
  { day: 'M', score: 68 },
  { day: 'T', score: 74 },
  { day: 'W', score: 71 },
  { day: 'T', score: 82 },
  { day: 'F', score: 78 },
  { day: 'S', score: 86 },
];

const categoryClass = {
  DSA: 'category-dsa',
  React: 'category-react',
  Projects: 'category-projects',
  Exercise: 'category-exercise',
  Meal: 'category-meal',
};

function SectionHeading({ eyebrow, title, action }) {
  return (
    <div className="dashboard-section-heading">
      <div><span className="eyebrow">{eyebrow}</span><h2>{title}</h2></div>
      {action}
    </div>
  );
}

function Metric({ label, value, detail }) {
  return <div className="dashboard-metric"><span className="eyebrow">{label}</span><strong className="mono">{value}</strong><small>{detail}</small></div>;
}

function ScheduleTimeline({ items, onToggle }) {
  return (
    <div className="schedule-timeline">
      {items.map(({ id, time, duration, activity, category, complete, icon: Icon }) => (
        <div className={`dashboard-schedule-item ${complete ? 'is-complete' : ''}`} key={id}>
          <span className="mono dashboard-time">{time}</span>
          <div className={`schedule-node ${complete ? 'is-complete' : ''}`}>{complete && <Check size={12} />}</div>
          <div className="schedule-activity"><div><strong>{activity}</strong><span className="schedule-meta"><span className="mono">{duration}</span><span className={`category-mark ${categoryClass[category] || ''}`}><Icon size={12} />{category}</span></span></div><button className="schedule-toggle" onClick={() => onToggle(id)} aria-label={`${complete ? 'Mark' : 'Complete'} ${activity}`}>{complete ? <Check size={14} /> : <span />}</button></div>
        </div>
      ))}
    </div>
  );
}

function LearningCard({ name, completed, total, tone }) {
  const percentage = Math.round((completed / total) * 100);
  return <article className="learning-card"><div className="learning-card-heading"><strong>{name}</strong><span className={`track-dot ${tone}`} /></div><div className="learning-numbers"><span className="mono">{completed}</span><span className="muted">/ {total} completed</span><span className="mono learning-percent">{percentage}%</span></div><div className="learning-track"><div className={`learning-fill ${tone}`} style={{ width: `${percentage}%` }} /></div></article>;
}

function ActionButton({ icon: Icon, label, onClick }) {
  return <button className="quick-action" onClick={onClick}><span className="quick-action-icon"><Icon size={16} /></span><span>{label}</span><ArrowUpRight size={14} /></button>;
}

function Dashboard() {
  const [scheduleItems, setScheduleItems] = useState(schedule);
  const [actionMessage, setActionMessage] = useState('');
  const completedCount = scheduleItems.filter((item) => item.complete).length;
  const completionPercentage = Math.round((completedCount / scheduleItems.length) * 100);
  const activeBlock = scheduleItems.find((item) => !item.complete) || scheduleItems[scheduleItems.length - 1];
  const activeIndex = scheduleItems.findIndex((item) => item.id === activeBlock.id);
  const activeProgress = activeIndex < 0 ? 100 : Math.round((activeIndex / scheduleItems.length) * 100);
  const formattedDate = useMemo(() => new Intl.DateTimeFormat('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date()), []);

  const toggleScheduleItem = (id) => {
    setScheduleItems((current) => current.map((item) => item.id === id ? { ...item, complete: !item.complete } : item));
  };

  const showActionMessage = (label) => {
    setActionMessage(`${label} will be available when this module is connected.`);
    window.setTimeout(() => setActionMessage(''), 2800);
  };

  return (
    <div className="dashboard-page">
      <div className="breadcrumb" aria-label="Breadcrumb"><NavLink to="/dashboard">Workspace</NavLink><span>/</span><span>Dashboard</span></div>
      <section className="dashboard-welcome"><div><span className="eyebrow">Today / personal operating system</span><h2>Good morning, Arjun.</h2><p>Here is the shape of your day and the progress behind it.</p></div><div className="dashboard-date"><span className="mono">{formattedDate.toUpperCase()}</span><span className="muted">Temporary local snapshot</span></div></section>

      <section className="dashboard-overview" aria-label="Today's overview">
        <Metric label="Wake-up target" value="07:00" detail="On schedule" />
        <Metric label="Sleep target" value="23:00" detail="8h planned" />
        <Metric label="Today complete" value={`${completionPercentage}%`} detail={`${completedCount} of ${scheduleItems.length} tasks`} />
        <Metric label="Remaining" value={String(scheduleItems.length - completedCount).padStart(2, '0')} detail="Blocks left" />
      </section>

      <div className="dashboard-main-grid">
        <section className="dashboard-panel schedule-panel"><SectionHeading eyebrow="Today / timeline" title="Today's schedule" action={<span className="mono panel-meta">{completedCount}/{scheduleItems.length} done</span>} /><ScheduleTimeline items={scheduleItems} onToggle={toggleScheduleItem} /></section>
        <section className="dashboard-panel focus-panel"><SectionHeading eyebrow="Current focus" title="Stay with the block" /><div className="focus-subject"><span className="focus-icon"><Code2 size={20} /></span><div><span className="eyebrow">{activeBlock.category}</span><h3>{activeBlock.activity}</h3></div></div><div className="focus-stats"><div><span className="eyebrow">Duration</span><strong className="mono">{activeBlock.duration}</strong></div><div><span className="eyebrow">Progress</span><strong className="mono">{activeProgress}%</strong></div></div><div className="focus-progress"><div style={{ width: `${activeProgress}%` }} /></div><button className="focus-button" onClick={() => toggleScheduleItem(activeBlock.id)}>{activeBlock.complete ? 'Review block' : 'Mark block complete'} <Check size={15} /></button></section>
      </div>

      <section><SectionHeading eyebrow="Learning progress" title="The long game" action={<NavLink className="dashboard-text-link" to="/learning">View learning <ArrowUpRight size={14} /></NavLink>} /><div className="learning-grid">{learningTracks.map((track) => <LearningCard key={track.name} {...track} />)}</div></section>

      <div className="dashboard-secondary-grid"><section className="dashboard-panel test-panel"><SectionHeading eyebrow="Test performance" title="Keep the signal moving" action={<NavLink className="dashboard-text-link" to="/tests">Test center <ArrowUpRight size={14} /></NavLink>} /><div className="test-summary"><div><span className="eyebrow">Latest</span><strong className="mono">86<span>/100</span></strong><small>JavaScript · today</small></div><div><span className="eyebrow">Average</span><strong className="mono">78</strong><small>6 tests recorded</small></div><div><span className="eyebrow">Highest</span><strong className="mono">91</strong><small>React · Aug 28</small></div></div><div className="test-chart"><ResponsiveContainer width="100%" height="100%"><AreaChart data={testTrend}><defs><linearGradient id="dashboardTestFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--primary)" stopOpacity=".24" /><stop offset="100%" stopColor="var(--primary)" stopOpacity="0" /></linearGradient></defs><XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: 'var(--text-muted)', fontSize: 10 }} /><YAxis hide domain={[50, 100]} /><Tooltip contentStyle={{ background: 'var(--surface-raised)', border: '1px solid var(--border)', borderRadius: 3, fontFamily: 'var(--mono)', fontSize: 10 }} /><Area type="monotone" dataKey="score" stroke="var(--primary)" fill="url(#dashboardTestFill)" strokeWidth={2} /></AreaChart></ResponsiveContainer></div></section><section className="dashboard-panel pipeline-panel"><SectionHeading eyebrow="Project pipeline" title="Things worth shipping" action={<NavLink className="dashboard-text-link" to="/projects">Projects <ArrowUpRight size={14} /></NavLink>} /><div className="pipeline-list"><div><span className="pipeline-icon planned"><Target size={15} /></span><span>Planned</span><strong className="mono">03</strong></div><div><span className="pipeline-icon progress"><Timer size={15} /></span><span>In progress</span><strong className="mono">01</strong></div><div><span className="pipeline-icon shipped"><Rocket size={15} /></span><span>Shipped</span><strong className="mono">02</strong></div></div></section></div>

      <div className="dashboard-tertiary-grid"><section className="dashboard-panel goals-panel"><SectionHeading eyebrow="This week" title="Weekly goals" /><div className="goal-row"><div><strong>Study blocks</strong><span className="muted">8 of 12 complete</span></div><div className="goal-progress"><span style={{ width: '67%' }} /></div><span className="mono">67%</span></div><div className="goal-row"><div><strong>DSA problems</strong><span className="muted">7 of 10 complete</span></div><div className="goal-progress"><span style={{ width: '70%' }} /></div><span className="mono">70%</span></div><div className="goal-row"><div><strong>Tests taken</strong><span className="muted">2 of 3 complete</span></div><div className="goal-progress"><span style={{ width: '67%' }} /></div><span className="mono">67%</span></div></section><section className="dashboard-panel quick-panel"><SectionHeading eyebrow="Shortcuts" title="Quick actions" /><div className="quick-actions"><ActionButton icon={Plus} label="Add task" onClick={() => showActionMessage('Add task')} /><ActionButton icon={ClipboardCheck} label="Log test" onClick={() => showActionMessage('Log test')} /><ActionButton icon={Target} label="Update progress" onClick={() => showActionMessage('Update progress')} /><ActionButton icon={FolderKanban} label="Add project" onClick={() => showActionMessage('Add project')} /></div></section></div>
      {actionMessage && <div className="dashboard-action-toast" role="status"><Check size={15} />{actionMessage}</div>}
    </div>
  );
}

export default Dashboard;
