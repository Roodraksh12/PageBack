import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, Star } from 'lucide-react';
import { genres, testimonials, whyPageBack } from '../data/books';
import { useApp } from '../context/AppContext';

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
          { val: `${books_.toLocaleString()}+`, label: 'Books Available' },
          { val: `₹${savings}`, label: 'Avg. Savings per Book' },
          { val: `${sellers.toLocaleString()}+`, label: 'Happy Sellers' },
        ].map((s, i) => (
          <div key={i} className="flex flex-col items-center gap-1">
            <span className="font-bold text-2xl md:text-5xl">{s.val}</span>
            <span className="text-neutral-400 text-xs md:text-sm uppercase tracking-widest font-bold">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}


export default function Home() {
  const { envImpact, totalBooksSite } = useApp();
  const navigate = useNavigate();

  return (
    <div className="page-enter">
      {/* HERO */}
      <section className="bg-white dark:bg-black text-black dark:text-white min-h-[85vh] flex flex-col items-center justify-center border-b border-black dark:border-white text-center">
        <div className="section-pad max-w-4xl animate-fade-in flex flex-col items-center">
          <h1 className="font-bold text-6xl md:text-8xl lg:text-9xl leading-[0.9] tracking-tighter mb-8 uppercase flex flex-col">
            <span>Exam Prep</span>
            <span className="text-neutral-500">Books</span>
          </h1>

          <p className="text-forest-800 text-lg md:text-2xl font-medium mb-12 max-w-2xl leading-relaxed">
            PageBack is India's largest marketplace for used competitive exam materials. Buy cheaply to start preparing, sell instantly when you clear.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto">
            <Link to="/buy" className="btn-primary flex items-center justify-center gap-2 text-lg px-10 py-5 uppercase tracking-widest">
              Browse Books <ArrowRight size={18} />
            </Link>
            <Link to="/sell" className="btn-outline flex items-center justify-center text-lg px-10 py-5 uppercase tracking-widest">
              Sell Your Stack
            </Link>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-3 mt-16">
            {['JEE / NEET', 'UPSC / SSC', 'Verified Editions', 'Fast Delivery'].map(b => (
              <span key={b} className="border border-forest-800 text-xs px-4 py-2 text-forest-800 font-bold uppercase tracking-widest shadow-sm">
                {b}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <StatsBar />

      {/* HOW IT WORKS */}
      <section className="section-pad border-b border-black">
        <div className="text-center mb-16">
          <h2 className="font-bold text-5xl md:text-7xl uppercase tracking-tighter text-black dark:text-white">How it Works</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
          {/* Buy */}
          <div className="border border-black dark:border-white p-10 flex flex-col">
            <h3 className="font-bold text-3xl uppercase mb-8 border-b border-black dark:border-white pb-4">Buy</h3>
            <div className="space-y-6 flex-1">
              {[
                { n: '01', t: 'Find a Book', d: 'Search our inventory of curated reads.' },
                { n: '02', t: 'Verified Quality', d: 'Every book is inspected and verified.' },
                { n: '03', t: 'Delivered', d: 'Shipped to your door instantly.' },
              ].map(s => (
                <div key={s.n} className="flex gap-6">
                  <span className="font-bold text-4xl text-neutral-300 dark:text-neutral-700">{s.n}</span>
                  <div>
                    <p className="font-bold uppercase tracking-wider">{s.t}</p>
                    <p className="text-sm text-neutral-500 mt-1">{s.d}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/buy" className="mt-8 btn-primary flex items-center justify-center w-full uppercase tracking-widest text-sm">
              Start Buying
            </Link>
          </div>

          {/* Sell */}
          <div className="border border-black dark:border-white p-10 bg-black text-white dark:bg-white dark:text-black flex flex-col">
            <h3 className="font-bold text-3xl uppercase mb-8 border-b border-neutral-700 dark:border-neutral-300 pb-4">Sell</h3>
            <div className="space-y-6 flex-1">
              {[
                { n: '01', t: 'Get a Quote', d: 'Instantly view payout online.' },
                { n: '02', t: 'Free Pickup', d: 'We come to your door securely.' },
                { n: '03', t: 'Get Payout', d: 'Paid instantly on verification.' },
              ].map(s => (
                <div key={s.n} className="flex gap-6">
                  <span className="font-bold text-4xl text-neutral-700 dark:text-neutral-300">{s.n}</span>
                  <div>
                    <p className="font-bold uppercase tracking-wider">{s.t}</p>
                    <p className="text-sm text-neutral-400 dark:text-neutral-600 mt-1">{s.d}</p>
                  </div>
                </div>
              ))}
            </div>
            <Link to="/sell" className="mt-8 border border-white text-white hover:bg-white hover:text-black dark:border-black dark:text-black dark:hover:bg-black dark:hover:text-white px-6 py-3 font-bold text-center uppercase tracking-widest text-sm transition-colors">
              Start Selling
            </Link>
          </div>
        </div>
      </section>

      {/* GENRE GRID */}
      <section className="section-pad border-b border-black">
        <div className="mb-10">
          <h2 className="font-bold text-5xl md:text-7xl uppercase tracking-tighter">Genres</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {genres.map((g) => (
            <Link
              key={g.id}
              to={`/buy?genre=${g.id}`}
              className="group border border-black dark:border-white p-6 text-black dark:text-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
            >
              <p className="font-bold text-lg uppercase tracking-widest">{g.label}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* WHY PAGEBACK */}
      <section className="bg-neutral-100 dark:bg-neutral-900 py-16 px-4 md:px-8 border-b border-black">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="font-bold text-5xl md:text-7xl text-black dark:text-white uppercase tracking-tighter">The Promise</h2>
        </div>
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {whyPageBack.map((w, i) => (
            <div key={i} className="border border-black dark:border-white p-8 text-center hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors group">
              <h3 className="font-bold uppercase text-lg mb-2 tracking-widest">{w.title}</h3>
              <p className="opacity-70 text-sm leading-relaxed">{w.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="section-pad">
        <div className="mb-10">
          <h2 className="font-bold text-4xl uppercase tracking-tighter">Community</h2>
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
      <section className="bg-black dark:bg-neutral-900 border-t border-b border-black py-16 px-4">
        <div className="max-w-6xl mx-auto text-white">
          <h2 className="font-bold text-4xl md:text-6xl mb-12 uppercase tracking-tighter">Impact Tracker</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-6 gap-y-12">
            {[
              { val: totalBooksSite.toLocaleString(), label: 'Rehomed' },
              { val: `${envImpact.paperKg} KG`, label: 'Paper' },
              { val: `${envImpact.trees}+`, label: 'Trees' },
              { val: `${(totalBooksSite * 0.2).toFixed(0)} KG`, label: 'CO2' },
            ].map((s, i) => (
              <div key={i} className="border-l-2 border-white pl-4">
                <p className="font-bold text-5xl md:text-6xl text-white tracking-tighter">{s.val}</p>
                <p className="text-neutral-400 text-sm mt-2 uppercase tracking-widest font-bold">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BOOK REQUEST CTA */}
      <section className="section-pad text-center">
        <div className="bg-black text-white dark:bg-white dark:text-black p-12 lg:p-20 border border-black dark:border-white max-w-4xl mx-auto">
          <h2 className="font-bold text-4xl md:text-6xl mb-6 uppercase tracking-tighter">
            Can't find it?
          </h2>
          <p className="text-neutral-400 dark:text-neutral-600 text-lg mb-10 max-w-xl mx-auto">
            Request it. We'll notify you the moment it arrives in our inventory.
          </p>
          <Link to="/buy?tab=request" className="border border-white text-white hover:bg-white hover:text-black dark:border-black dark:text-black dark:hover:bg-black dark:hover:text-white transition-colors inline-block text-lg px-8 py-5 uppercase tracking-widest font-bold">
            Request Title
          </Link>
        </div>
      </section>
    </div>
  );
}
