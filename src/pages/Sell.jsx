import { useState } from 'react';
import { Search, CheckCircle, MessageCircle, ChevronRight, Info } from 'lucide-react';
import { books } from '../data/books';
import { useApp } from '../context/AppContext';
import ConditionGuide from '../components/ConditionGuide';
import KarmaScore from '../components/KarmaScore';
import DemandMeter from '../components/DemandMeter';

const CONDITION_PAYOUTS = {
  'Like New':   0.40,
  'Good':       0.25,
  'Acceptable': 0.15,
  'Poor':       0.05,
};
const CONDITIONS = Object.keys(CONDITION_PAYOUTS);
const INDIAN_CITIES = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Surat'];

function StepIndicator({ current, total }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
            i < current ? 'step-done' : i === current ? 'step-active' : 'step-inactive'
          }`}>
            {i < current ? '✓' : i + 1}
          </div>
          {i < total - 1 && (
            <div className={`w-8 h-0.5 transition-all duration-300 ${i < current ? 'bg-emerald-500' : 'bg-cream-300 dark:bg-forest-700'}`} />
          )}
        </div>
      ))}
    </div>
  );
}

export default function Sell() {
  const { addBookSold, booksSold, whatsappNumber } = useApp();
  const [step, setStep]             = useState(0);
  const [query, setQuery]           = useState('');
  const [results, setResults]       = useState([]);
  const [searched, setSearched]     = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [condition, setCondition]   = useState('');
  const [guideOpen, setGuideOpen]   = useState(false);
  const [form, setForm]             = useState({ name: '', address: '', city: '', phone: '', date: '' });
  const [orderId, setOrderId]       = useState('');

  const handleSearch = () => {
    if (!query.trim()) return;
    const res = books.filter(b =>
      b.title.toLowerCase().includes(query.toLowerCase()) ||
      b.author.toLowerCase().includes(query.toLowerCase()) ||
      b.isbn.includes(query)
    );
    setResults(res);
    setSearched(true);
  };

  const payout = selectedBook && condition
    ? Math.round(selectedBook.mrp * CONDITION_PAYOUTS[condition])
    : 0;

  const handleSubmit = (e) => {
    e.preventDefault();
    const id = `SELL${Date.now()}`;
    setOrderId(id);
    addBookSold(1);
    setStep(4);
  };

  const resetAll = () => {
    setStep(0); setQuery(''); setResults([]); setSearched(false);
    setSelectedBook(null); setCondition(''); setForm({ name: '', address: '', city: '', phone: '', date: '' });
    setOrderId('');
  };

  const waBase = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hi! I want to sell my book: "${query || 'My Book'}" — can you give me a quick quote?`)}`;

  const stepTitles = ['Search Your Book', 'Select Condition', 'Your Payout', 'Pickup Details'];

  return (
    <div className="page-enter pb-20 md:pb-0">
      {/* Header */}
      <div className="bg-gradient-to-br from-forest-700 to-forest-600 dark:from-forest-900 dark:to-forest-800 py-12 px-4 text-white text-center">
        <p className="text-amber-400 font-semibold text-sm tracking-wide uppercase mb-2">Instant Price Estimator</p>
        <h1 className="font-display font-bold text-4xl md:text-5xl mb-3">Sell Your Books</h1>
        <p className="text-cream-300 text-lg">Get a quote in seconds. Pickup from your door. Paid in 24 hours.</p>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10">
        {step < 4 && <StepIndicator current={step} total={4} />}

        {/* ── STEP 0: Search ── */}
        {step === 0 && (
          <div className="animate-fade-in">
            <h2 className="font-display font-bold text-2xl text-forest-800 dark:text-cream-100 text-center mb-6">
              🔍 Find your book
            </h2>

            {/* WhatsApp Quick Sell */}
            <a href={waBase} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 bg-[#25D366]/10 border border-[#25D366]/40 rounded-xl p-4 mb-6 hover:bg-[#25D366]/20 transition-colors group">
              <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center flex-shrink-0">
                <MessageCircle size={20} className="text-white" />
              </div>
              <div>
                <p className="font-semibold text-forest-800 dark:text-cream-100 text-sm">Not sure? WhatsApp us a photo</p>
                <p className="text-xs text-forest-500 dark:text-cream-400">We'll quote instantly · Tap to open WhatsApp</p>
              </div>
              <ChevronRight size={18} className="ml-auto text-forest-400 group-hover:translate-x-1 transition-transform" />
            </a>

            <div className="flex gap-2 mb-4">
              <div className="relative flex-1">
                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-forest-400" />
                <input
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                  placeholder="Title, author, or ISBN..."
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-cream-300 dark:border-forest-600 bg-white dark:bg-forest-800 text-forest-800 dark:text-cream-100 placeholder-forest-300 dark:placeholder-forest-500 focus:outline-none focus:ring-2 focus:ring-forest-400 text-sm"
                />
              </div>
              <button onClick={handleSearch} className="btn-primary px-5">Search</button>
            </div>

            {searched && (
              <div className="space-y-3 mt-4">
                {results.length === 0 ? (
                  <div className="text-center py-8 bg-cream-50 dark:bg-forest-800 rounded-2xl">
                    <p className="text-forest-600 dark:text-cream-300 font-medium mb-1">Book not found in database</p>
                    <p className="text-sm text-forest-400 dark:text-cream-500">
                      <a href={waBase} target="_blank" rel="noopener noreferrer" className="text-amber-500 underline">WhatsApp us</a> with a photo — we'll quote manually!
                    </p>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-forest-500 dark:text-cream-400">{results.length} book{results.length > 1 ? 's' : ''} found</p>
                    {results.map(b => (
                      <div key={b.id}
                        onClick={() => { setSelectedBook(b); setStep(1); }}
                        className="flex gap-4 bg-white dark:bg-forest-800 rounded-2xl p-4 shadow-card border border-cream-100 dark:border-forest-700 cursor-pointer hover:border-forest-400 dark:hover:border-forest-500 hover:shadow-warm transition-all group">
                        <div className={`w-12 h-16 rounded-lg bg-gradient-to-br ${b.coverColor} flex items-center justify-center text-2xl flex-shrink-0`}>📖</div>
                        <div className="flex-1 min-w-0">
                          <p className="font-display font-bold text-forest-800 dark:text-cream-100 truncate">{b.title}</p>
                          <p className="text-sm text-forest-500 dark:text-cream-400">{b.author}</p>
                          <p className="text-xs text-forest-400 dark:text-cream-500 mt-1">MRP ₹{b.mrp} · {b.genre}</p>
                          <div className="mt-1.5">
                            <DemandMeter genre={b.genre} demandLevel={b.demandLevel} />
                          </div>
                        </div>
                        <ChevronRight size={18} className="text-forest-400 self-center group-hover:translate-x-1 transition-transform flex-shrink-0" />
                      </div>
                    ))}
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── STEP 1: Condition ── */}
        {step === 1 && selectedBook && (
          <div className="animate-fade-in">
            <div className="flex items-center gap-3 bg-cream-50 dark:bg-forest-800 rounded-2xl p-4 mb-6 border border-cream-200 dark:border-forest-700">
              <div className={`w-12 h-16 rounded-lg bg-gradient-to-br ${selectedBook.coverColor} flex items-center justify-center text-2xl flex-shrink-0`}>📖</div>
              <div>
                <p className="font-display font-bold text-forest-800 dark:text-cream-100">{selectedBook.title}</p>
                <p className="text-sm text-forest-500 dark:text-cream-400">{selectedBook.author} · MRP ₹{selectedBook.mrp}</p>
                <DemandMeter genre={selectedBook.genre} demandLevel={selectedBook.demandLevel} />
              </div>
            </div>

            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-xl text-forest-800 dark:text-cream-100">Select Condition</h2>
              <button onClick={() => setGuideOpen(true)} className="flex items-center gap-1.5 text-sm text-amber-500 hover:text-amber-600 font-medium">
                <Info size={14} /> Condition Guide
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {CONDITIONS.map(c => {
                const est = Math.round(selectedBook.mrp * CONDITION_PAYOUTS[c]);
                const isSelected = condition === c;
                return (
                  <button key={c} onClick={() => setCondition(c)}
                    className={`text-left p-4 rounded-2xl border-2 transition-all duration-200 ${
                      isSelected
                        ? 'border-forest-700 bg-forest-700/5 dark:bg-forest-600/20'
                        : 'border-cream-200 dark:border-forest-700 hover:border-forest-400 dark:hover:border-forest-500 bg-white dark:bg-forest-800'
                    }`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-display font-bold text-sm text-forest-800 dark:text-cream-100">{c}</span>
                      {isSelected && <CheckCircle size={16} className="text-forest-700" />}
                    </div>
                    <p className="text-xs text-forest-500 dark:text-cream-400 mb-2">
                      {c === 'Like New' ? 'No marks, pristine' :
                       c === 'Good' ? 'Minor wear, clean' :
                       c === 'Acceptable' ? 'Clearly used' : 'Heavy wear'}
                    </p>
                    <p className="font-bold text-lg text-emerald-600 dark:text-emerald-400">₹{est}</p>
                    <p className="text-xs text-forest-400 dark:text-cream-500">{Math.round(CONDITION_PAYOUTS[c] * 100)}% of MRP</p>
                  </button>
                );
              })}
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setStep(0)} className="btn-outline flex-1">← Back</button>
              <button onClick={() => setStep(2)} disabled={!condition} className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed">
                See My Payout →
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 2: Payout ── */}
        {step === 2 && selectedBook && condition && (
          <div className="animate-fade-in">
            <h2 className="font-display font-bold text-2xl text-forest-800 dark:text-cream-100 text-center mb-6">
              💰 Your Estimated Payout
            </h2>

            <div className="bg-gradient-to-br from-forest-700 to-forest-500 rounded-3xl p-8 text-white text-center mb-6 shadow-warm-lg">
              <p className="text-cream-300 mb-2 font-medium">{selectedBook.title}</p>
              <p className="text-cream-400 text-sm mb-4">Condition: {condition}</p>
              <div className="flex items-center justify-center gap-4 mb-4">
                <div>
                  <p className="text-cream-300 text-xs">MRP</p>
                  <p className="text-2xl line-through text-cream-400">₹{selectedBook.mrp}</p>
                </div>
                <div className="text-amber-400 text-2xl font-bold">→</div>
                <div>
                  <p className="text-cream-300 text-xs">Your Payout</p>
                  <p className="font-display font-bold text-5xl text-amber-400">₹{payout}</p>
                </div>
              </div>
              <div className="bg-white/10 rounded-2xl px-4 py-3 inline-block">
                <p className="text-sm font-semibold text-amber-300">
                  🏆 Price Guarantee Badge — We guarantee this price after quality check
                </p>
              </div>
            </div>

            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700/40 rounded-xl p-4 mb-6">
              <p className="text-sm text-emerald-700 dark:text-emerald-400 font-medium">
                🌱 By selling this book, you're saving approximately <strong>0.5 kg of paper</strong> and keeping one book alive!
              </p>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="btn-outline flex-1">← Back</button>
              <button onClick={() => setStep(3)} className="btn-primary flex-1">Schedule Pickup →</button>
            </div>
          </div>
        )}

        {/* ── STEP 3: Pickup Form ── */}
        {step === 3 && (
          <div className="animate-fade-in">
            <h2 className="font-display font-bold text-2xl text-forest-800 dark:text-cream-100 text-center mb-6">
              📦 Pickup Details
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { key: 'name',  label: 'Full Name *',    type: 'text',  placeholder: 'Rahul Sharma'      },
                { key: 'phone', label: 'Phone Number *',  type: 'tel',   placeholder: '9876543210'         },
                { key: 'address', label: 'Pickup Address *', type: 'text', placeholder: 'Flat 4B, Green Park...' },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-sm font-medium text-forest-700 dark:text-cream-300 mb-1">{f.label}</label>
                  <input type={f.type} value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    placeholder={f.placeholder} required
                    className="w-full border border-cream-300 dark:border-forest-600 rounded-xl px-4 py-3 bg-white dark:bg-forest-700 text-forest-800 dark:text-cream-100 placeholder-forest-300 dark:placeholder-forest-500 focus:outline-none focus:ring-2 focus:ring-forest-400 text-sm" />
                </div>
              ))}

              <div>
                <label className="block text-sm font-medium text-forest-700 dark:text-cream-300 mb-1">City *</label>
                <select value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))} required
                  className="w-full border border-cream-300 dark:border-forest-600 rounded-xl px-4 py-3 bg-white dark:bg-forest-700 text-forest-800 dark:text-cream-100 focus:outline-none focus:ring-2 focus:ring-forest-400 text-sm">
                  <option value="">Select city</option>
                  {INDIAN_CITIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-forest-700 dark:text-cream-300 mb-1">Preferred Pickup Date *</label>
                <input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} required
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full border border-cream-300 dark:border-forest-600 rounded-xl px-4 py-3 bg-white dark:bg-forest-700 text-forest-800 dark:text-cream-100 focus:outline-none focus:ring-2 focus:ring-forest-400 text-sm" />
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setStep(2)} className="btn-outline flex-1">← Back</button>
                <button type="submit" className="btn-amber flex-1">Confirm Sell ✓</button>
              </div>
            </form>
          </div>
        )}

        {/* ── STEP 4: Confirmation ── */}
        {step === 4 && (
          <div className="animate-fade-in text-center">
            <div className="text-6xl mb-4">📚</div>
            <h2 className="font-display font-bold text-3xl text-forest-800 dark:text-cream-100 mb-2">
              Your books are in good hands!
            </h2>
            <p className="text-forest-500 dark:text-cream-400 mb-2">Order ID: <strong className="text-forest-800 dark:text-cream-200">{orderId}</strong></p>
            <p className="text-forest-500 dark:text-cream-400 mb-8">
              We'll pick up on <strong>{form.date}</strong> from {form.city}. Payment within 24 hours of quality check.
            </p>

            {/* Karma Score */}
            <div className="bg-gradient-to-br from-forest-50 to-cream-100 dark:from-forest-800 dark:to-forest-700 rounded-3xl p-8 mb-6 border border-forest-100 dark:border-forest-600 shadow-warm">
              <p className="text-amber-500 font-semibold text-sm uppercase tracking-wide mb-4">Your Book Karma</p>
              <KarmaScore sold={booksSold} large />
            </div>

            {/* Env impact */}
            <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-700/40 rounded-2xl p-5 mb-6 text-left">
              <p className="font-semibold text-emerald-700 dark:text-emerald-400 mb-1">🌱 Your Environmental Impact</p>
              <p className="text-sm text-emerald-600 dark:text-emerald-300">
                By selling this book to PageBack, you've saved approximately <strong>0.5 kg of paper</strong> from waste and kept a tree standing. You're a green hero! 🌍
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <a href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hi! My sell order ${orderId} is placed. Just confirming!`)}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3 rounded-xl bg-[#25D366] hover:bg-[#1ebe5a] text-white font-medium transition-colors">
                <MessageCircle size={18} /> WhatsApp for Updates
              </a>
              <button onClick={resetAll} className="btn-outline">Sell Another Book</button>
            </div>
          </div>
        )}
      </div>

      {guideOpen && <ConditionGuide onClose={() => setGuideOpen(false)} />}
    </div>
  );
}
