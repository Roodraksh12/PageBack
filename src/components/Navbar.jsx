import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ShoppingCart, Sun, Moon, Menu, X, BookOpen } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { darkMode, toggleDark } = useTheme();
  const { cartCount, setCartOpen } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  const links = [
    { to: '/',       label: 'Home'   },
    { to: '/buy',    label: 'Browse' },
    { to: '/sell',   label: 'Sell'   },
    { to: '/orders', label: 'Orders' },
    { to: '/about',  label: 'About'  },
  ];

  return (
    <header className="sticky top-0 z-50 bg-cream-100/90 dark:bg-forest-900/90 backdrop-blur-md border-b border-cream-200 dark:border-forest-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-forest-700 flex items-center justify-center group-hover:bg-amber-500 transition-colors duration-200">
            <BookOpen size={20} className="text-white" />
          </div>
          <span className="font-display font-bold text-xl text-forest-700 dark:text-cream-100">
            Page<span className="text-amber-500">Back</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map(l => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              className={({ isActive }) =>
                `px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-forest-700 text-white dark:bg-forest-600'
                    : 'text-forest-600 dark:text-cream-300 hover:bg-cream-200 dark:hover:bg-forest-800'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleDark}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-forest-600 dark:text-cream-300 hover:bg-cream-200 dark:hover:bg-forest-800 transition-colors"
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          <button
            onClick={() => setCartOpen(true)}
            className="relative w-9 h-9 rounded-lg flex items-center justify-center text-forest-600 dark:text-cream-300 hover:bg-cream-200 dark:hover:bg-forest-800 transition-colors"
            aria-label="Open cart"
          >
            <ShoppingCart size={18} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </button>

          <Link to="/sell" className="hidden md:block btn-amber text-sm py-2 px-4">
            Sell Books
          </Link>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden w-9 h-9 rounded-lg flex items-center justify-center text-forest-600 dark:text-cream-300"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="md:hidden bg-cream-100 dark:bg-forest-900 border-t border-cream-200 dark:border-forest-700 px-4 py-4 flex flex-col gap-1 animate-fade-in">
          {links.map(l => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === '/'}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-forest-700 text-white'
                    : 'text-forest-600 dark:text-cream-300 hover:bg-cream-200 dark:hover:bg-forest-800'
                }`
              }
            >
              {l.label}
            </NavLink>
          ))}
          <Link to="/sell" onClick={() => setMenuOpen(false)} className="btn-amber text-sm text-center mt-2">
            Sell Books
          </Link>
        </div>
      )}
    </header>
  );
}
