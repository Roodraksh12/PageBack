import { X, ShoppingCart, MessageCircle } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useApp } from '../context/AppContext';

const conditionStyles = {
  'Like New':   'badge-like-new',
  'Good':       'badge-good',
  'Acceptable': 'badge-acceptable',
  'Poor':       'badge-poor',
};

export default function BookModal({ book, onClose }) {
  const { addToCart, cartItems } = useCart();
  const { whatsappNumber } = useApp();
  const inCart = cartItems.some(i => i.id === book.id);
  const savings = book.mrp - book.price;
  const pct = Math.round((savings / book.mrp) * 100);
  const coverUrl = `https://covers.openlibrary.org/b/isbn/${book.isbn}-L.jpg`;

  const waLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hi! I'm interested in buying: "${book.title}" by ${book.author} listed on PageBack at ₹${book.price}`)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-forest-900/60 backdrop-blur-sm" />
      <div
        className="relative bg-cream-100 dark:bg-forest-800 rounded-2xl shadow-warm-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-fade-in"
        onClick={e => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-cream-200 dark:bg-forest-700 flex items-center justify-center hover:bg-cream-300 transition-colors"
        >
          <X size={16} />
        </button>

        <div className="flex flex-col md:flex-row">
          {/* Cover */}
          <div className={`md:w-56 h-56 md:h-auto flex-shrink-0 bg-gradient-to-br ${book.coverColor} relative rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none overflow-hidden`}>
            <img
              src={coverUrl}
              alt={book.title}
              className="w-full h-full object-cover"
              onError={e => { e.target.style.display = 'none'; }}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-white" style={{ display: 'none' }}>
              <span className="text-5xl mb-2">📖</span>
              <p className="font-display text-center font-bold">{book.title}</p>
            </div>
          </div>

          {/* Details */}
          <div className="p-6 flex-1">
            <div className="flex items-start gap-2 mb-2 flex-wrap">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${conditionStyles[book.condition]}`}>
                {book.condition}
              </span>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-forest-100 dark:bg-forest-700 text-forest-700 dark:text-cream-300">
                {book.genre}
              </span>
              {book.board && (
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                  {book.board}
                </span>
              )}
            </div>

            <h2 className="font-display font-bold text-2xl text-forest-800 dark:text-cream-100 mb-1">
              {book.title}
            </h2>
            <p className="text-forest-500 dark:text-cream-400 mb-4">by {book.author}</p>

            {/* Price */}
            <div className="flex items-center gap-3 mb-4">
              <span className="font-display font-bold text-3xl text-forest-700 dark:text-cream-100">₹{book.price}</span>
              <div>
                <p className="text-forest-400 line-through text-sm">MRP ₹{book.mrp}</p>
                <p className="text-emerald-600 dark:text-emerald-400 text-sm font-semibold">Save ₹{savings} ({pct}% off)</p>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-forest-600 dark:text-cream-300 leading-relaxed mb-4">
              {book.description}
            </p>

            {/* Condition Report */}
            <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700/40 rounded-xl p-4 mb-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-amber-600 dark:text-amber-400 font-semibold text-sm">📋 Condition Report</span>
                <span className="bg-forest-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">PageBack Verified ✓</span>
              </div>
              <p className="text-sm text-forest-600 dark:text-cream-300 font-mono leading-relaxed italic">
                "{book.conditionReport}"
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button
                onClick={() => { addToCart(book); onClose(); }}
                disabled={inCart}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-medium transition-all ${
                  inCart ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 cursor-default' : 'btn-primary'
                }`}
              >
                <ShoppingCart size={16} />
                {inCart ? 'Already in Cart' : 'Add to Cart'}
              </button>
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-[#25D366] hover:bg-[#1ebe5a] text-white text-sm font-medium transition-colors"
              >
                <MessageCircle size={16} />
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
