import { useState } from 'react';
import { ArrowRight, LockKeyhole, UserRound } from 'lucide-react';
import { Navigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from './useAuth';

function AuthLayout({ children, mode }) {
  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        padding: '28px 18px',
        background: 'var(--background)',
      }}
    >
      <section style={{ width: 'min(100%, 430px)' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginBottom: 34,
          }}
        >
          <div className="brand-mark">LJ</div>
          <div>
            <strong style={{ display: 'block', color: 'var(--text)' }}>
              Land a Job
            </strong>
            <span className="mono muted" style={{ fontSize: 9 }}>
              OS / secure access
            </span>
          </div>
        </div>
        <div className="card" style={{ padding: 25 }}>
          {children}
        </div>
        <p style={{ marginTop: 17, textAlign: 'center', fontSize: 12 }}>
          {mode === 'login' ? (
            <>
              New here? <Link to="/register">Create an account</Link>
            </>
          ) : (
            <>
              Already have an account? <Link to="/login">Sign in</Link>
            </>
          )}
        </p>
      </section>
    </main>
  );
}

function AuthForm({ mode }) {
  const { user, status, login, register } = useAuth();
  const location = useLocation();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  if (status === 'authenticated' && user)
    return <Navigate to={location.state?.from || '/dashboard'} replace />;
  const isLogin = mode === 'login';
  const update = (key, value) =>
    setForm((current) => ({ ...current, [key]: value }));
  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      if (isLogin) await login({ email: form.email, password: form.password });
      else await register(form);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <AuthLayout mode={mode}>
      <div style={{ marginBottom: 25 }}>
        <span className="eyebrow">
          {isLogin ? 'Welcome back' : 'Create your account'}
        </span>
        <h1 style={{ marginTop: 9, fontSize: 30 }}>
          {isLogin ? 'Return to the work.' : 'Make the work yours.'}
        </h1>
        <p style={{ margin: '9px 0 0', fontSize: 13 }}>
          {isLogin
            ? 'Your personal operating system is ready.'
            : 'Set up a private workspace for focused progress.'}
        </p>
      </div>
      <form onSubmit={submit} style={{ display: 'grid', gap: 14 }}>
        {!isLogin && (
          <label className="field-label">
            Name
            <input
              className="input"
              required
              minLength="2"
              value={form.name}
              onChange={(event) => update('name', event.target.value)}
              autoComplete="name"
              placeholder="Your name"
            />
          </label>
        )}
        <label className="field-label">
          Email
          <input
            className="input"
            required
            type="email"
            value={form.email}
            onChange={(event) => update('email', event.target.value)}
            autoComplete="email"
            placeholder="you@example.com"
          />
        </label>
        <label className="field-label">
          Password
          <input
            className="input"
            required
            minLength="8"
            type="password"
            value={form.password}
            onChange={(event) => update('password', event.target.value)}
            autoComplete={isLogin ? 'current-password' : 'new-password'}
            placeholder="At least 8 characters"
          />
        </label>
        {error && (
          <p
            role="alert"
            style={{ margin: 0, color: 'var(--warning)', fontSize: 12 }}
          >
            {error}
          </p>
        )}
        <button
          className="button button-primary"
          disabled={submitting}
          style={{ width: '100%', marginTop: 4 }}
        >
          {submitting ? 'Working...' : isLogin ? 'Sign in' : 'Create account'}
          <ArrowRight size={15} />
        </button>
      </form>
      <div
        style={{
          display: 'flex',
          gap: 16,
          marginTop: 22,
          color: 'var(--text-muted)',
          fontSize: 10,
        }}
      >
        <span>
          <LockKeyhole
            size={13}
            style={{ verticalAlign: 'middle', marginRight: 4 }}
          />
          Private session
        </span>
        <span>
          <UserRound
            size={13}
            style={{ verticalAlign: 'middle', marginRight: 4 }}
          />
          Personal workspace
        </span>
      </div>
    </AuthLayout>
  );
}

export function LoginPage() {
  return <AuthForm mode="login" />;
}

export function RegisterPage() {
  return <AuthForm mode="register" />;
}
