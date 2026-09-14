import { useMemo, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  Check,
  ChevronRight,
  Copy,
  Edit3,
  FileText,
  FolderKanban,
  MoreHorizontal,
  Plus,
  Save,
  Target,
  Trash2,
  X,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

const days = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];
const categories = [
  'DSA',
  'JavaScript',
  'React',
  'Java',
  'Java Full Stack',
  'Projects',
  'Aptitude',
  'CS Fundamentals',
  'Abdul Bari',
  'Revision',
  'Testing',
  'Rest / Leisure',
];
const priorities = ['Primary Focus', 'Secondary Focus', 'Light / Optional'];

const categoryIcons = {
  DSA: Target,
  JavaScript: FileText,
  React: FileText,
  Java: FileText,
  'Java Full Stack': BookOpen,
  Projects: FolderKanban,
  Aptitude: Target,
  'CS Fundamentals': BookOpen,
  'Abdul Bari': BookOpen,
  Revision: FileText,
  Testing: Check,
  'Rest / Leisure': MoreHorizontal,
};

const initialBlocks = [
  {
    id: 1,
    day: 'Monday',
    subject: 'DSA',
    duration: 2,
    priority: 'Primary Focus',
    target: '3 Striver problems',
    notes: 'Arrays and sliding window.',
  },
  {
    id: 2,
    day: 'Monday',
    subject: 'React',
    duration: 1.5,
    priority: 'Secondary Focus',
    target: 'State and effects module',
    notes: 'Build one small example.',
  },
  {
    id: 3,
    day: 'Tuesday',
    subject: 'JavaScript',
    duration: 2,
    priority: 'Primary Focus',
    target: 'Async JavaScript',
    notes: 'Promises, async/await, event loop.',
  },
  {
    id: 4,
    day: 'Tuesday',
    subject: 'Projects',
    duration: 1.5,
    priority: 'Secondary Focus',
    target: 'Portfolio case study',
    notes: 'Write the problem and outcome.',
  },
  {
    id: 5,
    day: 'Wednesday',
    subject: 'DSA',
    duration: 2,
    priority: 'Primary Focus',
    target: 'Trees: 3 problems',
    notes: 'Trace every solution by hand.',
  },
  {
    id: 6,
    day: 'Wednesday',
    subject: 'Testing',
    duration: 1,
    priority: 'Light / Optional',
    target: 'JavaScript self-test',
    notes: 'Review mistakes after the attempt.',
  },
  {
    id: 7,
    day: 'Thursday',
    subject: 'Java Full Stack',
    duration: 2.5,
    priority: 'Primary Focus',
    target: 'Spring Boot controllers',
    notes: 'Connect one endpoint to MongoDB.',
  },
  {
    id: 8,
    day: 'Friday',
    subject: 'DSA',
    duration: 2,
    priority: 'Primary Focus',
    target: 'Graphs: 2 problems',
    notes: 'BFS and DFS revision.',
  },
  {
    id: 9,
    day: 'Friday',
    subject: 'Revision',
    duration: 1,
    priority: 'Secondary Focus',
    target: 'Weekly recall pass',
    notes: 'No new material.',
  },
  {
    id: 10,
    day: 'Saturday',
    subject: 'Projects',
    duration: 3,
    priority: 'Primary Focus',
    target: 'Ship one portfolio slice',
    notes: 'Deploy before dinner.',
  },
  {
    id: 11,
    day: 'Saturday',
    subject: 'Rest / Leisure',
    duration: 2,
    priority: 'Light / Optional',
    target: 'Play and reset',
    notes: 'Keep the evening unstructured.',
  },
  {
    id: 12,
    day: 'Sunday',
    subject: 'Abdul Bari',
    duration: 1.5,
    priority: 'Secondary Focus',
    target: 'Complete 2 theory topics',
    notes: 'Make concise notes.',
  },
  {
    id: 13,
    day: 'Sunday',
    subject: 'Rest / Leisure',
    duration: 2,
    priority: 'Light / Optional',
    target: 'Plan next week',
    notes: 'Review what actually happened.',
  },
];

function formatHours(value) {
  return Number.isInteger(value) ? `${value}h` : `${value.toFixed(1)}h`;
}

function BlockModal({ block, defaultDay, onSave, onClose }) {
  const [draft, setDraft] = useState(
    block || {
      day: defaultDay,
      subject: 'DSA',
      duration: 1,
      priority: 'Primary Focus',
      target: '',
      notes: '',
    }
  );
  const isEditing = Boolean(block);
  const update = (key, value) =>
    setDraft((current) => ({ ...current, [key]: value }));

  const submit = (event) => {
    event.preventDefault();
    if (!draft.target.trim()) return;
    onSave({
      ...draft,
      duration: Math.max(0.5, Number(draft.duration) || 0.5),
      target: draft.target.trim(),
      notes: draft.notes.trim(),
    });
  };

  return (
    <div
      className="rotation-modal-backdrop"
      role="presentation"
      onClick={onClose}
    >
      <form
        className="rotation-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="rotation-modal-title"
        onClick={(event) => event.stopPropagation()}
        onSubmit={submit}
      >
        <div className="rotation-modal-header">
          <div>
            <span className="eyebrow">
              {isEditing ? 'Edit block' : 'Add block'}
            </span>
            <h2 id="rotation-modal-title">Shape the rotation</h2>
          </div>
          <button
            type="button"
            className="icon-button"
            aria-label="Close editor"
            onClick={onClose}
          >
            <X size={17} />
          </button>
        </div>
        <label className="rotation-field">
          <span>Day</span>
          <select
            value={draft.day}
            onChange={(event) => update('day', event.target.value)}
          >
            {days.map((day) => (
              <option key={day}>{day}</option>
            ))}
          </select>
        </label>
        <label className="rotation-field">
          <span>Subject</span>
          <select
            value={draft.subject}
            onChange={(event) => update('subject', event.target.value)}
          >
            {categories.map((category) => (
              <option key={category}>{category}</option>
            ))}
          </select>
        </label>
        <div className="rotation-form-row">
          <label className="rotation-field">
            <span>Duration / hours</span>
            <input
              type="number"
              min="0.5"
              step="0.5"
              value={draft.duration}
              onChange={(event) => update('duration', event.target.value)}
            />
          </label>
          <label className="rotation-field">
            <span>Priority</span>
            <select
              value={draft.priority}
              onChange={(event) => update('priority', event.target.value)}
            >
              {priorities.map((priority) => (
                <option key={priority}>{priority}</option>
              ))}
            </select>
          </label>
        </div>
        <label className="rotation-field">
          <span>Target</span>
          <input
            required
            value={draft.target}
            onChange={(event) => update('target', event.target.value)}
            placeholder="What should be true by the end?"
          />
        </label>
        <label className="rotation-field">
          <span>Notes</span>
          <textarea
            value={draft.notes}
            onChange={(event) => update('notes', event.target.value)}
            placeholder="Add context for future you."
          />
        </label>
        <div className="rotation-modal-actions">
          <button
            type="button"
            className="button button-quiet"
            onClick={onClose}
          >
            Cancel
          </button>
          <button className="button button-primary" type="submit">
            <Save size={15} />
            {isEditing ? 'Save changes' : 'Add block'}
          </button>
        </div>
      </form>
    </div>
  );
}

function PriorityLegend() {
  return (
    <div className="priority-legend">
      {priorities.map((priority) => (
        <span key={priority}>
          <i
            className={`priority-dot priority-${priority.toLowerCase().replaceAll(' ', '-')}`}
          />
          {priority}
        </span>
      ))}
    </div>
  );
}

function RotationBlock({ block, onEdit, onDelete, onDuplicate, onMove }) {
  const Icon = categoryIcons[block.subject] || FileText;
  const priorityClass = `priority-${block.priority.toLowerCase().replaceAll(' ', '-')}`;
  return (
    <article className={`rotation-block ${priorityClass}`}>
      <div className="rotation-block-top">
        <span className="rotation-subject">
          <Icon size={13} />
          {block.subject}
        </span>
        <div className="rotation-block-menu">
          <button
            className="icon-button"
            onClick={() => onEdit(block)}
            aria-label={`Edit ${block.target}`}
          >
            <Edit3 size={13} />
          </button>
          <button
            className="icon-button"
            onClick={() => onDelete(block.id)}
            aria-label={`Delete ${block.target}`}
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
      <strong>{block.target}</strong>
      <div className="rotation-block-meta">
        <span className="mono">{formatHours(block.duration)}</span>
        <span className="rotation-priority-label">{block.priority}</span>
      </div>
      {block.notes && <p>{block.notes}</p>}
      <div className="rotation-block-footer">
        <button onClick={() => onDuplicate(block)}>
          <Copy size={12} />
          Duplicate
        </button>
        <div>
          <button
            onClick={() => onMove(block, -1)}
            aria-label={`Move ${block.target} to previous day`}
          >
            <ArrowRight size={13} className="move-previous" />
          </button>
          <button
            onClick={() => onMove(block, 1)}
            aria-label={`Move ${block.target} to next day`}
          >
            <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </article>
  );
}

function WeeklySummary({ blocks }) {
  const totals = blocks.reduce(
    (summary, block) => {
      summary.planned += block.duration;
      if (block.subject === 'DSA') summary.dsa += block.duration;
      if (
        ['JavaScript', 'React', 'Java', 'Java Full Stack'].includes(
          block.subject
        )
      )
        summary.development += block.duration;
      if (block.subject === 'Projects') summary.projects += block.duration;
      if (block.subject === 'Testing') summary.testing += block.duration;
      if (block.subject === 'Revision') summary.revision += block.duration;
      return summary;
    },
    { planned: 0, dsa: 0, development: 0, projects: 0, testing: 0, revision: 0 }
  );
  const metrics = [
    ['Planned study', totals.planned, 'hours'],
    ['DSA', totals.dsa, 'hours'],
    ['Development', totals.development, 'hours'],
    ['Projects', totals.projects, 'hours'],
    ['Testing', totals.testing, 'hours'],
    ['Revision', totals.revision, 'hours'],
  ];
  return (
    <section className="rotation-summary">
      <div className="rotation-summary-heading">
        <div>
          <span className="eyebrow">This week</span>
          <h2>The shape of your focus</h2>
        </div>
        <span className="mono">{blocks.length} blocks</span>
      </div>
      <div className="rotation-summary-grid">
        {metrics.map(([label, value, unit]) => (
          <div className="rotation-summary-metric" key={label}>
            <span className="eyebrow">{label}</span>
            <strong className="mono">{formatHours(value)}</strong>
            <small>{unit} planned</small>
          </div>
        ))}
      </div>
    </section>
  );
}

function WeeklyRotation() {
  const [blocks, setBlocks] = useState(initialBlocks);
  const [editingBlock, setEditingBlock] = useState(null);
  const [modalDay, setModalDay] = useState(null);
  const [notice, setNotice] = useState('');

  const blocksByDay = useMemo(
    () =>
      days.reduce(
        (result, day) => ({
          ...result,
          [day]: blocks.filter((block) => block.day === day),
        }),
        {}
      ),
    [blocks]
  );
  const weekStart = useMemo(() => {
    const date = new Date();
    const day = date.getDay();
    const mondayOffset = day === 0 ? -6 : 1 - day;
    date.setDate(date.getDate() + mondayOffset);
    return date;
  }, []);
  const weekLabel = `${new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short' }).format(weekStart)} – ${new Intl.DateTimeFormat('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }).format(new Date(weekStart.getTime() + 6 * 86400000))}`;

  const saveBlock = (draft) => {
    if (editingBlock)
      setBlocks((current) =>
        current.map((block) =>
          block.id === editingBlock.id ? { ...draft, id: block.id } : block
        )
      );
    else setBlocks((current) => [...current, { ...draft, id: Date.now() }]);
    setEditingBlock(null);
    setModalDay(draft.day);
  };
  const deleteBlock = (id) =>
    setBlocks((current) => current.filter((block) => block.id !== id));
  const duplicateBlock = (block) =>
    setBlocks((current) => {
      const index = current.findIndex((entry) => entry.id === block.id);
      const copy = {
        ...block,
        id: Date.now(),
        target: `${block.target} (copy)`,
      };
      return [
        ...current.slice(0, index + 1),
        copy,
        ...current.slice(index + 1),
      ];
    });
  const moveBlock = (block, direction) => {
    const index = days.indexOf(block.day);
    const nextDay = days[index + direction];
    if (nextDay)
      setBlocks((current) =>
        current.map((entry) =>
          entry.id === block.id ? { ...entry, day: nextDay } : entry
        )
      );
  };
  const openNew = (day) => {
    setEditingBlock(null);
    setModalDay(day);
  };
  const showNotice = () => {
    setNotice(
      'This rotation is ready to become daily schedule blocks when planner integration is connected.'
    );
    window.setTimeout(() => setNotice(''), 3200);
  };

  return (
    <div className="rotation-page">
      <div className="breadcrumb" aria-label="Breadcrumb">
        <NavLink to="/dashboard">Workspace</NavLink>
        <ChevronRight size={13} />
        <span>Weekly Plan</span>
      </div>
      <section className="rotation-header">
        <div>
          <span className="eyebrow">Recurring learning structure</span>
          <h2>Give every day a useful shape.</h2>
          <p>
            {weekLabel}{' '}
            <span className="rotation-local-note">Local rotation snapshot</span>
          </p>
        </div>
        <div className="rotation-header-actions">
          <button className="button button-outline" onClick={showNotice}>
            <CalendarDays size={15} />
            Use for today
          </button>
          <button
            className="button button-primary"
            onClick={() => openNew('Monday')}
          >
            <Plus size={16} />
            Add block
          </button>
        </div>
      </section>
      <WeeklySummary blocks={blocks} />
      <section className="rotation-board-section">
        <div className="rotation-board-heading">
          <div>
            <span className="eyebrow">
              Weekly board / {blocks.length} blocks
            </span>
            <h2>Learning rotation</h2>
          </div>
          <PriorityLegend />
        </div>
        <div className="rotation-board">
          {days.map((day) => (
            <section className="rotation-day" key={day}>
              <header className="rotation-day-header">
                <div>
                  <span className="mono">
                    {String(days.indexOf(day) + 1).padStart(2, '0')}
                  </span>
                  <h3>{day}</h3>
                </div>
                <button
                  className="icon-button"
                  onClick={() => openNew(day)}
                  aria-label={`Add block to ${day}`}
                >
                  <Plus size={15} />
                </button>
              </header>
              <div className="rotation-day-hours">
                <span className="mono">
                  {formatHours(
                    (blocksByDay[day] || []).reduce(
                      (total, block) => total + block.duration,
                      0
                    )
                  )}
                </span>
                <span>planned</span>
              </div>
              <div className="rotation-block-list">
                {blocksByDay[day].map((block) => (
                  <RotationBlock
                    key={block.id}
                    block={block}
                    onEdit={(selected) => {
                      setEditingBlock(selected);
                      setModalDay(selected.day);
                    }}
                    onDelete={deleteBlock}
                    onDuplicate={duplicateBlock}
                    onMove={moveBlock}
                  />
                ))}
              </div>
              <button className="rotation-add-day" onClick={() => openNew(day)}>
                <Plus size={13} />
                Add block
              </button>
            </section>
          ))}
        </div>
      </section>
      {notice && (
        <div className="dashboard-action-toast" role="status">
          <Check size={15} />
          {notice}
        </div>
      )}
      {(editingBlock || modalDay) && (
        <BlockEditorController
          editingBlock={editingBlock}
          modalDay={modalDay}
          onSave={saveBlock}
          onClose={() => {
            setEditingBlock(null);
            setModalDay(null);
          }}
        />
      )}
    </div>
  );
}

function BlockEditorController({ editingBlock, modalDay, onSave, onClose }) {
  const [open, setOpen] = useState(Boolean(editingBlock));
  if (!open && !editingBlock && !modalDay) return null;
  return (
    <BlockModal
      block={editingBlock}
      defaultDay={modalDay || 'Monday'}
      onSave={(draft) => {
        onSave(draft);
        setOpen(false);
        onClose();
      }}
      onClose={() => {
        setOpen(false);
        onClose();
      }}
    />
  );
}

export default WeeklyRotation;
