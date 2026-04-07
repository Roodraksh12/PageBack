import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, X, SlidersHorizontal, BookOpen } from 'lucide-react';
import { books, genres } from '../data/books';
import BookCard from '../components/BookCard';
import BookModal from '../components/BookModal';
import { useApp } from '../context/AppContext';

const CONDITIONS = ['Like New', 'Good', 'Acceptable', 'Poor'];
const LANGUAGES = ['English', 'Hindi', 'Marathi', 'Tamil'];
const BOARDS = ['CBSE', 'ICSE', 'State'];
const SORTS = [
  { val: 'popular',  label: 'Most Popular'    },
  { val: 'low',      label: 'Price: Low → High' },
  { val: 'high',     label: 'Price: High → Low' },
  { val: 'savings',  label: 'Biggest Savings'  },
];

function BookRequestForm({ onSubmit }) {
  const [form, setForm] = useState({ title: '', author: '', budget: '', condition: 'Any' });
  const [done, setDone] = useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    setDone(true);
  };
  if (done) return (
    <div className="text-center py-12">
      <span className="text-5xl block mb-3">🎯</span>
      <h3 className="font-display font-bold text-2xl text-forest-800 dark:text-cream-100 mb-2">Request Submitted!</h3>
      <p className="text-forest-500 dark:text-cream-400">We'll notify you as soon as this book is available.</p>
    </div>
  );
  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-4 py-8">
      <h2 className="font-display font-bold text-2xl text-forest-800 dark:text-cream-100 text-center mb-6">Request a Specific Book</h2>
      {[
        { key: 'title',  label: 'Book Title *', placeholder: "e.g. To Kill a Mockingbird", required: true },
        { key: 'author', label: 'Author',        placeholder: "e.g. Harper Lee"              },
      ].map(f => (
        <div key={f.key}>
          <label className="block text-sm font-medium text-forest-700 dark:text-cream-300 mb-1">{f.label}</label>
          <input
            type="text"
            value={form[f.key]}
            onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
            placeholder={f.placeholder}
            required={f.required}
            className="w-full border border-cream-300 dark:border-forest-600 rounded-xl px-4 py-3 bg-white dark:bg-forest-700 text-forest-800 dark:text-cream-100 placeholder-forest-300 dark:placeholder-forest-500 focus:outline-none focus:ring-2 focus:ring-forest-400 text-sm"
          />
        </div>
      ))}
      <div>
        <label className="block text-sm font-medium text-forest-700 dark:text-cream-300 mb-1">Max Budget (₹)</label>
        <input type="number" value={form.budget} onChange={e => setForm(p => ({ ...p, budget: e.target.value }))} placeholder="e.g. 300"
          className="w-full border border-cream-300 dark:border-forest-600 rounded-xl px-4 py-3 bg-white dark:bg-forest-700 text-forest-800 dark:text-cream-100 placeholder-forest-300 dark:placeholder-forest-500 focus:outline-none focus:ring-2 focus:ring-forest-400 text-sm" />
      </div>
      <div>
        <label className="block text-sm font-medium text-forest-700 dark:text-cream-300 mb-2">Condition Preference</label>
        <div className="flex flex-wrap gap-2">
          {['Any', ...CONDITIONS].map(c => (
            <button key={c} type="button" onClick={() => setForm(p => ({ ...p, condition: c }))}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all ${form.condition === c ? 'bg-forest-700 text-white border-forest-700' : 'border-cream-300 dark:border-forest-600 text-forest-600 dark:text-cream-400 hover:bg-cream-100 dark:hover:bg-forest-700'}`}>
              {c}
            </button>
          ))}
        </div>
      </div>
      <button type="submit" className="btn-primary w-full">Submit Request 🎯</button>
    </form>
  );
}

export default function Buy() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { addBookRequest } = useApp();
  const tab = searchParams.get('tab') || 'browse';
  const genreParam = searchParams.get('genre') || '';

  const [query, setQuery]       = useState('');
  const [selectedGenres, setSelectedGenres] = useState(genreParam ? [genreParam] : []);
  const [conditions, setConditions] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [sort, setSort]         = useState('popular');
  const [filterOpen, setFilterOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  useEffect(() => { if (genreParam) setSelectedGenres([genreParam]); }, [genreParam]);

  const toggleGenre = (g)     => setSelectedGenres(p => p.includes(g) ? p.filter(x => x !== g) : [...p, g]);
  const toggleCondition = (c) => setConditions(p => p.includes(c) ? p.filter(x => x !== c) : [...p, c]);

  const filtered = books
    .filter(b => {
      if (query && !b.title.toLowerCase().includes(query.toLowerCase()) &&
                   !b.author.toLowerCase().includes(query.toLowerCase())) return false;
      if (selectedGenres.length && !selectedGenres.includes(b.genre)) return false;
      if (conditions.length && !conditions.includes(b.condition)) return false;
      if (b.price < priceRange[0] || b.price > priceRange[1]) return false;
      return true;
    })
    .sort((a, b) => {
      if (sort === 'low')     return a.price - b.price;
      if (sort === 'high')    return b.price - a.price;
      if (sort === 'savings') return (b.mrp - b.price) - (a.mrp - a.price);
      return 0;
    });

  const clearFilters = () => {
    setQuery(''); setSelectedGenres([]); setConditions([]);
    setPriceRange([0, 1000]); setSort('popular');
  };
  const hasFilters = query || selectedGenres.length || conditions.length || sort !== 'popular';

  return (
    <div className="page-enter pb-20 md:pb-0">
      {/* Header */}
      <div className="bg-forest-700 dark:bg-forest-900 py-12 px-4 text-white text-center">
        <h1 className="font-display font-bold text-4xl md:text-5xl mb-3">Browse Books</h1>
        <p className="text-cream-300 text-lg">Quality-verified used books at unbeatable prices</p>
      </div>

      {/* Tab toggle */}
      <div className="sticky top-16 z-30 bg-cream-100/95 dark:bg-forest-900/95 backdrop-blur-md border-b border-cream-200 dark:border-forest-700 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <div className="flex bg-cream-200 dark:bg-forest-800 rounded-xl p-1">
            {[{ val: 'browse', label: '📚 Browse' }, { val: 'request', label: '🎯 Request a Book' }].map(t => (
              <button key={t.val} onClick={() => setSearchParams({ tab: t.val })}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${tab === t.val ? 'bg-white dark:bg-forest-700 shadow-sm text-forest-800 dark:text-cream-100' : 'text-forest-500 dark:text-cream-400 hover:text-forest-700 dark:hover:text-cream-200'}`}>
                {t.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {tab === 'request' ? (
        <div className="max-w-7xl mx-auto px-4 py-8">
          <BookRequestForm onSubmit={addBookRequest} />
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
          {/* Search + Sort bar */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-forest-400" />
              <input type="text" value={query} onChange={e => setQuery(e.target.value)}
                placeholder="Search by title or author..."
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-cream-300 dark:border-forest-600 bg-white dark:bg-forest-800 text-forest-800 dark:text-cream-100 placeholder-forest-300 dark:placeholder-forest-500 focus:outline-none focus:ring-2 focus:ring-forest-400 text-sm" />
            </div>
            <select value={sort} onChange={e => setSort(e.target.value)}
              className="px-4 py-3 rounded-xl border border-cream-300 dark:border-forest-600 bg-white dark:bg-forest-800 text-forest-700 dark:text-cream-200 text-sm focus:outline-none focus:ring-2 focus:ring-forest-400">
              {SORTS.map(s => <option key={s.val} value={s.val}>{s.label}</option>)}
            </select>
            <button onClick={() => setFilterOpen(!filterOpen)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium transition-colors ${filterOpen ? 'bg-forest-700 text-white border-forest-700' : 'border-cream-300 dark:border-forest-600 text-forest-700 dark:text-cream-300 bg-white dark:bg-forest-800 hover:bg-cream-100 dark:hover:bg-forest-700'}`}>
              <SlidersHorizontal size={16} /> Filters
              {(selectedGenres.length + conditions.length) > 0 && (
                <span className="bg-amber-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {selectedGenres.length + conditions.length}
                </span>
              )}
            </button>
            {hasFilters && (
              <button onClick={clearFilters} className="flex items-center gap-1.5 px-4 py-3 text-sm text-red-500 hover:text-red-700 font-medium">
                <X size={16} /> Clear
              </button>
            )}
          </div>

          <div className="flex gap-8">
            {/* Filters sidebar */}
            {filterOpen && (
              <div className="hidden md:block w-64 flex-shrink-0">
                <div className="bg-white dark:bg-forest-800 rounded-2xl p-6 shadow-card border border-cream-100 dark:border-forest-700 sticky top-32">
                  <h3 className="font-display font-bold text-lg text-forest-800 dark:text-cream-100 mb-4">Filters</h3>

                  {/* Genre */}
                  <div className="mb-5">
                    <p className="text-sm font-semibold text-forest-700 dark:text-cream-300 mb-2">Genre</p>
                    <div className="flex flex-wrap gap-2">
                      {genres.map(g => (
                        <button key={g.id} onClick={() => toggleGenre(g.id)}
                          className={`text-xs px-2.5 py-1.5 rounded-lg border transition-all ${selectedGenres.includes(g.id) ? 'bg-forest-700 text-white border-forest-700' : 'border-cream-200 dark:border-forest-600 text-forest-600 dark:text-cream-400 hover:bg-cream-100 dark:hover:bg-forest-700'}`}>
                          {g.icon} {g.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Condition */}
                  <div className="mb-5">
                    <p className="text-sm font-semibold text-forest-700 dark:text-cream-300 mb-2">Condition</p>
                    <div className="space-y-2">
                      {CONDITIONS.map(c => (
                        <label key={c} className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" checked={conditions.includes(c)} onChange={() => toggleCondition(c)}
                            className="rounded accent-forest-700" />
                          <span className="text-sm text-forest-600 dark:text-cream-400">{c}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Price range */}
                  <div className="mb-5">
                    <p className="text-sm font-semibold text-forest-700 dark:text-cream-300 mb-2">
                      Price: ₹{priceRange[0]} – ₹{priceRange[1]}
                    </p>
                    <input type="range" min="0" max="1000" step="50" value={priceRange[1]}
                      onChange={e => setPriceRange([priceRange[0], +e.target.value])}
                      className="w-full accent-forest-700" />
                  </div>
                </div>
              </div>
            )}

            {/* Books grid */}
            <div className="flex-1">
              <p className="text-sm text-forest-400 dark:text-cream-500 mb-4">
                {filtered.length} book{filtered.length !== 1 ? 's' : ''} found
              </p>
              {filtered.length === 0 ? (
                <div className="text-center py-20">
                  <BookOpen size={48} className="mx-auto text-forest-300 dark:text-forest-600 mb-4" />
                  <p className="font-display text-xl text-forest-500 dark:text-cream-400 mb-2">No books found</p>
                  <p className="text-sm text-forest-400 dark:text-cream-500">Try different filters or <button onClick={clearFilters} className="text-amber-500 underline">clear all</button></p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                  {filtered.map(b => <BookCard key={b.id} book={b} onView={setSelected} />)}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {selected && <BookModal book={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
