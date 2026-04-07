import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate();
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

  const coverUrl = book.image || '';

  return (
    <div className="book-card flex flex-col group">
      {/* Cover — fully clickable */}
      <div
        className="relative overflow-hidden h-52 flex-shrink-0 cursor-pointer"
        onClick={() => navigate(`/book/${book.id}`)}
      >
        <img
          src={coverUrl}
          alt={book.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
        />
        {/* Fallback minimal cover */}
        <div
          style={{ display: 'none' }}
          className="absolute inset-0 bg-neutral-100 dark:bg-neutral-800 flex flex-col items-center justify-center p-4 text-neutral-900 dark:text-neutral-100"
        >
          <p className="font-bold text-center text-sm uppercase tracking-wider">{book.title}</p>
          <p className="text-xs mt-2 text-neutral-500">{book.author}</p>
        </div>

        {/* Condition badge */}
        <span className={`absolute top-2 left-2 ${conditionStyles[book.condition] || 'badge-good'} bg-white dark:bg-black`}>
          {book.condition}
        </span>

        {/* PageBack Verified */}
        <span className="absolute top-2 right-2 bg-black text-white text-[10px] font-bold px-2 py-0.5 uppercase tracking-widest">
          Verified
        </span>
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1 border-t border-transparent group-hover:border-neutral-200 dark:group-hover:border-neutral-700 transition-colors">
        <p className="text-[10px] uppercase tracking-widest text-neutral-400 mb-1">{book.genre}</p>
        <h3 
          className="font-bold text-neutral-900 dark:text-neutral-100 text-base leading-snug line-clamp-2 mb-1 cursor-pointer hover:underline"
          onClick={() => navigate(`/book/${book.id}`)}
        >
          {book.title}
        </h3>
        <p className="text-xs text-neutral-500 mb-4">{book.author}</p>

        {/* Pricing */}
        <div className="flex flex-col mb-4">
          <span className="font-bold text-xl text-black dark:text-white">₹{book.price}</span>
          <span className="text-xs text-neutral-400 line-through">₹{book.mrp} MRP</span>
        </div>

        {/* Savings bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5 border-b border-dashed border-neutral-200 pb-1">
            <span className="text-[10px] text-black dark:text-white font-bold uppercase">Save ₹{savings}</span>
            <span className="text-[10px] text-black dark:text-white font-bold">{pct}% OFF</span>
          </div>
          <div className="h-1 bg-neutral-100 dark:bg-neutral-800 overflow-hidden">
            <div ref={barRef} className="savings-bar h-full" />
          </div>
        </div>

        {/* Add to cart */}
        <button
          onClick={() => addToCart(book)}
          disabled={inCart}
          className={`mt-auto flex items-center justify-center py-3 text-xs uppercase font-bold tracking-widest transition-colors ${
            inCart
              ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-400 cursor-default'
              : 'border border-black dark:border-white text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black'
          }`}
        >
          {inCart ? 'Added' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}
