import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from './useAuth';

export default function ProtectedRoute() {
  const { status } = useAuth();
  const location = useLocation();
  if (status === 'loading')
    return (
      <main
        style={{
          minHeight: '100vh',
          display: 'grid',
          placeItems: 'center',
          background: 'var(--background)',
        }}
      >
        <span className="mono muted">CHECKING SESSION...</span>
      </main>
    );
  if (status !== 'authenticated')
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return <Outlet />;
}
