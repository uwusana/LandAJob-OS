import { useEffect, useState } from 'react';
import { authRequest } from './api';
import { AuthContext } from './auth-context-value';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('loading');

  useEffect(() => {
    authRequest('/auth/me')
      .then(({ user: authenticatedUser }) => {
        setUser(authenticatedUser);
        setStatus('authenticated');
      })
      .catch(() => setStatus('unauthenticated'));
  }, []);

  const login = async (credentials) => {
    const result = await authRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    setUser(result.user);
    setStatus('authenticated');
    return result.user;
  };

  const register = async (details) => {
    const result = await authRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify(details),
    });
    setUser(result.user);
    setStatus('authenticated');
    return result.user;
  };

  const logout = async () => {
    await authRequest('/auth/logout', { method: 'POST' }).catch(
      () => undefined
    );
    setUser(null);
    setStatus('unauthenticated');
  };

  return (
    <AuthContext.Provider value={{ user, status, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
