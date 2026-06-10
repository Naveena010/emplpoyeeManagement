import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token    = localStorage.getItem('token');
    const role     = localStorage.getItem('role');
    const username = localStorage.getItem('username');
    return token ? { token, role, username } : null;
  });

  const loginUser = (data) => {
    localStorage.setItem('token',    data.token);
    localStorage.setItem('role',     data.role);
    localStorage.setItem('username', data.username);
    setUser(data);
  };

  const logoutUser = () => { localStorage.clear(); setUser(null); };

  const isAdmin = user?.role === 'ROLE_ADMIN';

  return (
    <AuthContext.Provider value={{ user, loginUser, logoutUser, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);