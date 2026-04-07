import { useEffect, useRef } from 'react';
import { ShoppingCart, Eye } from 'lucide-react';
import { useCart } from '../context/CartContext';

const conditionStyles = {
  'Like New':   'badge-like-new',
  'Good':       'badge-good',
  'Acceptable': 'badge-acceptable',
  'Poor':       'badge-poor',
};

export default function BookCard({ book, onView }) {
  const { addToCart, cartItems } = useCart();
  const barRef = useRef(null);
  const inCart = cartItems.some(i => i.id === book.id);
  const savings = book.mrp - book.price;
  const pct = Math.round((savings / book.mrp) * 100);

  useEffect(() => {
    const bar = barRef.current;
    if (!bar) return;
    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        bar.style.setProperty('--fill-width', `${pct}%`);
        bar.classList.add('animate');
        obs.disconnect();
      }
    }, { threshold: 0.3 });
    obs.observe(bar);
    return () => obs.disconnect();
  }, [pct]);

  const coverUrl = `https://covers.openlibrary.org/b/isbn/${book.isbn}-M.jpg`;

  return (
    <div className="book-card flex flex-col group">
      {/* Cover */}
      <div className="relative overflow-hidden h-52 flex-shrink-0">
        <img
          src={coverUrl}
          alt={book.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
        />
        {/* Fallback colored cover */}
        <div
          style={{ display: 'none' }}
          className={`absolute inset-0 bg-gradient-to-br ${book.coverColor} flex flex-col items-center justify-center p-4 text-white`}
        >
          <span className="text-4xl mb-2">📖</span>
          <p className="font-display font-bold text-center text-sm leading-tight">{book.title}</p>
          <p className="text-xs mt-1 opacity-80">{book.author}</p>
        </div>

        {/* Overlay buttons */}
        <div className="absolute inset-0 bg-forest-900/0 group-hover:bg-forest-900/40 transition-all duration-300 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
          <button
            onClick={() => onView?.(book)}
            className="bg-white text-forest-700 px-3 py-2 rounded-lg text-xs font-semibold flex items-center gap-1 hover:bg-cream-100 transition-colors shadow-lg"
          >
            <Eye size={14} /> View
          </button>
        </div>

        {/* Condition badge */}
        <span className={`absolute top-2 left-2 text-xs font-semibold px-2 py-1 rounded-full ${conditionStyles[book.condition] || 'badge-good'}`}>
          {book.condition}
        </span>

        {/* PageBack Verified */}
        <span className="absolute top-2 right-2 bg-forest-700 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full">
          ✓ Verified
        </span>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-xs text-forest-400 dark:text-cream-400 mb-1">{book.genre}</p>
        <h3 className="font-display font-semibold text-forest-800 dark:text-cream-100 text-base leading-tight line-clamp-2 mb-1">
          {book.title}
        </h3>
        <p className="text-sm text-forest-500 dark:text-cream-400 mb-3">{book.author}</p>

        {/* Pricing */}
        <div className="flex items-center gap-2 mb-2">
          <span className="font-display font-bold text-xl text-forest-700 dark:text-cream-100">₹{book.price}</span>
          <span className="text-sm text-forest-400 dark:text-cream-500 line-through">₹{book.mrp}</span>
        </div>

        {/* Savings bar */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">You save ₹{savings}</span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">{pct}% off</span>
          </div>
          <div className="h-1.5 rounded-full bg-cream-200 dark:bg-forest-700 overflow-hidden">
            <div ref={barRef} className="savings-bar h-full rounded-full" />
          </div>
        </div>

        {/* Add to cart */}
        <button
          onClick={() => addToCart(book)}
          disabled={inCart}
          className={`mt-auto flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
            inCart
              ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 cursor-default'
              : 'btn-primary'
          }`}
        >
          <ShoppingCart size={15} />
          {inCart ? 'Added to Cart' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}
