import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// Simple hash — demo only, not production-secure
const hashPw = (pw) => {
  let h = 0;
  for (let i = 0; i < pw.length; i++) { h = Math.imul(31, h) + pw.charCodeAt(i) | 0; }
  return h.toString(36);
};

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('pb_session')); }
    catch { return null; }
  });

  useEffect(() => {
    if (currentUser) localStorage.setItem('pb_session', JSON.stringify(currentUser));
    else localStorage.removeItem('pb_session');
  }, [currentUser]);

  const getUsers = () => {
    try { return JSON.parse(localStorage.getItem('pb_users')) || []; }
    catch { return []; }
  };

  const register = (name, email, password) => {
    const users = getUsers();
    if (users.find(u => u.email.toLowerCase() === email.toLowerCase()))
      throw new Error('An account with this email already exists');
    const u = {
      id: `u_${Date.now()}`,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      pwHash: hashPw(password),
      avatar: name.trim().split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2),
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem('pb_users', JSON.stringify([...users, u]));
    const session = { id: u.id, name: u.name, email: u.email, avatar: u.avatar };
    setCurrentUser(session);
    return session;
  };

  const login = (email, password) => {
    const users = getUsers();
    const u = users.find(x => x.email.toLowerCase() === email.toLowerCase().trim());
    if (!u) throw new Error('No account found with this email');
    if (u.pwHash !== hashPw(password)) throw new Error('Incorrect password');
    const session = { id: u.id, name: u.name, email: u.email, avatar: u.avatar };
    setCurrentUser(session);
    return session;
  };

  const logout = () => setCurrentUser(null);

  return (
    <AuthContext.Provider value={{ currentUser, isLoggedIn: !!currentUser, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
