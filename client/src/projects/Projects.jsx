import { useMemo, useState } from 'react';
import {
  ArrowRight,
  CalendarDays,
  Check,
  ChevronRight,
  Circle,
  Edit3,
  ExternalLink,
  GitBranch,
  Link2,
  Plus,
  Save,
  Trash2,
  X,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

const statuses = ['IDEA', 'PLANNED', 'IN PROGRESS', 'PAUSED', 'SHIPPED'];
const boardStatuses = ['IDEA', 'PLANNED', 'IN PROGRESS', 'PAUSED', 'SHIPPED'];
const priorities = ['High', 'Medium', 'Low'];
const statusLabels = {
  IDEA: 'Ideas',
  PLANNED: 'Planned',
  'IN PROGRESS': 'In Progress',
  PAUSED: 'Paused',
  SHIPPED: 'Shipped',
};
const initialProjects = [
  {
    id: 1,
    name: 'Land a Job OS',
    description:
      'A personal operating system for focused job preparation and visible progress.',
    status: 'IN PROGRESS',
    priority: 'High',
    technologies: ['React', 'Vite', 'MongoDB'],
    startDate: '2026-08-26',
    targetDate: '2026-10-15',
    githubUrl: 'https://github.com/arjun/land-a-job-os',
    deploymentUrl: '',
    readmeStatus: 'In progress',
    portfolioStatus: 'Draft',
    progress: 42,
    notes: 'Keep the first version calm, useful, and easy to maintain.',
    milestones: [
      { label: 'Application shell', done: true },
      { label: 'Daily planner', done: true },
      { label: 'Backend persistence', done: false },
    ],
  },
  {
    id: 2,
    name: 'Interview Patterns',
    description:
      'A spaced-repetition tool for revisiting DSA patterns before interviews.',
    status: 'PLANNED',
    priority: 'High',
    technologies: ['React', 'Node.js', 'PostgreSQL'],
    startDate: '2026-10-20',
    targetDate: '2026-12-01',
    githubUrl: '',
    deploymentUrl: '',
    readmeStatus: 'Not started',
    portfolioStatus: 'Not started',
    progress: 0,
    notes: 'Validate the smallest useful study loop first.',
    milestones: [
      { label: 'Define card model', done: false },
      { label: 'Build review loop', done: false },
    ],
  },
  {
    id: 3,
    name: 'Focus Timer',
    description:
      'A small timer that makes a focused study block feel tangible.',
    status: 'SHIPPED',
    priority: 'Medium',
    technologies: ['JavaScript', 'CSS'],
    startDate: '2026-07-12',
    targetDate: '2026-08-01',
    githubUrl: 'https://github.com/arjun/focus-timer',
    deploymentUrl: 'https://focus-timer.example.dev',
    readmeStatus: 'Complete',
    portfolioStatus: 'Published',
    progress: 100,
    notes: 'A small finished project with a clear story.',
    milestones: [
      { label: 'Timer interaction', done: true },
      { label: 'Deploy', done: true },
    ],
  },
  {
    id: 4,
    name: 'Spring Notes API',
    description:
      'A backend practice project for Java, REST design, and persistence.',
    status: 'IDEA',
    priority: 'Low',
    technologies: ['Java', 'Spring Boot'],
    startDate: '',
    targetDate: '',
    githubUrl: '',
    deploymentUrl: '',
    readmeStatus: 'Not started',
    portfolioStatus: 'Not started',
    progress: 0,
    notes: 'Park until the core Java rotation is further along.',
    milestones: [],
  },
];

function formatDate(value) {
  return value
    ? new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      }).format(new Date(`${value}T12:00:00`))
    : 'Not set';
}

function ProjectModal({ project, onSave, onClose }) {
  const [draft, setDraft] = useState(
    project || {
      name: '',
      description: '',
      status: 'IDEA',
      priority: 'Medium',
      technologies: [],
      startDate: '',
      targetDate: '',
      githubUrl: '',
      deploymentUrl: '',
      readmeStatus: 'Not started',
      portfolioStatus: 'Not started',
      progress: 0,
      notes: '',
      milestones: [],
    }
  );
  const [technologyInput, setTechnologyInput] = useState('');
  const update = (key, value) =>
    setDraft((current) => ({ ...current, [key]: value }));
  const addTechnology = (event) => {
    if (event.key === 'Enter' && technologyInput.trim()) {
      event.preventDefault();
      update('technologies', [...draft.technologies, technologyInput.trim()]);
      setTechnologyInput('');
    }
  };
  const submit = (event) => {
    event.preventDefault();
    if (!draft.name.trim()) return;
    onSave({
      ...draft,
      name: draft.name.trim(),
      description: draft.description.trim(),
      notes: draft.notes.trim(),
    });
  };
  return (
    <div
      className="projects-modal-backdrop"
      role="presentation"
      onClick={onClose}
    >
      <form
        className="projects-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-modal-title"
        onClick={(event) => event.stopPropagation()}
        onSubmit={submit}
      >
        <div className="projects-modal-header">
          <div>
            <span className="eyebrow">
              {project ? 'Edit project' : 'New project'}
            </span>
            <h2 id="project-modal-title">Make the work visible.</h2>
          </div>
          <button
            type="button"
            className="icon-button"
            aria-label="Close project editor"
            onClick={onClose}
          >
            <X size={17} />
          </button>
        </div>
        <div className="projects-form-row">
          <label className="projects-field">
            <span>Project name</span>
            <input
              required
              autoFocus
              value={draft.name}
              onChange={(event) => update('name', event.target.value)}
              placeholder="What are you building?"
            />
          </label>
          <label className="projects-field">
            <span>Status</span>
            <select
              value={draft.status}
              onChange={(event) => update('status', event.target.value)}
            >
              {statuses.map((status) => (
                <option key={status}>{status}</option>
              ))}
            </select>
          </label>
        </div>
        <label className="projects-field">
          <span>Description</span>
          <textarea
            value={draft.description}
            onChange={(event) => update('description', event.target.value)}
            placeholder="What problem does this solve?"
          />
        </label>
        <div className="projects-form-row">
          <label className="projects-field">
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
          <label className="projects-field">
            <span>Progress / percent</span>
            <input
              type="number"
              min="0"
              max="100"
              value={draft.progress}
              onChange={(event) =>
                update('progress', Number(event.target.value))
              }
            />
          </label>
        </div>
        <div className="projects-form-row">
          <label className="projects-field">
            <span>Start date</span>
            <input
              type="date"
              value={draft.startDate}
              onChange={(event) => update('startDate', event.target.value)}
            />
          </label>
          <label className="projects-field">
            <span>Target completion</span>
            <input
              type="date"
              value={draft.targetDate}
              onChange={(event) => update('targetDate', event.target.value)}
            />
          </label>
        </div>
        <label className="projects-field">
          <span>Technologies / press Enter to add</span>
          <input
            value={technologyInput}
            onChange={(event) => setTechnologyInput(event.target.value)}
            onKeyDown={addTechnology}
            placeholder="React, Node.js, MongoDB"
          />
        </label>
        <div className="project-tech-list">
          {draft.technologies.map((technology) => (
            <button
              type="button"
              key={technology}
              onClick={() =>
                update(
                  'technologies',
                  draft.technologies.filter((entry) => entry !== technology)
                )
              }
            >
              {technology}
              <X size={11} />
            </button>
          ))}
        </div>
        <div className="projects-form-row">
          <label className="projects-field">
            <span>GitHub URL</span>
            <input
              type="url"
              value={draft.githubUrl}
              onChange={(event) => update('githubUrl', event.target.value)}
              placeholder="https://github.com/..."
            />
          </label>
          <label className="projects-field">
            <span>Deployment URL</span>
            <input
              type="url"
              value={draft.deploymentUrl}
              onChange={(event) => update('deploymentUrl', event.target.value)}
              placeholder="https://..."
            />
          </label>
        </div>
        <div className="projects-form-row">
          <label className="projects-field">
            <span>README status</span>
            <select
              value={draft.readmeStatus}
              onChange={(event) => update('readmeStatus', event.target.value)}
            >
              <option>Not started</option>
              <option>In progress</option>
              <option>Complete</option>
            </select>
          </label>
          <label className="projects-field">
            <span>Portfolio status</span>
            <select
              value={draft.portfolioStatus}
              onChange={(event) =>
                update('portfolioStatus', event.target.value)
              }
            >
              <option>Not started</option>
              <option>Draft</option>
              <option>Published</option>
            </select>
          </label>
        </div>
        <label className="projects-field">
          <span>Notes</span>
          <textarea
            value={draft.notes}
            onChange={(event) => update('notes', event.target.value)}
            placeholder="Useful context for future you."
          />
        </label>
        <div className="projects-modal-actions">
          <button
            type="button"
            className="button button-quiet"
            onClick={onClose}
          >
            Cancel
          </button>
          <button type="submit" className="button button-primary">
            <Save size={15} />
            Save project
          </button>
        </div>
      </form>
    </div>
  );
}

function ProjectCard({ project, onSelect, onEdit, onDelete, onStatusChange }) {
  return (
    <article className="project-card">
      <button
        className="project-card-main"
        onClick={() => onSelect(project.id)}
      >
        <div className="project-card-heading">
          <span
            className={`project-priority-dot project-priority-${project.priority.toLowerCase()}`}
          />
          <span className="project-priority">{project.priority} priority</span>
          <span className="project-card-arrow">
            <ArrowRight size={14} />
          </span>
        </div>
        <h3>{project.name}</h3>
        <p>{project.description}</p>
        <div className="project-tech-list">
          {project.technologies.slice(0, 3).map((technology) => (
            <span key={technology}>{technology}</span>
          ))}
          {project.technologies.length > 3 && (
            <span>+{project.technologies.length - 3}</span>
          )}
        </div>
        <div className="project-progress-line">
          <span>
            <b className="mono">{project.progress}%</b> shipped
          </span>
          <div>
            <span style={{ width: `${project.progress}%` }} />
          </div>
        </div>
      </button>
      <div className="project-card-footer">
        <select
          value={project.status}
          onChange={(event) => onStatusChange(project.id, event.target.value)}
          aria-label={`Change status for ${project.name}`}
        >
          {statuses.map((status) => (
            <option key={status}>{status}</option>
          ))}
        </select>
        <div>
          <button
            className="icon-button"
            onClick={() => onEdit(project)}
            aria-label={`Edit ${project.name}`}
          >
            <Edit3 size={13} />
          </button>
          <button
            className="icon-button"
            onClick={() => onDelete(project.id)}
            aria-label={`Delete ${project.name}`}
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </article>
  );
}

function ProjectDetail({
  project,
  onClose,
  onEdit,
  onToggleMilestone,
  onAddMilestone,
  onRemoveMilestone,
}) {
  const completedMilestones = project.milestones.filter(
    (milestone) => milestone.done
  ).length;
  const [milestoneInput, setMilestoneInput] = useState('');
  const submitMilestone = () => {
    if (!milestoneInput.trim()) return;
    onAddMilestone(project.id, milestoneInput.trim());
    setMilestoneInput('');
  };
  return (
    <aside className="project-detail-panel">
      <div className="project-detail-header">
        <div>
          <span className="eyebrow">Project detail</span>
          <h2>{project.name}</h2>
        </div>
        <button
          className="icon-button"
          aria-label="Close project detail"
          onClick={onClose}
        >
          <X size={17} />
        </button>
      </div>
      <p className="project-detail-description">{project.description}</p>
      <div className="project-detail-actions">
        <button
          className="button button-primary"
          onClick={() => onEdit(project)}
        >
          <Edit3 size={14} />
          Edit project
        </button>
        {project.githubUrl && (
          <a
            className="button button-outline"
            href={project.githubUrl}
            target="_blank"
            rel="noreferrer"
          >
            <GitBranch size={14} />
            GitHub
          </a>
        )}
      </div>
      <section className="project-detail-section">
        <span className="eyebrow">Overview</span>
        <div className="project-detail-overview">
          <div>
            <span>Status</span>
            <strong>{project.status}</strong>
          </div>
          <div>
            <span>Priority</span>
            <strong>{project.priority}</strong>
          </div>
          <div>
            <span>Progress</span>
            <strong className="mono">{project.progress}%</strong>
          </div>
          <div>
            <span>Target</span>
            <strong>{formatDate(project.targetDate)}</strong>
          </div>
        </div>
      </section>
      <section className="project-detail-section">
        <span className="eyebrow">Tech stack</span>
        <div className="project-tech-list project-detail-tech">
          {project.technologies.map((technology) => (
            <span key={technology}>{technology}</span>
          ))}
        </div>
      </section>
      <section className="project-detail-section">
        <div className="project-detail-section-heading">
          <span className="eyebrow">Milestones</span>
          <span className="mono">
            {completedMilestones}/{project.milestones.length}
          </span>
        </div>
        {project.milestones.length ? (
          <div className="project-milestones">
            {project.milestones.map((milestone, index) => (
              <div className="project-milestone-row" key={index}>
                <button
                  className={
                    milestone.done ? 'project-milestone-toggle is-done' : 'project-milestone-toggle'
                  }
                  onClick={() => onToggleMilestone(project.id, index)}
                >
                  <span>
                    {milestone.done ? <Check size={12} /> : <Circle size={12} />}
                  </span>
                  {milestone.label}
                </button>
                <button
                  className="icon-button project-milestone-remove"
                  onClick={() => onRemoveMilestone(project.id, index)}
                  aria-label={`Remove milestone ${milestone.label}`}
                >
                  <X size={13} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="project-muted">No milestones added yet.</p>
        )}
        <div className="project-milestone-add">
          <input
            value={milestoneInput}
            onChange={(event) => setMilestoneInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                submitMilestone();
              }
            }}
            placeholder="Add a milestone"
            aria-label="New milestone name"
          />
          <button
            type="button"
            className="icon-button project-milestone-add-button"
            onClick={submitMilestone}
            aria-label="Add milestone"
          >
            <Plus size={14} />
          </button>
        </div>
      </section>
      <section className="project-detail-section">
        <span className="eyebrow">Links</span>
        <div className="project-links">
          {project.githubUrl ? (
            <a href={project.githubUrl} target="_blank" rel="noreferrer">
              <GitBranch size={14} />
              Repository <ExternalLink size={12} />
            </a>
          ) : (
            <span>
              <GitBranch size={14} />
              Repository not added
            </span>
          )}
          {project.deploymentUrl ? (
            <a href={project.deploymentUrl} target="_blank" rel="noreferrer">
              <Link2 size={14} />
              Live deployment <ExternalLink size={12} />
            </a>
          ) : (
            <span>
              <Link2 size={14} />
              Deployment not added
            </span>
          )}
        </div>
      </section>
      <section className="project-detail-section">
        <span className="eyebrow">Project writing</span>
        <div className="project-writing">
          <span>
            README <b>{project.readmeStatus}</b>
          </span>
          <span>
            Portfolio <b>{project.portfolioStatus}</b>
          </span>
        </div>
      </section>
      <section className="project-detail-section">
        <span className="eyebrow">Notes</span>
        <p className="project-detail-notes">
          {project.notes || 'No notes yet.'}
        </p>
      </section>
    </aside>
  );
}

function Projects() {
  const [projects, setProjects] = useState(initialProjects);
  const [selectedId, setSelectedId] = useState(initialProjects[0].id);
  const [editingProject, setEditingProject] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [notice, setNotice] = useState('');
  const stats = useMemo(
    () => ({
      planned: projects.filter((project) => project.status === 'PLANNED')
        .length,
      inProgress: projects.filter((project) => project.status === 'IN PROGRESS')
        .length,
      shipped: projects.filter((project) => project.status === 'SHIPPED')
        .length,
      paused: projects.filter((project) => project.status === 'PAUSED').length,
    }),
    [projects]
  );
  const selectedProject = projects.find((project) => project.id === selectedId);
  const updateStatus = (id, status) =>
    setProjects((current) =>
      current.map((project) =>
        project.id === id
          ? {
              ...project,
              status,
              progress: status === 'SHIPPED' ? 100 : project.progress,
            }
          : project
      )
    );
  const saveProject = (draft) => {
    const id = editingProject?.id || Date.now();
    setProjects((current) =>
      editingProject
        ? current.map((project) =>
            project.id === id ? { ...draft, id } : project
          )
        : [...current, { ...draft, id }]
    );
    setSelectedId(id);
    setEditingProject(null);
    setModalOpen(false);
  };
  const deleteProject = (id) => {
    setProjects((current) => current.filter((project) => project.id !== id));
    if (selectedId === id) setSelectedId(null);
  };
  const toggleMilestone = (projectId, milestoneIndex) =>
    setProjects((current) =>
      current.map((project) =>
        project.id === projectId
          ? {
              ...project,
              milestones: project.milestones.map((milestone, index) =>
                index === milestoneIndex
                  ? { ...milestone, done: !milestone.done }
                  : milestone
              ),
            }
          : project
      )
    );
  const addMilestone = (projectId, label) =>
    setProjects((current) =>
      current.map((project) =>
        project.id === projectId
          ? {
              ...project,
              milestones: [...project.milestones, { label, done: false }],
            }
          : project
      )
    );
  const removeMilestone = (projectId, milestoneIndex) =>
    setProjects((current) =>
      current.map((project) =>
        project.id === projectId
          ? {
              ...project,
              milestones: project.milestones.filter(
                (_, index) => index !== milestoneIndex
              ),
            }
          : project
      )
    );
  const showNotice = () => {
    setNotice(
      'Project details are local until backend persistence is connected.'
    );
    window.setTimeout(() => setNotice(''), 2800);
  };
  const openNew = () => {
    setEditingProject(null);
    setModalOpen(true);
  };
  const openEdit = (project) => {
    setEditingProject(project);
    setModalOpen(true);
  };

  return (
    <div className="projects-page">
      <div className="breadcrumb" aria-label="Breadcrumb">
        <NavLink to="/dashboard">Workspace</NavLink>
        <ChevronRight size={13} />
        <span>Projects</span>
      </div>
      <section className="projects-header">
        <div>
          <span className="eyebrow">Build log / local snapshot</span>
          <h2>Turn good ideas into proof.</h2>
          <p>Move projects from a loose thought to something you can show.</p>
        </div>
        <button className="button button-primary" onClick={openNew}>
          <Plus size={16} />
          New project
        </button>
      </section>
      <section className="projects-summary">
        <div>
          <span className="eyebrow">Projects planned</span>
          <strong className="mono">{stats.planned}</strong>
          <small>Ready to start</small>
        </div>
        <div>
          <span className="eyebrow">In progress</span>
          <strong className="mono">{stats.inProgress}</strong>
          <small>Active builds</small>
        </div>
        <div>
          <span className="eyebrow">Paused</span>
          <strong className="mono">{stats.paused}</strong>
          <small>On hold</small>
        </div>
        <div>
          <span className="eyebrow">Shipped</span>
          <strong className="mono">{stats.shipped}</strong>
          <small>Proof in the world</small>
        </div>
      </section>
      <section className="projects-board-section">
        <div className="projects-board-heading">
          <div>
            <span className="eyebrow">Kanban / {projects.length} projects</span>
            <h2>Project pipeline</h2>
          </div>
          <button className="projects-integration-button" onClick={showNotice}>
            <CalendarDays size={14} />
            Local project data
          </button>
        </div>
        <div className="projects-board">
          {boardStatuses.map((status) => (
            <section className="project-column" key={status}>
              <header>
                <div>
                  <span className="mono">
                    {String(boardStatuses.indexOf(status) + 1).padStart(2, '0')}
                  </span>
                  <h3>{statusLabels[status]}</h3>
                </div>
                <span className="project-column-count mono">
                  {
                    projects.filter((project) => project.status === status)
                      .length
                  }
                </span>
              </header>
              <div className="project-column-list">
                {projects
                  .filter((project) => project.status === status)
                  .map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      onSelect={setSelectedId}
                      onEdit={openEdit}
                      onDelete={deleteProject}
                      onStatusChange={updateStatus}
                    />
                  ))}
              </div>
              <button className="project-column-add" onClick={openNew}>
                <Plus size={13} />
                Add project
              </button>
            </section>
          ))}
        </div>
      </section>
      {selectedProject && (
        <ProjectDetail
          project={selectedProject}
          onClose={() => setSelectedId(null)}
          onEdit={openEdit}
          onToggleMilestone={toggleMilestone}
          onAddMilestone={addMilestone}
          onRemoveMilestone={removeMilestone}
        />
      )}
      {notice && (
        <div className="dashboard-action-toast" role="status">
          <Check size={15} />
          {notice}
        </div>
      )}
      {modalOpen && (
        <ProjectModal
          project={editingProject}
          onSave={saveProject}
          onClose={() => {
            setModalOpen(false);
            setEditingProject(null);
          }}
        />
      )}
    </div>
  );
}

export default Projects;
