import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ShoppingCart, MessageCircle, ArrowLeft, CheckCircle, Tag, BookOpen, Globe, Award, TrendingUp } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { useCart } from '../context/CartContext';
import { useApp } from '../context/AppContext';

const conditionColors = {
  'Like New':   { bg: 'bg-emerald-50', border: 'border-emerald-300', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  'Good':       { bg: 'bg-blue-50',    border: 'border-blue-300',    text: 'text-blue-700',    dot: 'bg-blue-500'    },
  'Acceptable': { bg: 'bg-amber-50',   border: 'border-amber-300',   text: 'text-amber-700',   dot: 'bg-amber-500'   },
  'Poor':       { bg: 'bg-red-50',     border: 'border-red-300',     text: 'text-red-700',     dot: 'bg-red-500'     },
};

const demandLabels = {
  high:   { label: 'High Demand',   icon: '🔥', color: 'text-red-600 bg-red-50 border-red-200'     },
  medium: { label: 'Moderate',      icon: '📈', color: 'text-amber-600 bg-amber-50 border-amber-200' },
  low:    { label: 'Available',     icon: '✅', color: 'text-green-600 bg-green-50 border-green-200' },
};

export default function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { inventory } = useAdmin();
  const { addToCart, cartItems } = useCart();
  const { whatsappNumber } = useApp();

  const book = inventory.find(b => String(b.id) === String(id));

  useEffect(() => {
    window.scrollTo(0, 0);
    if (book) document.title = `${book.title} — PageBack`;
    return () => { document.title = 'PageBack'; };
  }, [book]);

  if (!book) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
        <span className="text-6xl">📚</span>
        <h1 className="font-bold text-2xl text-forest-800">Book not found</h1>
        <p className="text-forest-500">This book may have been removed from inventory.</p>
        <Link to="/buy" className="btn-primary mt-2">← Back to Inventory</Link>
      </div>
    );
  }

  const inCart = cartItems.some(i => i.id === book.id);
  const savings = book.mrp - book.price;
  const pct = Math.round((savings / book.mrp) * 100);
  const coverUrl = book.image || '';
  const cStyle = conditionColors[book.condition] || conditionColors['Good'];
  const demand = demandLabels[book.demandLevel] || demandLabels['low'];
  const waLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    `Hi! I'm interested in buying: "${book.title}" by ${book.author} listed on PageBack at ₹${book.price}`
  )}`;

  // Similar books (same genre, exclude current)
  const similar = inventory.filter(b => b.genre === book.genre && b.id !== book.id).slice(0, 4);

  return (
    <div className="min-h-screen bg-cream-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-cream-200 px-4 md:px-8 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-2 text-sm text-forest-500">
          <Link to="/" className="hover:text-forest-800 transition-colors">Home</Link>
          <span>/</span>
          <Link to="/buy" className="hover:text-forest-800 transition-colors">Inventory</Link>
          <span>/</span>
          <span className="text-forest-800 font-medium line-clamp-1">{book.title}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-forest-500 hover:text-forest-800 mb-8 transition-colors group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-medium">Back to Inventory</span>
        </button>

        {/* Main product section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16 mb-16">
          
          {/* ── Left: Image ── */}
          <div className="flex flex-col gap-4">
            <div className={`relative w-full aspect-[3/4] max-w-sm mx-auto lg:max-w-none rounded-3xl overflow-hidden bg-gradient-to-br ${book.coverColor || 'from-slate-400 to-gray-600'} shadow-2xl`}>
              <img
                src={coverUrl}
                alt={book.title}
                className="w-full h-full object-cover"
                onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
              />
              {/* Text fallback */}
              <div style={{ display: 'none' }} className="absolute inset-0 flex flex-col items-center justify-center p-8 text-white gap-4">
                <BookOpen size={64} className="opacity-50" />
                <p className="font-display font-bold text-2xl text-center leading-tight">{book.title}</p>
                <p className="text-white/70 text-center">{book.author}</p>
              </div>

              {/* Savings badge */}
              <div className="absolute top-4 right-4 bg-black text-white rounded-2xl px-3 py-1.5 shadow-lg">
                <span className="text-sm font-bold">{pct}% OFF</span>
              </div>

              {/* Condition badge */}
              <div className={`absolute top-4 left-4 ${cStyle.bg} ${cStyle.border} ${cStyle.text} border rounded-2xl px-3 py-1.5 font-semibold text-sm shadow-sm`}>
                <span className={`inline-block w-2 h-2 rounded-full ${cStyle.dot} mr-1.5`} />
                {book.condition}
              </div>
            </div>

            {/* Trust badges */}
            <div className="flex justify-center gap-4 flex-wrap">
              {['PageBack Verified', 'Genuine Copy', 'Secure Checkout'].map(b => (
                <span key={b} className="flex items-center gap-1.5 text-xs text-forest-600 font-medium">
                  <CheckCircle size={14} className="text-emerald-500" /> {b}
                </span>
              ))}
            </div>
          </div>

          {/* ── Right: Details ── */}
          <div className="flex flex-col">
            {/* Tags row */}
            <div className="flex flex-wrap gap-2 mb-3">
              {book.genre && (
                <span className="bg-forest-100 text-forest-700 text-xs font-semibold px-3 py-1 rounded-full capitalize">
                  {book.genre}
                </span>
              )}
              {book.board && (
                <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
                  {book.board}
                </span>
              )}
              {book.tags?.map(t => (
                <span key={t} className="bg-cream-200 text-forest-600 text-xs font-medium px-3 py-1 rounded-full">
                  #{t}
                </span>
              ))}
            </div>

            {/* Title & Author */}
            <h1 className="font-display font-bold text-3xl md:text-4xl text-forest-800 leading-tight mb-2">
              {book.title}
            </h1>
            <p className="text-forest-500 text-lg mb-6">by <span className="font-medium text-forest-700">{book.author}</span></p>

            {/* Pricing */}
            <div className="bg-white border border-cream-200 rounded-2xl p-5 mb-6 shadow-sm">
              <div className="flex items-end gap-4 mb-3">
                <span className="font-display font-bold text-5xl text-forest-800">₹{book.price}</span>
                <div className="mb-1">
                  <p className="text-forest-400 line-through text-base">MRP ₹{book.mrp}</p>
                  <p className="text-emerald-600 font-bold text-sm">Save ₹{savings} ({pct}% off)</p>
                </div>
              </div>
              {/* Savings bar */}
              <div className="w-full bg-cream-100 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all duration-700"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>

            {/* Demand + Language stat pills */}
            <div className="flex flex-wrap gap-3 mb-6">
              <span className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border ${demand.color}`}>
                <span>{demand.icon}</span> {demand.label}
              </span>
              {book.language && (
                <span className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border border-slate-200 bg-slate-50 text-slate-600">
                  <Globe size={12} /> {book.language}
                </span>
              )}
            </div>

            {/* Description */}
            <div className="mb-6">
              <h3 className="font-semibold text-forest-700 text-sm uppercase tracking-widest mb-2">About this book</h3>
              <p className="text-forest-600 leading-relaxed">{book.description || 'No description available.'}</p>
            </div>

            {/* Condition Report */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-8">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-amber-600 font-semibold text-sm flex items-center gap-1.5">
                  <Award size={15} /> Condition Report
                </span>
                <span className="bg-forest-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  PageBack Verified ✓
                </span>
              </div>
              <p className="text-forest-600 font-mono text-sm leading-relaxed italic">
                "{book.conditionReport || 'Condition details not available.'}"
              </p>
            </div>

            {/* CTAs */}
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() => addToCart(book)}
                disabled={inCart}
                className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl font-semibold text-base transition-all ${
                  inCart
                    ? 'bg-emerald-100 text-emerald-700 cursor-default border border-emerald-200'
                    : 'btn-primary shadow-warm hover:shadow-warm-lg active:scale-95'
                }`}
              >
                <ShoppingCart size={18} />
                {inCart ? '✓ Added to Cart' : 'Add to Cart'}
              </button>
              <a
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-[#25D366] hover:bg-[#1ebe5a] text-white font-semibold text-base transition-colors shadow-sm active:scale-95"
              >
                <MessageCircle size={18} />
                WhatsApp
              </a>
            </div>
          </div>
        </div>

        {/* ── Similar Books ── */}
        {similar.length > 0 && (
          <div className="border-t border-cream-200 pt-12">
            <h2 className="font-display font-bold text-2xl text-forest-800 mb-6">
              More in <span className="capitalize">{book.genre}</span>
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {similar.map(b => {
                const sImg = b.image || '';
                const sPct = Math.round(((b.mrp - b.price) / b.mrp) * 100);
                return (
                  <Link
                    key={b.id}
                    to={`/book/${b.id}`}
                    className="group bg-white border border-cream-200 rounded-2xl overflow-hidden hover:shadow-lg transition-all hover:-translate-y-0.5"
                  >
                    <div className={`relative h-36 bg-gradient-to-br ${b.coverColor || 'from-slate-400 to-gray-600'} overflow-hidden`}>
                      <img
                        src={sImg}
                        alt={b.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        onError={e => { e.target.style.display = 'none'; }}
                      />
                      <span className="absolute top-2 right-2 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {sPct}% OFF
                      </span>
                    </div>
                    <div className="p-3">
                      <p className="font-bold text-forest-800 text-sm line-clamp-2 leading-snug mb-1">{b.title}</p>
                      <p className="text-xs text-forest-500 mb-2">{b.author}</p>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-forest-800">₹{b.price}</span>
                        <span className="text-xs text-forest-400 line-through">₹{b.mrp}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
