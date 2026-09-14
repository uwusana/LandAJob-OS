import { useMemo, useState } from 'react';
import {
  ArrowRight,
  Check,
  ChevronRight,
  Circle,
  Filter,
  Layers3,
  Play,
  RotateCcw,
  Trophy,
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

const filters = ['All', 'In Progress', 'Completed', 'Not Started'];

 const resourceSeed = [
  {
    id: 'striver-dsa',
    name: 'Striver DSA',
    shortName: 'STRIVER DSA',
    type: 'Problems',
    tone: 'primary',
    items: [
      {
        id: 's1',
        title: 'Two Sum',
        topic: 'Arrays',
        difficulty: 'Easy',
        status: 'completed',
        lastStudied: '05 Sep 2026',
      },
      {
        id: 's2',
        title: 'Best Time to Buy and Sell Stock',
        topic: 'Arrays',
        difficulty: 'Easy',
        status: 'completed',
        lastStudied: '05 Sep 2026',
      },
      {
        id: 's3',
        title: 'Longest Subarray with Sum K',
        topic: 'Sliding Window',
        difficulty: 'Medium',
        status: 'in-progress',
        lastStudied: '04 Sep 2026',
      },
      {
        id: 's4',
        title: '3Sum',
        topic: 'Two Pointers',
        difficulty: 'Medium',
        status: 'not-started',
        lastStudied: null,
      },
      {
        id: 's5',
        title: 'Trapping Rain Water',
        topic: 'Arrays',
        difficulty: 'Hard',
        status: 'not-started',
        lastStudied: null,
      },
      {
        id: 's6',
        title: 'Binary Tree Level Order Traversal',
        topic: 'Trees',
        difficulty: 'Medium',
        status: 'not-started',
        lastStudied: null,
      },
    ],
  },
  {
    id: 'abdul-bari',
    name: 'Abdul Bari DSA',
    shortName: 'ABDUL BARI',
    type: 'Theory topics',
    tone: 'secondary',
    items: [
      {
        id: 'a1',
        title: 'Time and Space Complexity',
        topic: 'Foundations',
        status: 'completed',
        lastStudied: '03 Sep 2026',
      },
      {
        id: 'a2',
        title: 'Arrays and Linked Lists',
        topic: 'Linear structures',
        status: 'completed',
        lastStudied: '02 Sep 2026',
      },
      {
        id: 'a3',
        title: 'Stacks and Queues',
        topic: 'Linear structures',
        status: 'in-progress',
        lastStudied: '01 Sep 2026',
      },
      {
        id: 'a4',
        title: 'Trees and Binary Search Trees',
        topic: 'Non-linear structures',
        status: 'not-started',
        lastStudied: null,
      },
      {
        id: 'a5',
        title: 'Graphs',
        topic: 'Non-linear structures',
        status: 'not-started',
        lastStudied: null,
      },
    ],
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    shortName: 'JAVASCRIPT',
    type: 'Modules',
    tone: 'tertiary',
    items: [
      {
        id: 'j1',
        title: 'Language fundamentals',
        topic: 'Core language',
        status: 'completed',
        lastStudied: '30 Aug 2026',
      },
      {
        id: 'j2',
        title: 'Functions and closures',
        topic: 'Core language',
        status: 'completed',
        lastStudied: '29 Aug 2026',
      },
      {
        id: 'j3',
        title: 'Async JavaScript',
        topic: 'Browser and async',
        status: 'in-progress',
        lastStudied: '05 Sep 2026',
      },
      {
        id: 'j4',
        title: 'DOM and browser APIs',
        topic: 'Browser and async',
        status: 'not-started',
        lastStudied: null,
      },
      {
        id: 'j5',
        title: 'Testing JavaScript',
        topic: 'Engineering',
        status: 'not-started',
        lastStudied: null,
      },
    ],
  },
  {
    id: 'react',
    name: 'React',
    shortName: 'REACT',
    type: 'Modules',
    tone: 'primary',
    items: [
      {
        id: 'r1',
        title: 'Components and JSX',
        topic: 'Foundations',
        status: 'completed',
        lastStudied: '28 Aug 2026',
      },
      {
        id: 'r2',
        title: 'State and effects',
        topic: 'Core React',
        status: 'in-progress',
        lastStudied: '05 Sep 2026',
      },
      {
        id: 'r3',
        title: 'Forms and data flow',
        topic: 'Core React',
        status: 'not-started',
        lastStudied: null,
      },
      {
        id: 'r4',
        title: 'Performance and patterns',
        topic: 'Advanced React',
        status: 'not-started',
        lastStudied: null,
      },
    ],
  },
  {
    id: 'java-full-stack',
    name: 'Java Full Stack',
    shortName: 'JAVA FULL STACK',
    type: 'Modules',
    tone: 'secondary',
    items: [
      {
        id: 'f1',
        title: 'Java foundations',
        topic: 'Java',
        status: 'completed',
        lastStudied: '25 Aug 2026',
      },
      {
        id: 'f2',
        title: 'Spring Boot fundamentals',
        topic: 'Backend',
        status: 'in-progress',
        lastStudied: '04 Sep 2026',
      },
      {
        id: 'f3',
        title: 'REST APIs and validation',
        topic: 'Backend',
        status: 'not-started',
        lastStudied: null,
      },
      {
        id: 'f4',
        title: 'MongoDB integration',
        topic: 'Data',
        status: 'not-started',
        lastStudied: null,
      },
      {
        id: 'f5',
        title: 'Deployment and observability',
        topic: 'Production',
        status: 'not-started',
        lastStudied: null,
      },
    ],
  },
];

function statusLabel(status) {
  return status === 'in-progress'
    ? 'In Progress'
    : status === 'not-started'
      ? 'Not Started'
      : 'Completed';
}

function getResourceStats(resource) {
  const completed = resource.items.filter(
    (item) => item.status === 'completed'
  ).length;
  const inProgress = resource.items.filter(
    (item) => item.status === 'in-progress'
  ).length;
  const total = resource.items.length;
  return {
    total,
    completed,
    inProgress,
    remaining: total - completed,
    percentage: Math.round((completed / total) * 100),
  };
}

function ResourceCard({ resource, selected, onSelect }) {
  const stats = getResourceStats(resource);
  const current =
    resource.items.find((item) => item.status === 'in-progress') ||
    resource.items.find((item) => item.status === 'not-started');
  const lastStudied =
    [...resource.items].reverse().find((item) => item.lastStudied)
      ?.lastStudied || 'Not studied yet';
  return (
    <button
      className={`learning-resource-card ${selected ? 'is-selected' : ''}`}
      onClick={() => onSelect(resource.id)}
    >
      <div className="resource-card-top">
        <span className={`resource-icon resource-icon-${resource.tone}`}>
          <Layers3 size={17} />
        </span>
        <span className="resource-type mono">{resource.type}</span>
      </div>
      <div className="resource-card-title">
        <div>
          <span className="eyebrow">{resource.shortName}</span>
          <h3>{resource.name}</h3>
        </div>
        <span className="mono resource-percent">{stats.percentage}%</span>
      </div>
      <div className="resource-progress">
        <span
          className={`resource-fill ${resource.tone}`}
          style={{ width: `${stats.percentage}%` }}
        />
      </div>
      <div className="resource-card-stats">
        <span>
          <strong className="mono">{stats.completed}</strong> / {stats.total}{' '}
          complete
        </span>
        <span>{stats.remaining} left</span>
      </div>
      <div className="resource-card-detail">
        <span>
          <b>Current</b>
          {current?.title || 'Complete'}
        </span>
        <span>
          <b>Last studied</b>
          {lastStudied}
        </span>
      </div>
    </button>
  );
}

function ResourceDetail({ resource, filter, onFilterChange, onToggle }) {
  const filteredItems = resource.items.filter(
    (item) => filter === 'All' || statusLabel(item.status) === filter
  );
  const stats = getResourceStats(resource);
  const difficultyCounts = resource.items.reduce((counts, item) => {
    if (item.difficulty)
      counts[item.difficulty] = (counts[item.difficulty] || 0) + 1;
    return counts;
  }, {});
  return (
    <section className="learning-detail">
      <div className="learning-detail-heading">
        <div>
          <span className="eyebrow">Detailed view / {resource.type}</span>
          <h2>{resource.name}</h2>
          <p>
            {stats.completed} complete, {stats.remaining} remaining{' '}
            <span className="learning-detail-date">
              Last studied:{' '}
              {resource.items.find((item) => item.status === 'in-progress')
                ?.lastStudied || 'Not studied yet'}
            </span>
          </p>
        </div>
        <div className="learning-detail-score">
          <strong className="mono">{stats.percentage}%</strong>
          <span>complete</span>
        </div>
      </div>
      <div className="learning-detail-toolbar">
        <div
          className="learning-filters"
          role="group"
          aria-label="Filter learning items"
        >
          {filters.map((option) => (
            <button
              className={filter === option ? 'is-active' : ''}
              key={option}
              onClick={() => onFilterChange(option)}
            >
              <Filter size={12} />
              {option}
            </button>
          ))}
        </div>
        {Object.keys(difficultyCounts).length > 0 && (
          <div className="difficulty-summary">
            {Object.entries(difficultyCounts).map(([difficulty, count]) => (
              <span key={difficulty}>
                <i
                  className={`difficulty-dot difficulty-${difficulty.toLowerCase()}`}
                />
                {difficulty} {count}
              </span>
            ))}
          </div>
        )}
      </div>
      <div className="learning-item-list">
        {filteredItems.map((item) => (
          <article
            className={`learning-item learning-item-${item.status}`}
            key={item.id}
          >
            <button
              className="learning-item-check"
              onClick={() => onToggle(resource.id, item.id)}
              aria-label={`${item.status === 'completed' ? 'Mark' : 'Complete'} ${item.title}`}
            >
              {item.status === 'completed' ? (
                <Check size={14} />
              ) : item.status === 'in-progress' ? (
                <Play size={11} />
              ) : (
                <Circle size={13} />
              )}
            </button>
            <div className="learning-item-copy">
              <div>
                <strong>{item.title}</strong>
                <span className="learning-item-status">
                  {statusLabel(item.status)}
                </span>
              </div>
              <span className="learning-item-meta">
                {item.topic}
                {item.difficulty && ` · ${item.difficulty}`}
              </span>
            </div>
            <span className="learning-item-date mono">
              {item.lastStudied || 'Not started'}
            </span>
          </article>
        ))}
        {filteredItems.length === 0 && (
          <div className="learning-no-results">
            <RotateCcw size={17} />
            <span>No items in this filter.</span>
          </div>
        )}
      </div>
    </section>
  );
}

function ContinueLearning({ resources, onSelect }) {
  const nextItems = resources
    .map((resource) => {
      const item =
        resource.items.find((entry) => entry.status === 'in-progress') ||
        resource.items.find((entry) => entry.status === 'not-started');
      return item ? { resource, item } : null;
    })
    .filter(Boolean);
  const next = nextItems[0];
  return (
    <section className="continue-learning">
      <div className="continue-heading">
        <div>
          <span className="eyebrow">Continue learning</span>
          <h2>One next useful step</h2>
        </div>
        <Trophy size={19} />
      </div>
      {next ? (
        <button
          className="continue-card"
          onClick={() => onSelect(next.resource.id)}
        >
          <span className="continue-icon">
            <Play size={16} />
          </span>
          <span>
            <b>{next.item.title}</b>
            <small>
              {next.resource.name} · {next.item.topic}
            </small>
          </span>
          <ArrowRight size={16} />
        </button>
      ) : (
        <p>Every learning item is complete.</p>
      )}
    </section>
  );
}

function LearningProgress() {
  const [resources, setResources] = useState(resourceSeed);
  const [selectedId, setSelectedId] = useState(resourceSeed[0].id);
  const [filter, setFilter] = useState('All');
  const selectedResource =
    resources.find((resource) => resource.id === selectedId) || resources[0];
  const overall = useMemo(() => {
    const allItems = resources.flatMap((resource) => resource.items);
    const completed = allItems.filter(
      (item) => item.status === 'completed'
    ).length;
    return Math.round((completed / allItems.length) * 100);
  }, [resources]);

  const toggleItem = (resourceId, itemId) =>
    setResources((current) =>
      current.map((resource) =>
        resource.id === resourceId
          ? {
              ...resource,
              items: resource.items.map((item) =>
                item.id === itemId
                  ? {
                      ...item,
                      status:
                        item.status === 'completed'
                          ? 'in-progress'
                          : 'completed',
                      lastStudied:
                        item.status === 'completed'
                          ? item.lastStudied
                          : '08 Sep 2026',
                    }
                  : item
              ),
            }
          : resource
      )
    );
  const selectResource = (id) => {
    setSelectedId(id);
    setFilter('All');
  };

  return (
    <div className="learning-page">
      <div className="breadcrumb" aria-label="Breadcrumb">
        <NavLink to="/dashboard">Workspace</NavLink>
        <ChevronRight size={13} />
        <span>Learning</span>
      </div>
      <section className="learning-header">
        <div>
          <span className="eyebrow">Knowledge system / local snapshot</span>
          <h2>Build the skill stack that gets you hired.</h2>
          <p>
            Five tracks, one clear view of what is done and what comes next.
          </p>
        </div>
        <div className="learning-overall">
          <span className="eyebrow">Overall progress</span>
          <strong className="mono">{overall}%</strong>
          <div className="learning-overall-track">
            <span style={{ width: `${overall}%` }} />
          </div>
        </div>
      </section>
      <ContinueLearning resources={resources} onSelect={selectResource} />
      <section>
        <div className="learning-section-heading">
          <div>
            <span className="eyebrow">Learning progress</span>
            <h2>Your tracks</h2>
          </div>
          <span className="mono learning-track-count">
            {resources.length} resources
          </span>
        </div>
        <div className="learning-resource-grid">
          {resources.map((resource) => (
            <ResourceCard
              resource={resource}
              selected={resource.id === selectedId}
              onSelect={selectResource}
              key={resource.id}
            />
          ))}
        </div>
      </section>
      <ResourceDetail
        resource={selectedResource}
        filter={filter}
        onFilterChange={setFilter}
        onToggle={toggleItem}
      />
    </div>
  );
}

export default LearningProgress;
