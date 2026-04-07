import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { ShoppingCart, BookOpen, LogOut, Package, User } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import AuthModal from './AuthModal';

export default function Navbar() {
  const { cartCount, setCartOpen } = useCart();
  const { currentUser, isLoggedIn, logout } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 flex items-center justify-center bg-forest-800 text-white rounded">
            <BookOpen size={20} />
          </div>
          <span className="font-bold text-xl tracking-tight text-forest-800 uppercase">
            Page<span className="font-light">Back</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-2">
          <NavLink
            to="/buy"
            className={({ isActive }) =>
              `px-4 py-2 text-xs uppercase tracking-widest font-bold transition-all duration-200 ${
                isActive
                  ? 'text-forest-800 border-b-2 border-forest-800'
                  : 'text-neutral-500 hover:text-forest-800'
              }`
            }
          >
            Browse
          </NavLink>
          <NavLink
            to="/sell"
            className={({ isActive }) =>
              `px-4 py-2 text-xs uppercase tracking-widest font-bold transition-all duration-200 ${
                isActive
                  ? 'text-forest-800 border-b-2 border-forest-800'
                  : 'text-neutral-500 hover:text-forest-800'
              }`
            }
          >
            Sell
          </NavLink>
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-4">
          {/* User Auth */}
          {isLoggedIn ? (
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="w-8 h-8 rounded-full bg-forest-100 text-forest-800 font-bold text-xs flex items-center justify-center border border-forest-200 transition-all hover:bg-forest-200"
              >
                {currentUser.avatar}
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 mt-3 w-48 bg-white border border-neutral-200 shadow-xl py-1 z-50 rounded-xl overflow-hidden">
                  <div className="px-4 py-3 border-b border-neutral-100 bg-neutral-50">
                    <p className="text-xs font-bold text-forest-800 truncate uppercase">{currentUser.name}</p>
                    <p className="text-[10px] text-neutral-500 truncate">{currentUser.email}</p>
                  </div>
                  <div className="p-1">
                    <Link
                      to="/account"
                      onClick={() => setUserMenuOpen(false)}
                      className="w-full text-left px-3 py-2.5 text-xs font-bold text-forest-700 hover:bg-neutral-100 rounded-lg flex items-center gap-2 uppercase tracking-wider transition-colors"
                    >
                      <User size={14} /> My Account
                    </Link>
                    <Link
                      to="/orders"
                      onClick={() => setUserMenuOpen(false)}
                      className="w-full text-left px-3 py-2.5 text-xs font-bold text-forest-700 hover:bg-neutral-100 rounded-lg flex items-center gap-2 uppercase tracking-wider transition-colors"
                    >
                      <Package size={14} /> My Orders
                    </Link>
                    <button
                      onClick={() => { logout(); setUserMenuOpen(false); }}
                      className="w-full text-left px-3 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 rounded-lg flex items-center gap-2 uppercase tracking-wider transition-colors"
                    >
                      <LogOut size={14} /> Log Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setShowAuth(true)}
              className="text-xs font-bold text-forest-800 hover:text-amber-600 transition-colors hidden md:block uppercase tracking-widest"
            >
              Log In
            </button>
          )}

          <button
            onClick={() => setCartOpen(true)}
            className="relative text-forest-800 hover:text-amber-600 transition-colors p-2"
            aria-label="Open cart"
          >
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute 0 right-0 top-0 w-4 h-4 bg-amber-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                {cartCount}
              </span>
            )}
          </button>

          <Link to="/sell" className="hidden md:block btn-amber text-xs py-2 px-5 uppercase tracking-widest">
            Sell Book
          </Link>
        </div>
      </div>

      {showAuth && <AuthModal isOpen={true} onClose={() => setShowAuth(false)} mode="login" />}
    </header>
  );
}
