import { useState, useEffect } from 'react';
import { parseCookies } from 'nookies';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cookies = parseCookies();
    const token = cookies.token;
    const role = cookies.role;

    if (token) {
      setUser({ token, role });
    } else {
      setUser(null);
    }
    setLoading(false);
  }, []);

  const isAdmin = user?.role === 'admin';
  const isClient = user?.role === 'client';
  const isAuthenticated = !!user?.token;

  return { user, loading, isAdmin, isClient, isAuthenticated };
}