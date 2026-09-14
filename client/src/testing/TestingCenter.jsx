import { useState } from 'react';
import {
  ArrowRight,
  BarChart3,
  CalendarCheck2,
  ChevronRight,
  Filter,
  LineChart as LineChartIcon,
  Plus,
  Save,
  Target,
  Trophy,
  X,
} from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { NavLink } from 'react-router-dom';

const subjects = [
  'DSA',
  'JavaScript',
  'React',
  'Java',
  'Java Full Stack',
  'CS Fundamentals',
  'Aptitude',
];
const difficulties = ['Easy', 'Medium', 'Hard'];
const rotationConfig = {
  anchorDate: '2026-09-06',
  subjects,
};
const initialTests = [
  {
    id: 1,
    subject: 'JavaScript',
    testDate: '2026-09-06',
    score: 43,
    maximumScore: 50,
    duration: 42,
    difficulty: 'Medium',
    topics: 'Async JavaScript, closures',
    mistakes: 'Event loop ordering',
    notes: 'Review microtasks before the next attempt.',
  },
  {
    id: 2,
    subject: 'React',
    testDate: '2026-09-04',
    score: 36,
    maximumScore: 50,
    duration: 38,
    difficulty: 'Medium',
    topics: 'Components, state, effects',
    mistakes: 'Effect dependencies',
    notes: '',
  },
  {
    id: 3,
    subject: 'DSA',
    testDate: '2026-09-02',
    score: 41,
    maximumScore: 50,
    duration: 55,
    difficulty: 'Hard',
    topics: 'Arrays, sliding window',
    mistakes: 'Complexity analysis',
    notes: 'Slow down before coding.',
  },
  {
    id: 4,
    subject: 'Java Full Stack',
    testDate: '2026-08-31',
    score: 32,
    maximumScore: 50,
    duration: 48,
    difficulty: 'Medium',
    topics: 'Spring Boot, REST',
    mistakes: 'Validation flow',
    notes: '',
  },
  {
    id: 5,
    subject: 'DSA',
    testDate: '2026-08-29',
    score: 38,
    maximumScore: 50,
    duration: 51,
    difficulty: 'Medium',
    topics: 'Trees, recursion',
    mistakes: 'Base cases',
    notes: '',
  },
  {
    id: 6,
    subject: 'JavaScript',
    testDate: '2026-08-27',
    score: 39,
    maximumScore: 50,
    duration: 44,
    difficulty: 'Easy',
    topics: 'Functions, prototypes',
    mistakes: 'Prototype chain',
    notes: '',
  },
  {
    id: 7,
    subject: 'React',
    testDate: '2026-08-25',
    score: 34,
    maximumScore: 50,
    duration: 41,
    difficulty: 'Easy',
    topics: 'JSX, props',
    mistakes: 'Data flow',
    notes: '',
  },
];

function toDateKey(date) {
  return date.toISOString().slice(0, 10);
}

function formatDate(dateKey) {
  return new Intl.DateTimeFormat('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(`${dateKey}T12:00:00`));
}

function differenceInDays(first, second) {
  const firstDate = new Date(`${first}T12:00:00`);
  const secondDate = new Date(`${second}T12:00:00`);
  return Math.round((secondDate - firstDate) / 86400000);
}

function percentageFor(test) {
  return test.maximumScore
    ? Math.round((test.score / test.maximumScore) * 100)
    : 0;
}

function scoreAverage(tests) {
  if (!tests.length) return 0;
  return Math.round(
    tests.reduce((sum, test) => sum + percentageFor(test), 0) / tests.length
  );
}

function TestEntryModal({ onSave, onClose }) {
  const [draft, setDraft] = useState({
    subject: 'DSA',
    testDate: toDateKey(new Date()),
    score: '',
    maximumScore: 50,
    duration: 45,
    difficulty: 'Medium',
    topics: '',
    mistakes: '',
    notes: '',
  });
  const update = (key, value) =>
    setDraft((current) => ({ ...current, [key]: value }));
  const submit = (event) => {
    event.preventDefault();
    if (draft.score === '' || !draft.maximumScore) return;
    onSave({
      ...draft,
      score: Number(draft.score),
      maximumScore: Number(draft.maximumScore),
      duration: Number(draft.duration) || 0,
      id: Date.now(),
    });
  };
  return (
    <div
      className="testing-modal-backdrop"
      role="presentation"
      onClick={onClose}
    >
      <form
        className="testing-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="test-entry-title"
        onClick={(event) => event.stopPropagation()}
        onSubmit={submit}
      >
        <div className="testing-modal-header">
          <div>
            <span className="eyebrow">New record</span>
            <h2 id="test-entry-title">Log a test attempt</h2>
          </div>
          <button
            type="button"
            className="icon-button"
            aria-label="Close test entry"
            onClick={onClose}
          >
            <X size={17} />
          </button>
        </div>
        <div className="testing-form-row">
          <label className="testing-field">
            <span>Subject</span>
            <select
              value={draft.subject}
              onChange={(event) => update('subject', event.target.value)}
            >
              {subjects.map((subject) => (
                <option key={subject}>{subject}</option>
              ))}
            </select>
          </label>
          <label className="testing-field">
            <span>Test date</span>
            <input
              type="date"
              value={draft.testDate}
              onChange={(event) => update('testDate', event.target.value)}
            />
          </label>
        </div>
        <div className="testing-form-row">
          <label className="testing-field">
            <span>Score</span>
            <input
              required
              type="number"
              min="0"
              value={draft.score}
              onChange={(event) => update('score', event.target.value)}
              placeholder="42"
            />
          </label>
          <label className="testing-field">
            <span>Maximum score</span>
            <input
              required
              type="number"
              min="1"
              value={draft.maximumScore}
              onChange={(event) => update('maximumScore', event.target.value)}
            />
          </label>
        </div>
        <div className="testing-form-row">
          <label className="testing-field">
            <span>Duration / minutes</span>
            <input
              type="number"
              min="0"
              value={draft.duration}
              onChange={(event) => update('duration', event.target.value)}
            />
          </label>
          <label className="testing-field">
            <span>Difficulty</span>
            <select
              value={draft.difficulty}
              onChange={(event) => update('difficulty', event.target.value)}
            >
              {difficulties.map((difficulty) => (
                <option key={difficulty}>{difficulty}</option>
              ))}
            </select>
          </label>
        </div>
        <label className="testing-field">
          <span>Topics tested</span>
          <input
            value={draft.topics}
            onChange={(event) => update('topics', event.target.value)}
            placeholder="Arrays, recursion, hooks..."
          />
        </label>
        <label className="testing-field">
          <span>Mistakes</span>
          <textarea
            value={draft.mistakes}
            onChange={(event) => update('mistakes', event.target.value)}
            placeholder="What should be reviewed?"
          />
        </label>
        <label className="testing-field">
          <span>Notes</span>
          <textarea
            value={draft.notes}
            onChange={(event) => update('notes', event.target.value)}
            placeholder="Optional reflection"
          />
        </label>
        <div className="testing-modal-actions">
          <button
            type="button"
            className="button button-quiet"
            onClick={onClose}
          >
            Cancel
          </button>
          <button type="submit" className="button button-primary">
            <Save size={15} />
            Save test
          </button>
        </div>
      </form>
    </div>
  );
}

function MetricCard({ label, value, detail, icon: Icon }) {
  return (
    <div className="testing-metric">
      <span className="testing-metric-icon">
        <Icon size={16} />
      </span>
      <span className="eyebrow">{label}</span>
      <strong className="mono">{value}</strong>
      <small>{detail}</small>
    </div>
  );
}

function TestingCenter() {
  const [tests, setTests] = useState(initialTests);
  const [subjectFilter, setSubjectFilter] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const todayKey = toDateKey(new Date());
  const dayOffset = differenceInDays(rotationConfig.anchorDate, todayKey);
  const isTestDay =
    dayOffset >= 0 ? dayOffset % 2 === 0 : Math.abs(dayOffset) % 2 === 0;
  const completedTests = [...tests].sort((a, b) =>
    b.testDate.localeCompare(a.testDate)
  );
  const latest = completedTests[0];
  const nextTestDate = new Date(`${todayKey}T12:00:00`);
  if (!isTestDay) nextTestDate.setDate(nextTestDate.getDate() + 1);
  const scheduledDate = toDateKey(nextTestDate);
  const anchorIndex = Math.max(0, Math.floor(Math.max(dayOffset, 0) / 2));
  const nextSubject =
    rotationConfig.subjects[anchorIndex % rotationConfig.subjects.length];
  const overallAverage = scoreAverage(tests);
  const sevenTestAverage = scoreAverage(completedTests.slice(0, 7));
  const bestScore = tests.length ? Math.max(...tests.map(percentageFor)) : 0;
  const worstScore = tests.length ? Math.min(...tests.map(percentageFor)) : 0;
  const recentTrend = completedTests
    .slice(0, 7)
    .reverse()
    .map((test) => ({
      date: new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: 'short',
      }).format(new Date(`${test.testDate}T12:00:00`)),
      score: percentageFor(test),
    }));
  const subjectPerformance = subjects
    .map((subject) => {
      const records = tests.filter((test) => test.subject === subject);
      return {
        subject:
          subject === 'Java Full Stack'
            ? 'Full Stack'
            : subject === 'CS Fundamentals'
              ? 'CS'
              : subject,
        score: scoreAverage(records),
        count: records.length,
      };
    })
    .filter((entry) => entry.count);
  const strongest = subjectPerformance.length
    ? [...subjectPerformance].sort((a, b) => b.score - a.score)[0]
    : null;
  const weakest = subjectPerformance.length
    ? [...subjectPerformance].sort((a, b) => a.score - b.score)[0]
    : null;
  const filteredTests =
    subjectFilter === 'All'
      ? completedTests
      : completedTests.filter((test) => test.subject === subjectFilter);
  const addTest = (test) => {
    setTests((current) => [...current, test]);
    setModalOpen(false);
  };

  return (
    <div className="testing-page">
      <div className="breadcrumb" aria-label="Breadcrumb">
        <NavLink to="/dashboard">Workspace</NavLink>
        <ChevronRight size={13} />
        <span>Tests</span>
      </div>
      <section className="testing-header">
        <div>
          <span className="eyebrow">
            Every-other-day practice / local records
          </span>
          <h2>Turn every test into a better next attempt.</h2>
          <p>Rotation and performance are calculated from your test history.</p>
        </div>
        <button
          className="button button-primary"
          onClick={() => setModalOpen(true)}
        >
          <Plus size={16} />
          Log test
        </button>
      </section>
      <section className="testing-status">
        <div className={`testing-day-badge ${isTestDay ? 'is-test-day' : ''}`}>
          <span className="testing-status-dot" />
          <span className="eyebrow">Today is</span>
          <strong>{isTestDay ? 'TEST DAY' : 'LEARNING DAY'}</strong>
          <small>
            {isTestDay
              ? `Prepare for ${nextSubject}`
              : 'Build the next layer before testing.'}
          </small>
        </div>
        <div className="testing-next">
          <span className="eyebrow">Next scheduled test</span>
          <strong className="mono">{formatDate(scheduledDate)}</strong>
          <span>{nextSubject} · every other day</span>
        </div>
        <div className="testing-status-action">
          <button
            className="button button-outline"
            onClick={() => setModalOpen(true)}
          >
            {isTestDay ? "Record today's result" : 'Log a past result'}{' '}
            <ArrowRight size={14} />
          </button>
        </div>
      </section>
      <section className="testing-metrics">
        <MetricCard
          label="Latest score"
          value={latest ? `${percentageFor(latest)}%` : '—'}
          detail={
            latest
              ? `${latest.subject} · ${formatDate(latest.testDate)}`
              : 'No records yet'
          }
          icon={Target}
        />
        <MetricCard
          label="Average score"
          value={`${overallAverage}%`}
          detail={`${tests.length} tests recorded`}
          icon={BarChart3}
        />
        <MetricCard
          label="Highest score"
          value={`${bestScore}%`}
          detail={bestScore ? 'Best recorded percentage' : 'No records yet'}
          icon={Trophy}
        />
        <MetricCard
          label="7-test average"
          value={`${sevenTestAverage}%`}
          detail={
            tests.length < 7
              ? `${7 - tests.length} more tests to fill`
              : 'Recent performance'
          }
          icon={LineChartIcon}
        />
      </section>
      <div className="testing-chart-grid">
        <section className="testing-panel">
          <div className="testing-panel-heading">
            <div>
              <span className="eyebrow">Recent performance</span>
              <h2>Score over time</h2>
            </div>
            <span className="mono">{tests.length} attempts</span>
          </div>
          <div className="testing-chart">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={recentTrend}>
                <defs>
                  <linearGradient
                    id="testScoreFill"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="var(--primary)"
                      stopOpacity=".25"
                    />
                    <stop
                      offset="100%"
                      stopColor="var(--primary)"
                      stopOpacity="0"
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="var(--border)" />
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'var(--text-muted)', fontSize: 10 }}
                />
                <YAxis
                  domain={[0, 100]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'var(--text-muted)', fontSize: 10 }}
                />
                <Tooltip
                  contentStyle={{
                    background: 'var(--surface-raised)',
                    border: '1px solid var(--border)',
                    borderRadius: 3,
                    fontFamily: 'var(--mono)',
                    fontSize: 10,
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="var(--primary)"
                  fill="url(#testScoreFill)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>
        <section className="testing-panel">
          <div className="testing-panel-heading">
            <div>
              <span className="eyebrow">By subject</span>
              <h2>Average score</h2>
            </div>
            <span className="mono">{subjectPerformance.length} subjects</span>
          </div>
          <div className="testing-chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={subjectPerformance}
                layout="vertical"
                margin={{ left: 0, right: 12 }}
              >
                <XAxis type="number" domain={[0, 100]} hide />
                <YAxis
                  type="category"
                  dataKey="subject"
                  width={75}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'var(--text-muted)', fontSize: 10 }}
                />
                <Tooltip
                  contentStyle={{
                    background: 'var(--surface-raised)',
                    border: '1px solid var(--border)',
                    borderRadius: 3,
                    fontFamily: 'var(--mono)',
                    fontSize: 10,
                  }}
                />
                <Bar
                  dataKey="score"
                  fill="var(--primary)"
                  barSize={10}
                  radius={[0, 2, 2, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
      <section className="testing-insights">
        <div>
          <span className="eyebrow">Strongest subject</span>
          <strong>{strongest?.subject || '—'}</strong>
          <span>
            {strongest
              ? `${strongest.score}% average`
              : 'Record a test to see this.'}
          </span>
        </div>
        <div>
          <span className="eyebrow">Weakest subject</span>
          <strong>{weakest?.subject || '—'}</strong>
          <span>
            {weakest
              ? `${weakest.score}% average`
              : 'Record a test to see this.'}
          </span>
        </div>
        <div>
          <span className="eyebrow">Score range</span>
          <strong className="mono">
            {bestScore || '—'} → {worstScore || '—'}
          </strong>
          <span>Best to lowest recorded</span>
        </div>
      </section>
      <section className="testing-history">
        <div className="testing-panel-heading">
          <div>
            <span className="eyebrow">Test history</span>
            <h2>Every attempt, kept visible</h2>
          </div>
          <label className="testing-filter">
            <Filter size={13} />
            <select
              value={subjectFilter}
              onChange={(event) => setSubjectFilter(event.target.value)}
            >
              <option>All</option>
              {subjects.map((subject) => (
                <option key={subject}>{subject}</option>
              ))}
            </select>
          </label>
        </div>
        <div className="testing-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Subject</th>
                <th>Score</th>
                <th>Percentage</th>
                <th>Duration</th>
                <th>Difficulty</th>
              </tr>
            </thead>
            <tbody>
              {filteredTests.map((test) => (
                <tr key={test.id}>
                  <td className="mono">{formatDate(test.testDate)}</td>
                  <td>{test.subject}</td>
                  <td className="mono">
                    {test.score}/{test.maximumScore}
                  </td>
                  <td>
                    <strong className="testing-table-percent">
                      {percentageFor(test)}%
                    </strong>
                  </td>
                  <td className="mono">{test.duration}m</td>
                  <td>
                    <span
                      className={`testing-difficulty difficulty-${test.difficulty.toLowerCase()}`}
                    >
                      {test.difficulty}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredTests.length === 0 && (
            <div className="testing-empty">
              <CalendarCheck2 size={18} />
              <span>No test records for this subject yet.</span>
            </div>
          )}
        </div>
      </section>
      {modalOpen && (
        <TestEntryModal onSave={addTest} onClose={() => setModalOpen(false)} />
      )}
    </div>
  );
}

export default TestingCenter;
