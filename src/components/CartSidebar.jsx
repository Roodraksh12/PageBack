import { useState } from 'react';
import { X, ShoppingCart, Trash2, CreditCard } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import AuthModal from './AuthModal';

export default function CartSidebar() {
  const { cartItems, removeFromCart, cartTotal, cartOpen, setCartOpen, placeOrder, promoCode, promoDiscount, cartFinalTotal, applyPromo, removePromo, deliveryFee } = useCart();
  const { isLoggedIn } = useAuth();
  const navigate = useNavigate();
  const [showAuth, setShowAuth] = useState(false);

  const handleCheckout = () => {
    if (!isLoggedIn) {
      setShowAuth(true);
      return;
    }
    setCartOpen(false);
    navigate('/checkout');
  };

  if (!cartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Overlay */}
      <div className="absolute inset-0 bg-forest-900/50 backdrop-blur-sm" onClick={() => setCartOpen(false)} />

      {/* Sidebar */}
      <div className="relative w-full max-w-sm bg-white dark:bg-black border-l border-black dark:border-white h-full flex flex-col animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-black dark:border-white">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-2xl uppercase tracking-tighter text-black dark:text-white">Cart</h2>
            <span className="bg-black text-white dark:bg-white dark:text-black text-xs font-bold px-2 py-0.5 ml-2">[{cartItems.length}]</span>
          </div>
          <button onClick={() => setCartOpen(false)} className="text-black dark:text-white hover:opacity-50 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-6">
              <p className="font-bold text-3xl uppercase tracking-tighter text-neutral-300 dark:text-neutral-700 mb-2">Empty Cart</p>
              <button onClick={() => { setCartOpen(false); }} className="mt-6 border border-black dark:border-white px-6 py-3 font-bold uppercase tracking-widest text-xs hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors">
                Browse Books
              </button>
            </div>
          ) : (
            cartItems.map(item => (
              <div key={item.id} className="flex gap-4 p-6 border-b border-neutral-200 dark:border-neutral-800">
                {/* Cover placeholder */}
                <div className="w-16 h-20 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 flex items-center justify-center flex-shrink-0">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 text-center leading-none px-1">Img</span>
                </div>
                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <p className="font-bold text-black dark:text-white leading-none mb-1 uppercase tracking-tight">{item.title}</p>
                    <p className="text-xs text-neutral-500">{item.author}</p>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-bold text-lg text-black dark:text-white">₹{item.price}</span>
                    <button onClick={() => removeFromCart(item.id)} className="text-neutral-400 hover:text-black dark:hover:text-white transition-colors">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="p-6 border-t border-black dark:border-white bg-neutral-50 dark:bg-neutral-900 space-y-4">
            
            {/* Promo Code Section */}
            <div>
              {!promoCode ? (
                <div className="flex">
                  <input 
                    type="text" id="promo-input" placeholder="Promo code..."
                    className="flex-1 uppercase text-xs font-bold tracking-widest border border-black dark:border-white px-4 py-3 bg-white dark:bg-black text-black dark:text-white placeholder-neutral-400 focus:outline-none"
                  />
                  <button 
                    onClick={() => {
                      const input = document.getElementById('promo-input');
                      try {
                        applyPromo(input.value);
                        input.value = '';
                      } catch (err) {
                        alert(err.message);
                      }
                    }}
                    className="bg-black text-white dark:bg-white dark:text-black border border-black dark:border-white border-l-0 px-6 py-3 text-xs font-bold uppercase tracking-widest hover:opacity-80 transition-colors"
                  >
                    Apply
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between border border-black dark:border-white px-4 py-3 bg-white dark:bg-black">
                  <div className="flex items-center gap-2">
                    <span className="font-bold uppercase tracking-widest text-xs text-black dark:text-white">{promoCode.code}</span>
                    <span className="text-[10px] uppercase text-neutral-500">Applied</span>
                  </div>
                  <button onClick={removePromo} className="text-neutral-400 hover:text-black dark:hover:text-white transition-colors">
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-2 text-xs font-bold uppercase tracking-widest text-neutral-500">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-black dark:text-white">₹{cartTotal}</span>
              </div>
              {promoDiscount > 0 && (
                <div className="flex justify-between">
                  <span>Discount</span>
                  <span className="text-black dark:text-white">-₹{promoDiscount}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery</span>
                <span className="text-black dark:text-white">{deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}</span>
              </div>
              
              <div className="h-px bg-neutral-300 dark:bg-neutral-700 my-4" />
              
              <div className="flex items-center justify-between font-bold text-2xl uppercase tracking-tighter text-black dark:text-white">
                <span>Total</span>
                <span>₹{cartFinalTotal}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              className="w-full bg-black text-white dark:bg-white dark:text-black py-4 text-xs font-bold uppercase tracking-widest hover:opacity-90 flex items-center justify-center gap-2 transition-opacity"
            >
              <CreditCard size={16} /> Checkout securely
            </button>
          </div>
        )}
      </div>
      {showAuth && <AuthModal isOpen={true} onClose={() => setShowAuth(false)} mode="login" />}
    </div>
  );
}
