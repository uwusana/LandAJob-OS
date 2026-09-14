import { useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  CalendarDays,
  Check,
  ChevronRight,
  Clock3,
  Copy,
  Edit3,
  FileText,
  Flame,
  Pause,
  Play,
  Plus,
  Save,
  Trash2,
  X,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

const categories = ['Wake up', 'Morning routine', 'DSA', 'JavaScript', 'React', 'Java', 'Java Full Stack', 'Projects', 'Revision', 'Testing', 'Exercise', 'Meal', 'Break', 'Leisure', 'Sleep'];

const categoryIcons = {
  'Wake up': Clock3,
  'Morning routine': Flame,
  DSA: FileText,
  JavaScript: FileText,
  React: FileText,
  Java: FileText,
  'Java Full Stack': FileText,
  Projects: FileText,
  Revision: FileText,
  Testing: Check,
  Exercise: Flame,
  Meal: Pause,
  Break: Pause,
  Leisure: Play,
  Sleep: Clock3,
};

const initialSchedule = [
  { id: 1, title: 'Wake up and reset', category: 'Wake up', startTime: '07:00', endTime: '07:20', notes: 'Water, sunlight, and no phone for the first few minutes.', complete: true },
  { id: 2, title: 'Morning routine', category: 'Morning routine', startTime: '07:20', endTime: '08:00', notes: 'Shower, breakfast, and set today\'s intention.', complete: true },
  { id: 3, title: 'Solve 2 array problems', category: 'DSA', startTime: '09:00', endTime: '10:30', notes: 'Focus on sliding window and prefix sums.', complete: false },
  { id: 4, title: 'React state and effects', category: 'React', startTime: '11:00', endTime: '12:00', notes: 'Review derived state and effect dependencies.', complete: false },
  { id: 5, title: 'Lunch and screen break', category: 'Meal', startTime: '13:00', endTime: '13:45', notes: 'Eat away from the desk.', complete: false },
  { id: 6, title: 'Portfolio project polish', category: 'Projects', startTime: '15:00', endTime: '16:30', notes: 'Improve the case study and ship one visible change.', complete: false },
  { id: 7, title: 'Valorant / leisure', category: 'Leisure', startTime: '20:00', endTime: '21:00', notes: 'Enjoy the hour without extending it.', complete: false },
  { id: 8, title: 'Sleep', category: 'Sleep', startTime: '23:00', endTime: '07:00', notes: 'Protect tomorrow\'s energy.', complete: false },
];

function minutesBetween(start, end) {
  const [startHour, startMinute] = start.split(':').map(Number);
  const [endHour, endMinute] = end.split(':').map(Number);
  let difference = endHour * 60 + endMinute - (startHour * 60 + startMinute);
  if (difference <= 0) difference += 24 * 60;
  return difference;
}

function formatDuration(minutes) {
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  if (hours && remainder) return `${hours}h ${remainder}m`;
  if (hours) return `${hours}h`;
  return `${remainder}m`;
}

function formatDate() {
  return new Intl.DateTimeFormat('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date());
}

function PlannerModal({ item, onSave, onClose }) {
  const [draft, setDraft] = useState(item || { title: '', category: 'DSA', startTime: '09:00', endTime: '10:00', notes: '', complete: false });
  const isEditing = Boolean(item);
  const updateDraft = (key, value) => setDraft((current) => ({ ...current, [key]: value }));

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!draft.title.trim()) return;
    onSave({ ...draft, title: draft.title.trim(), notes: draft.notes.trim() });
  };

  return (
    <div className="planner-modal-backdrop" role="presentation" onClick={onClose}>
      <form className="planner-modal" onSubmit={handleSubmit} role="dialog" aria-modal="true" aria-labelledby="planner-modal-title" onClick={(event) => event.stopPropagation()}>
        <div className="planner-modal-header"><div><span className="eyebrow">{isEditing ? 'Edit block' : 'New block'}</span><h2 id="planner-modal-title">Shape the day</h2></div><button type="button" className="icon-button" aria-label="Close editor" onClick={onClose}><X size={17} /></button></div>
        <label className="planner-field"><span>Activity</span><input autoFocus required value={draft.title} onChange={(event) => updateDraft('title', event.target.value)} placeholder="What will you work on?" /></label>
        <label className="planner-field"><span>Category</span><select value={draft.category} onChange={(event) => updateDraft('category', event.target.value)}>{categories.map((category) => <option key={category}>{category}</option>)}</select></label>
        <div className="planner-form-row"><label className="planner-field"><span>Start time</span><input type="time" value={draft.startTime} onChange={(event) => updateDraft('startTime', event.target.value)} /></label><label className="planner-field"><span>End time</span><input type="time" value={draft.endTime} onChange={(event) => updateDraft('endTime', event.target.value)} /></label></div>
        <label className="planner-field"><span>Notes</span><textarea value={draft.notes} onChange={(event) => updateDraft('notes', event.target.value)} placeholder="Add a useful detail for future you." /></label>
        <div className="planner-modal-actions"><button type="button" className="button button-quiet" onClick={onClose}>Cancel</button><button className="button button-primary" type="submit"><Save size={15} />{isEditing ? 'Save changes' : 'Add to day'}</button></div>
      </form>
    </div>
  );
}

function PlannerItem({ item, index, total, focused, onToggle, onEdit, onDelete, onDuplicate, onMove }) {
  const Icon = categoryIcons[item.category] || FileText;
  const status = item.complete ? 'completed' : focused ? 'current' : 'upcoming';
  return (
    <article className={`planner-item planner-item-${status}`}>
      <div className="planner-item-time"><span className="mono">{item.startTime}</span><span className="planner-duration mono">{formatDuration(minutesBetween(item.startTime, item.endTime))}</span></div>
      <div className="planner-rail"><span className="planner-node">{item.complete && <Check size={12} />}</span>{index < total - 1 && <span className="planner-connector" />}</div>
      <div className="planner-item-body"><div className="planner-item-top"><div className="planner-item-title"><div className="planner-category"><Icon size={13} />{item.category}</div><h3>{item.title}</h3>{item.notes && <p>{item.notes}</p>}</div><div className="planner-item-actions"><button className="icon-button" onClick={() => onToggle(item.id)} aria-label={item.complete ? `Mark ${item.title} incomplete` : `Mark ${item.title} complete`}>{item.complete ? <Check size={15} /> : <span className="empty-checkbox" />}</button><button className="icon-button" onClick={() => onEdit(item)} aria-label={`Edit ${item.title}`}><Edit3 size={14} /></button><button className="icon-button" onClick={() => onDelete(item.id)} aria-label={`Delete ${item.title}`}><Trash2 size={14} /></button></div></div><div className="planner-item-footer"><span className={`planner-status planner-status-${status}`}>{status === 'completed' ? 'Completed' : status === 'current' ? 'Current focus' : 'Upcoming'}</span><div className="planner-item-tools"><button onClick={() => onDuplicate(item)}><Copy size={13} />Duplicate</button><button onClick={() => onMove(item.id, -1)} disabled={index === 0} aria-label="Move item up"><ArrowUp size={13} /></button><button onClick={() => onMove(item.id, 1)} disabled={index === total - 1} aria-label="Move item down"><ArrowDown size={13} /></button></div></div></div>
    </article>
  );
}

function DailyPlanner() {
  const [items, setItems] = useState(initialSchedule);
  const [editingItem, setEditingItem] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [focusedId, setFocusedId] = useState(3);
  const [showCompleted, setShowCompleted] = useState(true);

  const completed = items.filter((item) => item.complete).length;
  const percentage = items.length ? Math.round((completed / items.length) * 100) : 0;
  const focusItem = items.find((item) => item.id === focusedId && !item.complete) || items.find((item) => !item.complete);
  const visibleItems = showCompleted ? items : items.filter((item) => !item.complete);

  const saveItem = (draft) => {
    if (editingItem) setItems((current) => current.map((item) => item.id === editingItem.id ? { ...draft, id: item.id } : item));
    else setItems((current) => [...current, { ...draft, id: Date.now() }]);
    setEditingItem(null);
    setModalOpen(false);
  };

  const deleteItem = (id) => setItems((current) => current.filter((item) => item.id !== id));
  const toggleItem = (id) => setItems((current) => current.map((item) => item.id === id ? { ...item, complete: !item.complete } : item));
  const duplicateItem = (item) => setItems((current) => { const index = current.findIndex((entry) => entry.id === item.id); const copy = { ...item, id: Date.now(), title: `${item.title} (copy)`, complete: false }; return [...current.slice(0, index + 1), copy, ...current.slice(index + 1)]; });
  const moveItem = (id, direction) => setItems((current) => { const index = current.findIndex((item) => item.id === id); const target = index + direction; if (target < 0 || target >= current.length) return current; const next = [...current]; [next[index], next[target]] = [next[target], next[index]]; return next; });

  return (
    <div className="planner-page">
      <div className="breadcrumb" aria-label="Breadcrumb"><NavLink to="/dashboard">Workspace</NavLink><ChevronRight size={13} /><span>Today</span></div>
      <section className="planner-header"><div><span className="eyebrow">Daily command center</span><h2>Plan the day you want to remember.</h2><p>{formatDate()} <span className="planner-local-note">Local planner snapshot</span></p></div><button className="button button-primary" onClick={() => { setEditingItem(null); setModalOpen(true); }}><Plus size={16} />Add schedule item</button></section>
      <section className="planner-summary"><div className="planner-summary-main"><div className="planner-summary-ring"><svg viewBox="0 0 80 80"><circle cx="40" cy="40" r="33" className="planner-ring-track" /><circle cx="40" cy="40" r="33" className="planner-ring-value" style={{ strokeDashoffset: 207 - ((percentage / 100) * 207) }} /></svg><strong className="mono">{percentage}%</strong></div><div><span className="eyebrow">Today's completion</span><h3>{completed} of {items.length} blocks complete</h3><p>{percentage >= 70 ? 'Good rhythm. Keep the next block small and deliberate.' : 'The day is still open. Start with the next useful block.'}</p></div></div><div className="planner-summary-metrics"><div><span className="eyebrow">Wake target</span><strong className="mono">07:00</strong></div><div><span className="eyebrow">Sleep target</span><strong className="mono">23:00</strong></div><div><span className="eyebrow">Planned time</span><strong className="mono">{formatDuration(items.reduce((total, item) => total + minutesBetween(item.startTime, item.endTime), 0))}</strong></div></div></section>
      {focusItem && <section className="planner-focus-bar"><div className="planner-focus-copy"><span className="planner-live-dot" /><div><span className="eyebrow">Current focus</span><strong>{focusItem.title}</strong><span className="muted">{focusItem.category} · {focusItem.startTime}–{focusItem.endTime}</span></div></div><div className="planner-focus-actions"><button className="button button-outline" onClick={() => setFocusedId(focusItem.id)}>{focusedId === focusItem.id ? <Pause size={15} /> : <Play size={15} />}{focusedId === focusItem.id ? 'Focus active' : 'Start focus'}</button><button className="icon-button" onClick={() => { setEditingItem(focusItem); setModalOpen(true); }} aria-label="Edit current focus"><Edit3 size={15} /></button></div></section>}
      <section className="planner-timeline-section"><div className="planner-section-heading"><div><span className="eyebrow">{items.length} blocks / ordered timeline</span><h2>Your day, in sequence</h2></div><button className={`planner-filter ${showCompleted ? 'is-active' : ''}`} onClick={() => setShowCompleted(!showCompleted)}>{showCompleted ? 'Showing all' : 'Active only'}<span>{showCompleted ? items.length : items.length - completed}</span></button></div><div className="planner-timeline">{visibleItems.map((item, index) => <PlannerItem key={item.id} item={item} index={index} total={visibleItems.length} current={item.id === focusedId} focused={item.id === focusedId && !item.complete} onToggle={toggleItem} onEdit={(selected) => { setEditingItem(selected); setModalOpen(true); }} onDelete={deleteItem} onDuplicate={duplicateItem} onMove={moveItem} />)}</div>{visibleItems.length === 0 && <div className="planner-empty"><CalendarDays size={20} /><h3>Nothing is waiting for you.</h3><p>All planned blocks are complete. Add a new one when the day changes shape.</p></div>}</section>
      {modalOpen && <PlannerModal item={editingItem} onSave={saveItem} onClose={() => { setModalOpen(false); setEditingItem(null); }} />}
    </div>
  );
}

export default DailyPlanner;
