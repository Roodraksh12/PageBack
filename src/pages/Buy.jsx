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
    <div className="text-center py-12 border border-black dark:border-white p-8">
      <h3 className="font-bold text-3xl uppercase tracking-tighter text-black dark:text-white mb-2">Request Submitted</h3>
      <p className="text-neutral-500 text-xs font-bold uppercase tracking-widest">We'll notify you when it arrives.</p>
    </div>
  );
  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-6 py-8">
      <h2 className="font-bold text-4xl uppercase tracking-tighter text-black dark:text-white text-center mb-8 pb-4 border-b border-black dark:border-white">Request Title</h2>
      {[
        { key: 'title',  label: 'Book Title *', placeholder: "e.g. To Kill a Mockingbird", required: true },
        { key: 'author', label: 'Author',        placeholder: "e.g. Harper Lee"              },
      ].map(f => (
        <div key={f.key}>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-black dark:text-white mb-2">{f.label}</label>
          <input
            type="text"
            value={form[f.key]}
            onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
            placeholder={f.placeholder}
            required={f.required}
            className="w-full border border-black dark:border-white px-4 py-3 bg-transparent text-black dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-black text-sm"
          />
        </div>
      ))}
      <div>
        <label className="block text-[10px] font-bold uppercase tracking-widest text-black dark:text-white mb-2">Max Budget (₹)</label>
        <input type="number" value={form.budget} onChange={e => setForm(p => ({ ...p, budget: e.target.value }))} placeholder="e.g. 300"
          className="w-full border border-black dark:border-white px-4 py-3 bg-transparent text-black dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-black text-sm" />
      </div>
      <div>
        <label className="block text-[10px] font-bold uppercase tracking-widest text-black dark:text-white mb-2">Condition Preference</label>
        <div className="flex flex-wrap gap-2 mt-2">
          {['Any', ...CONDITIONS].map(c => (
            <button key={c} type="button" onClick={() => setForm(p => ({ ...p, condition: c }))}
              className={`px-4 py-2 text-[10px] uppercase font-bold tracking-widest border transition-colors ${form.condition === c ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white' : 'border-neutral-300 dark:border-neutral-700 text-neutral-500 hover:border-black dark:hover:border-white'}`}>
              {c}
            </button>
          ))}
        </div>
      </div>
      <button type="submit" className="w-full bg-black text-white dark:bg-white dark:text-black px-6 py-4 text-xs font-bold uppercase tracking-widest hover:opacity-80 transition-opacity mt-8">Submit Request</button>
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
      <div className="bg-black text-white p-12 border-b border-black text-center">
        <h1 className="font-bold text-5xl md:text-7xl uppercase tracking-tighter mb-4">Inventory</h1>
        <p className="text-neutral-400 text-sm font-bold uppercase tracking-widest max-w-lg mx-auto">Verified used books at unbeatable prices</p>
      </div>

      {/* Tab toggle */}
      <div className="sticky top-16 z-30 bg-white dark:bg-black border-b border-black dark:border-white px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <div className="flex border border-black dark:border-white">
            {[{ val: 'browse', label: 'Browse' }, { val: 'request', label: 'Request' }].map(t => (
              <button key={t.val} onClick={() => setSearchParams({ tab: t.val })}
                className={`px-6 py-2 text-[10px] uppercase font-bold tracking-widest transition-colors ${tab === t.val ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-transparent text-neutral-500 hover:text-black dark:hover:text-white'}`}>
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
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" />
              <input type="text" value={query} onChange={e => setQuery(e.target.value)}
                placeholder="Search..."
                className="w-full pl-12 pr-4 py-4 border border-black dark:border-white bg-transparent text-black dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-black text-[10px] uppercase font-bold tracking-widest" />
            </div>
            <select value={sort} onChange={e => setSort(e.target.value)}
              className="px-4 py-4 border border-black dark:border-white bg-transparent text-black dark:text-white text-[10px] uppercase font-bold tracking-widest focus:outline-none focus:ring-1 focus:ring-black">
              {SORTS.map(s => <option key={s.val} value={s.val}>{s.label}</option>)}
            </select>
            <button onClick={() => setFilterOpen(!filterOpen)}
              className={`flex items-center justify-center gap-2 px-6 py-4 border transition-colors ${filterOpen ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white' : 'border-black dark:border-white text-black dark:text-white bg-transparent hover:bg-neutral-100 dark:hover:bg-neutral-900'} text-[10px] uppercase font-bold tracking-widest`}>
              Filters
              {(selectedGenres.length + conditions.length) > 0 && (
                <span className="ml-1 inline-block">[{selectedGenres.length + conditions.length}]</span>
              )}
            </button>
            {hasFilters && (
              <button onClick={clearFilters} className="px-6 py-4 text-[10px] uppercase font-bold tracking-widest border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-colors">
                Clear
              </button>
            )}
          </div>

          <div className="flex gap-8">
            {/* Filters sidebar */}
            {filterOpen && (
              <div className="hidden md:block w-64 flex-shrink-0">
                <div className="bg-white dark:bg-black p-6 border border-black dark:border-white sticky top-32">
                  <h3 className="font-bold text-2xl uppercase tracking-tighter text-black dark:text-white mb-6 border-b border-black dark:border-white pb-2">Filters</h3>

                  {/* Genre */}
                  <div className="mb-8">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-4">Genre</p>
                    <div className="flex flex-wrap gap-2">
                      {genres.map(g => (
                        <button key={g.id} onClick={() => toggleGenre(g.id)}
                          className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 border transition-colors ${selectedGenres.includes(g.id) ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white' : 'border-neutral-300 dark:border-neutral-700 text-neutral-500 hover:border-black dark:hover:border-white'}`}>
                          {g.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Condition */}
                  <div className="mb-8">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-4">Condition</p>
                    <div className="space-y-3">
                      {CONDITIONS.map(c => (
                        <label key={c} className="flex items-center gap-3 cursor-pointer group" onClick={(e) => { e.preventDefault(); toggleCondition(c); }}>
                          <div className={`w-4 h-4 border flex-shrink-0 transition-colors ${conditions.includes(c) ? 'bg-black border-black dark:bg-white dark:border-white' : 'bg-transparent border-neutral-400 group-hover:border-black dark:group-hover:border-white'}`} />
                          <span className="text-[10px] font-bold uppercase tracking-widest text-black dark:text-white">{c}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Price range */}
                  <div className="mb-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-4">
                      Price: ₹{priceRange[0]} – ₹{priceRange[1]}
                    </p>
                    <input type="range" min="0" max="1000" step="50" value={priceRange[1]}
                      onChange={e => setPriceRange([priceRange[0], +e.target.value])}
                      className="w-full h-1 bg-neutral-200 dark:bg-neutral-800 appearance-none outline-none accent-black dark:accent-white cursor-pointer" />
                  </div>
                </div>
              </div>
            )}

            {/* Books grid */}
            <div className="flex-1">
              <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-6">
                Showing {filtered.length} Results
              </p>
              {filtered.length === 0 ? (
                <div className="text-center py-20 border border-black dark:border-white p-8">
                  <h3 className="font-bold text-3xl uppercase tracking-tighter text-black dark:text-white mb-2">No Results</h3>
                  <p className="text-neutral-500 text-xs font-bold uppercase tracking-widest mb-6">Try adjusting your filters</p>
                  <button onClick={clearFilters} className="border border-black dark:border-white px-6 py-4 text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors">
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
