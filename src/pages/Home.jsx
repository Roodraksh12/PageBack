import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ChevronLeft, ChevronRight, Star, Leaf, TrendingUp, Shield, Zap } from 'lucide-react';
import { books, genres, testimonials, whyPageBack } from '../data/books';
import { useApp } from '../context/AppContext';
import BookCard from '../components/BookCard';
import BookModal from '../components/BookModal';

function useCountUp(target, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (ts) => {
      if (!startTime) startTime = ts;
      const progress = Math.min((ts - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

function StatsBar() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  const books_ = useCountUp(10000, 2000, visible);
  const sellers = useCountUp(5000, 2000, visible);
  const savings = useCountUp(50, 1500, visible);

  return (
    <div ref={ref} className="bg-forest-700 dark:bg-forest-800 text-white py-8 px-4">
      <div className="max-w-4xl mx-auto grid grid-cols-3 gap-4 text-center">
        {[
          { val: `${books_.toLocaleString()}+`, label: 'Books Available', icon: '📚' },
          { val: `₹${savings}`, label: 'Avg. Savings per Book', icon: '💰' },
          { val: `${sellers.toLocaleString()}+`, label: 'Happy Sellers', icon: '😊' },
        ].map((s, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <span className="text-2xl md:text-3xl">{s.icon}</span>
            <span className="font-display font-bold text-2xl md:text-4xl">{s.val}</span>
            <span className="text-cream-300 text-xs md:text-sm">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function FeaturedCarousel() {
  const [idx, setIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const featured = books.filter(b => b.condition === 'Like New' || b.tags?.includes('bestseller'));
  const visible = 3;
  const max = featured.length - visible;
  const prev = () => setIdx(i => Math.max(0, i - 1));
  const next = () => setIdx(i => Math.min(max, i + 1));

  return (
    <section className="py-16 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-amber-500 font-semibold text-sm tracking-wide uppercase mb-1">Hand-Picked</p>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-forest-800 dark:text-cream-100">Featured Books</h2>
        </div>
        <div className="flex gap-2">
          <button onClick={prev} disabled={idx === 0} className="w-10 h-10 rounded-xl border-2 border-forest-200 dark:border-forest-700 flex items-center justify-center hover:bg-cream-200 dark:hover:bg-forest-800 disabled:opacity-40 transition-all">
            <ChevronLeft size={18} />
          </button>
          <button onClick={next} disabled={idx >= max} className="w-10 h-10 rounded-xl border-2 border-forest-200 dark:border-forest-700 flex items-center justify-center hover:bg-cream-200 dark:hover:bg-forest-800 disabled:opacity-40 transition-all">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="overflow-hidden">
        <div
          className="flex gap-6 transition-transform duration-500"
          style={{ transform: `translateX(-${idx * (100 / visible)}%)` }}
        >
          {featured.map(b => (
            <div key={b.id} className="w-full flex-shrink-0" style={{ width: `calc(${100 / visible}% - 16px)` }}>
              <BookCard book={b} onView={setSelected} />
            </div>
          ))}
        </div>
      </div>

      {/* Mobile scroll */}
      <div className="md:hidden overflow-x-auto flex gap-4 pb-2 snap-x snap-mandatory mt-0">
        {featured.map(b => (
          <div key={b.id} className="snap-start flex-shrink-0 w-64">
            <BookCard book={b} onView={setSelected} />
          </div>
        ))}
      </div>

      {selected && <BookModal book={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}

export default function Home() {
  const { envImpact, totalBooksSite } = useApp();
  const [selected, setSelected] = useState(null);

  const heroBooks = books.slice(0, 4);

  return (
    <div className="page-enter">
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-br from-forest-700 via-forest-600 to-forest-500 dark:from-forest-900 dark:via-forest-800 dark:to-forest-700 text-white min-h-[90vh] flex items-center paper-texture">
        {/* BG circles */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-500/10 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-forest-400/20 rounded-full translate-y-1/2 -translate-x-1/4 blur-3xl" />

        <div className="section-pad relative z-10 grid lg:grid-cols-2 gap-12 items-center w-full">
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-amber-500/20 border border-amber-400/40 rounded-full px-4 py-2 mb-6">
              <Leaf size={14} className="text-amber-400" />
              <span className="text-amber-300 text-sm font-medium">Sustainable Reading • Made in India</span>
            </div>

            <h1 className="font-display font-bold text-5xl md:text-6xl lg:text-7xl leading-tight mb-6">
              Give your books<br />
              <span className="text-amber-400">a second life.</span><br />
              <span className="text-4xl md:text-5xl font-normal italic">Get paid instantly.</span>
            </h1>

            <p className="text-cream-200 text-xl leading-relaxed mb-8 max-w-lg">
              PageBack buys your used books at guaranteed best prices and sells curated reads at unbeatable deals — all quality-checked and verified.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link to="/buy" className="btn-amber flex items-center gap-2 text-lg px-8 py-4">
                Browse Books <ArrowRight size={18} />
              </Link>
              <Link to="/sell" className="btn-outline border-cream-300 text-cream-100 hover:bg-cream-100 hover:text-forest-800 text-lg px-8 py-4">
                Sell Your Books
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-3 mt-8">
              {['₹ Instant Payout', '✅ Quality Verified', '🌱 Eco-Friendly', '📦 Free Pickup'].map(b => (
                <span key={b} className="bg-white/10 backdrop-blur-sm border border-white/20 text-sm px-3 py-1.5 rounded-lg text-cream-200">
                  {b}
                </span>
              ))}
            </div>
          </div>

          {/* Hero book grid */}
          <div className="hidden lg:grid grid-cols-2 gap-4 animate-float">
            {heroBooks.map((book, i) => (
              <div
                key={book.id}
                className={`bg-gradient-to-br ${book.coverColor} rounded-2xl p-5 shadow-warm-lg flex flex-col justify-end min-h-[180px] cursor-pointer hover:scale-105 transition-transform duration-300 ${i % 2 === 1 ? 'mt-6' : ''}`}
                onClick={() => setSelected(book)}
              >
                <div className="bg-black/30 backdrop-blur-sm rounded-xl p-3">
                  <p className="font-display font-bold text-white text-sm leading-tight">{book.title}</p>
                  <p className="text-white/70 text-xs">{book.author}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-white font-bold text-sm">₹{book.price}</span>
                    <span className="text-white/50 line-through text-xs">₹{book.mrp}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 animate-pulse-slow">
          <div className="w-5 h-8 rounded-full border-2 border-cream-300/50 flex items-start justify-center pt-1">
            <div className="w-1 h-2 bg-cream-300/50 rounded-full" />
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <StatsBar />

      {/* HOW IT WORKS */}
      <section className="section-pad">
        <div className="text-center mb-12">
          <p className="text-amber-500 font-semibold text-sm tracking-wide uppercase mb-2">Simple. Fast. Rewarding.</p>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-forest-800 dark:text-cream-100">How PageBack Works</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          {/* Buy */}
          <div className="bg-white dark:bg-forest-800 rounded-2xl p-8 shadow-card border border-cream-200 dark:border-forest-700">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-forest-700 flex items-center justify-center text-white font-bold">🛒</div>
              <h3 className="font-display font-bold text-2xl text-forest-800 dark:text-cream-100">How to Buy</h3>
            </div>
            <div className="space-y-4">
              {[
                { n: '01', t: 'Browse & Filter', d: 'Search by genre, author, or condition. Use filters to find exactly what you need.' },
                { n: '02', t: 'Check Condition Report', d: 'Read our detailed condition report before buying. No surprises.' },
                { n: '03', t: 'Add to Cart & Order', d: 'Place your order. We pack and ship within 24 hours.' },
                { n: '04', t: 'Happy Reading!', d: 'Enjoy your book. You also helped the planet by choosing pre-loved.' },
              ].map(s => (
                <div key={s.n} className="flex gap-4">
                  <span className="font-display font-bold text-3xl text-cream-200 dark:text-forest-600 flex-shrink-0 w-10">{s.n}</span>
                  <div>
                    <p className="font-semibold text-forest-800 dark:text-cream-100 mb-0.5">{s.t}</p>
                    <p className="text-sm text-forest-500 dark:text-cream-400">{s.d}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/buy" className="mt-6 btn-primary flex items-center justify-center gap-2 w-full">
              Browse Books <ArrowRight size={16} />
            </Link>
          </div>

          {/* Sell */}
          <div className="bg-forest-700 dark:bg-forest-800 rounded-2xl p-8 shadow-warm border border-forest-600">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center text-white font-bold">💰</div>
              <h3 className="font-display font-bold text-2xl text-white">How to Sell</h3>
            </div>
            <div className="space-y-4">
              {[
                { n: '01', t: 'Search Your Book', d: 'Enter title, author or ISBN. We instantly find it in our database.' },
                { n: '02', t: 'Get Instant Quote', d: 'Select the condition and see your payout price immediately.' },
                { n: '03', t: 'Schedule Pickup', d: 'Enter your address. We pickup from your doorstep — free of charge.' },
                { n: '04', t: 'Get Paid!', d: 'Money in your account within 24 hours of quality check.' },
              ].map(s => (
                <div key={s.n} className="flex gap-4">
                  <span className="font-display font-bold text-3xl text-forest-500 flex-shrink-0 w-10">{s.n}</span>
                  <div>
                    <p className="font-semibold text-white mb-0.5">{s.t}</p>
                    <p className="text-sm text-cream-300">{s.d}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/sell" className="mt-6 btn-amber flex items-center justify-center gap-2 w-full">
              Sell Your Books <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURED BOOKS CAROUSEL */}
      <div className="bg-cream-50 dark:bg-forest-900/50">
        <FeaturedCarousel />
      </div>

      {/* GENRE GRID */}
      <section className="section-pad">
        <div className="text-center mb-10">
          <p className="text-amber-500 font-semibold text-sm tracking-wide uppercase mb-2">Explore</p>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-forest-800 dark:text-cream-100">Browse by Genre</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {genres.map(g => (
            <Link
              key={g.id}
              to={`/buy?genre=${g.id}`}
              className={`group relative bg-gradient-to-br ${g.color} rounded-2xl p-6 text-white text-center overflow-hidden hover:scale-105 hover:shadow-warm-lg transition-all duration-300`}
            >
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              <span className="text-4xl block mb-2">{g.icon}</span>
              <p className="font-display font-bold text-lg relative z-10">{g.label}</p>
              <p className="text-white/70 text-xs mt-1 relative z-10">
                {books.filter(b => b.genre === g.id).length} books
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* WHY PAGEBACK */}
      <section className="bg-forest-700 dark:bg-forest-900 py-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto text-center mb-12">
          <p className="text-amber-400 font-semibold text-sm tracking-wide uppercase mb-2">Why Choose Us</p>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-white">The PageBack Promise</h2>
        </div>
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {whyPageBack.map((w, i) => (
            <div key={i} className="bg-forest-600/50 dark:bg-forest-800/50 backdrop-blur-sm border border-forest-500/40 rounded-2xl p-6 text-center hover:bg-forest-600 dark:hover:bg-forest-700 transition-colors group">
              <span className="text-4xl block mb-3 group-hover:scale-110 transition-transform duration-200">{w.icon}</span>
              <h3 className="font-display font-bold text-white text-lg mb-2">{w.title}</h3>
              <p className="text-cream-300 text-sm leading-relaxed">{w.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section-pad">
        <div className="text-center mb-10">
          <p className="text-amber-500 font-semibold text-sm tracking-wide uppercase mb-2">Community</p>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-forest-800 dark:text-cream-100">What Readers Say</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map(t => (
            <div key={t.id} className="bg-white dark:bg-forest-800 rounded-2xl p-6 shadow-card border border-cream-100 dark:border-forest-700 flex flex-col gap-4">
              <div className="flex gap-0.5">
                {[...Array(t.rating)].map((_, i) => <Star key={i} size={14} className="fill-amber-400 text-amber-400" />)}
              </div>
              <p className="text-forest-600 dark:text-cream-300 text-sm leading-relaxed flex-1">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.avatarColor} flex items-center justify-center text-white font-bold text-sm`}>
                  {t.avatar}
                </div>
                <div>
                  <p className="font-semibold text-forest-800 dark:text-cream-100 text-sm">{t.name}</p>
                  <p className="text-xs text-forest-400 dark:text-cream-500">{t.city} · {t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ENVIRONMENTAL IMPACT */}
      <section className="bg-gradient-to-r from-emerald-600 to-forest-600 dark:from-forest-800 dark:to-emerald-900 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center text-white">
          <p className="text-emerald-200 font-semibold text-sm tracking-wide uppercase mb-2">Every Book Matters</p>
          <h2 className="font-display font-bold text-3xl md:text-4xl mb-4">Together, we're saving the planet 🌍</h2>
          <p className="text-emerald-100 text-lg mb-10">
            Every used book keeps pulp from landfills and trees standing tall. Here's what PageBack's community has saved so far:
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { val: totalBooksSite.toLocaleString(), label: 'Books Rehomed', icon: '📚' },
              { val: `${envImpact.paperKg} kg`, label: 'Paper Saved', icon: '📄' },
              { val: `${envImpact.trees}+`, label: 'Trees Saved', icon: '🌳' },
              { val: `${(totalBooksSite * 0.2).toFixed(0)} kg`, label: 'CO₂ Reduced', icon: '🌍' },
            ].map((s, i) => (
              <div key={i} className="bg-white/10 backdrop-blur-sm rounded-2xl p-5">
                <span className="text-3xl block mb-1">{s.icon}</span>
                <p className="font-display font-bold text-3xl text-white">{s.val}</p>
                <p className="text-emerald-200 text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BOOK REQUEST CTA */}
      <section className="section-pad text-center">
        <div className="bg-gradient-to-br from-amber-50 to-cream-100 dark:from-forest-800 dark:to-forest-700 rounded-3xl p-12 border border-amber-100 dark:border-forest-600 shadow-warm max-w-3xl mx-auto">
          <span className="text-5xl block mb-4">🎯</span>
          <h2 className="font-display font-bold text-3xl md:text-4xl text-forest-800 dark:text-cream-100 mb-3">
            Can't find your book?
          </h2>
          <p className="text-forest-500 dark:text-cream-400 text-lg mb-6">
            Request it! We'll notify you the moment it arrives. Hundreds of readers are already building wishlists.
          </p>
          <Link to="/buy?tab=request" className="btn-amber inline-flex items-center gap-2 text-lg px-8 py-4">
            Request a Book <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {selected && <BookModal book={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
