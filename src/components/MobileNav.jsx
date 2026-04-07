import { NavLink } from 'react-router-dom';
import { Home, Search, Tag, ShoppingCart, User } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function MobileNav() {
  const { cartCount, setCartOpen } = useCart();

  const tabs = [
    { to: '/',       icon: Home,   label: 'Home'   },
    { to: '/buy',    icon: Search, label: 'Browse' },
    { to: '/sell',   icon: Tag,    label: 'Sell'   },
    { to: '/orders', icon: User,   label: 'Profile' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-cream-100/95 dark:bg-forest-900/95 backdrop-blur-md border-t border-cream-200 dark:border-forest-700 flex items-center justify-around px-2 h-16">
      {tabs.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl transition-all ${
              isActive
                ? 'text-forest-700 dark:text-cream-100'
                : 'text-forest-400 dark:text-forest-500'
            }`
          }
        >
          {({ isActive }) => (
            <>
              <div className={`p-1.5 rounded-lg transition-colors ${isActive ? 'bg-forest-700/10 dark:bg-cream-100/10' : ''}`}>
                <Icon size={20} strokeWidth={isActive ? 2.5 : 1.8} />
              </div>
              <span className={`text-[10px] font-medium ${isActive ? 'font-semibold' : ''}`}>{label}</span>
            </>
          )}
        </NavLink>
      ))}

      {/* Cart button */}
      <button
        onClick={() => setCartOpen(true)}
        className="flex flex-col items-center gap-0.5 px-4 py-2 rounded-xl text-forest-400 dark:text-forest-500 relative"
      >
        <div className="p-1.5 rounded-lg relative">
          <ShoppingCart size={20} strokeWidth={1.8} />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              {cartCount}
            </span>
          )}
        </div>
        <span className="text-[10px] font-medium">Cart</span>
      </button>
    </nav>
  );
}
