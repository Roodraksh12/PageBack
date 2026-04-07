import { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Mail, Lock, User, LogIn, UserPlus } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthModal({ isOpen, onClose, mode: initialMode = 'login' }) {
  const { login, register, loginWithGoogle } = useAuth();
  const [mode, setMode] = useState(initialMode); // 'login' or 'register'
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    setError('');
    try {
      await loginWithGoogle();
      onClose();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (mode === 'login') {
        await login(form.email, form.password);
        onClose();
      } else {
        if (form.password !== form.confirm) throw new Error('Passwords do not match');
        if (form.password.length < 6) throw new Error('Password must be at least 6 characters');
        await register(form.name, form.email, form.password);
        onClose();
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-forest-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-full max-w-md max-h-[95vh] overflow-y-auto bg-cream-50 dark:bg-forest-900 flex flex-col rounded-3xl shadow-warm border border-cream-200 dark:border-forest-700 animate-fade-in">
        <button onClick={onClose} className="absolute top-4 right-4 text-forest-500 hover:text-forest-800 dark:text-cream-400 dark:hover:text-cream-100 z-10 transition-colors">
          <X size={20} />
        </button>

        <div className="p-8">
          <h2 className="font-display font-bold text-3xl text-forest-800 dark:text-cream-100 mb-2">
            {mode === 'login' ? 'Welcome Back' : 'Join PageBack'}
          </h2>
          <p className="text-forest-500 dark:text-cream-400 text-sm mb-6">
            {mode === 'login' ? 'Log in to continue your reading journey.' : 'Create an account to track orders and sell books.'}
          </p>

          {/* Social Auth */}
          <button onClick={handleGoogleLogin} className="w-full flex items-center justify-center gap-3 bg-white dark:bg-forest-800 border border-cream-200 dark:border-forest-600 rounded-xl px-4 py-3 text-sm font-medium text-forest-800 dark:text-cream-100 hover:shadow-sm transition-all mb-6">
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-4 mb-6">
            <div className="h-px flex-1 bg-cream-200 dark:bg-forest-700" />
            <span className="text-xs font-medium text-forest-400 dark:text-cream-500 uppercase tracking-wider">OR</span>
            <div className="h-px flex-1 bg-cream-200 dark:bg-forest-700" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/50 rounded-xl text-sm text-red-600 dark:text-red-400">
                {error}
              </div>
            )}

            {mode === 'register' && (
              <div className="relative">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-forest-400" />
                <input
                  type="text" required placeholder="Full Name"
                  value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-cream-300 dark:border-forest-600 bg-white dark:bg-forest-800 text-forest-800 dark:text-cream-100 placeholder-forest-300 dark:placeholder-forest-500 focus:outline-none focus:ring-2 focus:ring-forest-400 text-sm"
                />
              </div>
            )}

            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-forest-400" />
              <input
                type="email" required placeholder="Email Address"
                value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-cream-300 dark:border-forest-600 bg-white dark:bg-forest-800 text-forest-800 dark:text-cream-100 placeholder-forest-300 dark:placeholder-forest-500 focus:outline-none focus:ring-2 focus:ring-forest-400 text-sm"
              />
            </div>

            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-forest-400" />
              <input
                type="password" required placeholder="Password"
                value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-cream-300 dark:border-forest-600 bg-white dark:bg-forest-800 text-forest-800 dark:text-cream-100 placeholder-forest-300 dark:placeholder-forest-500 focus:outline-none focus:ring-2 focus:ring-forest-400 text-sm"
              />
            </div>

            {mode === 'register' && (
              <div className="relative">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-forest-400" />
                <input
                  type="password" required placeholder="Confirm Password"
                  value={form.confirm} onChange={e => setForm(p => ({ ...p, confirm: e.target.value }))}
                  className="w-full pl-12 pr-4 py-3 rounded-xl border border-cream-300 dark:border-forest-600 bg-white dark:bg-forest-800 text-forest-800 dark:text-cream-100 placeholder-forest-300 dark:placeholder-forest-500 focus:outline-none focus:ring-2 focus:ring-forest-400 text-sm"
                />
              </div>
            )}

            <button type="submit" className="w-full btn-primary flex justify-center items-center gap-2 py-3 mt-2">
              {mode === 'login' ? <><LogIn size={18} /> Log In</> : <><UserPlus size={18} /> Create Account</>}
            </button>
          </form>

          <p className="text-center text-sm text-forest-500 dark:text-cream-400 mt-6">
            {mode === 'login' ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}
              className="text-amber-500 font-semibold hover:underline"
            >
              {mode === 'login' ? 'Sign up' : 'Log in'}
            </button>
          </p>

        </div>
      </div>
    </div>,
    document.body
  );
}
