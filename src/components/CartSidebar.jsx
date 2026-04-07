import { X, ShoppingCart, Trash2, CreditCard } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

export default function CartSidebar() {
  const { cartItems, removeFromCart, cartTotal, cartOpen, setCartOpen, placeOrder } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    const orderId = placeOrder();
    if (orderId) {
      navigate('/orders');
    }
  };

  if (!cartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Overlay */}
      <div className="absolute inset-0 bg-forest-900/50 backdrop-blur-sm" onClick={() => setCartOpen(false)} />

      {/* Sidebar */}
      <div className="relative w-full max-w-sm bg-cream-100 dark:bg-forest-800 h-full flex flex-col shadow-warm-lg animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-cream-200 dark:border-forest-700">
          <div className="flex items-center gap-2">
            <ShoppingCart size={20} className="text-forest-700 dark:text-cream-200" />
            <h2 className="font-display font-bold text-lg text-forest-800 dark:text-cream-100">Your Cart</h2>
            <span className="bg-forest-700 text-white text-xs font-bold px-2 py-0.5 rounded-full">{cartItems.length}</span>
          </div>
          <button onClick={() => setCartOpen(false)} className="w-8 h-8 rounded-lg hover:bg-cream-200 dark:hover:bg-forest-700 flex items-center justify-center transition-colors">
            <X size={18} className="text-forest-600 dark:text-cream-300" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <span className="text-5xl mb-3">🛒</span>
              <p className="font-display text-lg text-forest-700 dark:text-cream-200 mb-1">Your cart is empty</p>
              <p className="text-sm text-forest-400 dark:text-cream-500">Add some books to get started!</p>
              <button onClick={() => { setCartOpen(false); }} className="mt-4 btn-primary text-sm py-2">
                Browse Books
              </button>
            </div>
          ) : (
            cartItems.map(item => (
              <div key={item.id} className="flex gap-3 bg-white dark:bg-forest-700 rounded-xl p-3 shadow-sm">
                {/* Cover placeholder */}
                <div className={`w-12 h-16 rounded-lg bg-gradient-to-br ${item.coverColor} flex items-center justify-center flex-shrink-0 text-xl`}>
                  📖
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-forest-800 dark:text-cream-100 text-sm leading-tight line-clamp-2">{item.title}</p>
                  <p className="text-xs text-forest-400 dark:text-cream-500 mt-0.5">{item.author}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-bold text-forest-700 dark:text-cream-200">₹{item.price}</span>
                    <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="px-5 py-4 border-t border-cream-200 dark:border-forest-700 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-forest-600 dark:text-cream-300 font-medium">Total</span>
              <span className="font-display font-bold text-2xl text-forest-700 dark:text-cream-100">₹{cartTotal}</span>
            </div>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 text-center">
              🎉 You saved ₹{cartItems.reduce((s, i) => s + (i.mrp - i.price), 0)} vs buying new!
            </p>
            <button onClick={handleCheckout} className="btn-primary w-full flex items-center justify-center gap-2">
              <CreditCard size={16} /> Place Order
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
