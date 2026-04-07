import { useState, useRef } from 'react';
import { CheckCircle, MessageCircle, Info, PenLine, Camera, X } from 'lucide-react';
import { genres } from '../data/books';
import { useApp } from '../context/AppContext';
import { useAdmin } from '../context/AdminContext';
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
const CONDITION_DESC = {
  'Like New':   'No marks, pristine',
  'Good':       'Minor wear, clean',
  'Acceptable': 'Clearly used',
  'Poor':       'Heavy wear',
};
const INDIAN_CITIES = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata', 'Ahmedabad', 'Jaipur', 'Surat'];

const COVER_COLORS = [
  'from-violet-400 to-purple-600',
  'from-rose-400 to-pink-600',
  'from-sky-400 to-blue-600',
  'from-amber-400 to-orange-500',
  'from-emerald-400 to-teal-600',
  'from-fuchsia-400 to-indigo-600',
];

function StepIndicator({ current, total }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className={`w-8 h-8 border border-black dark:border-white flex items-center justify-center text-xs font-bold uppercase transition-colors ${
            i < current ? 'bg-black text-white dark:bg-white dark:text-black' : i === current ? 'bg-neutral-200 dark:bg-neutral-800 text-black dark:text-white' : 'bg-transparent text-neutral-400 border-neutral-300 dark:border-neutral-700'
          }`}>
            {i < current ? '✓' : i + 1}
          </div>
          {i < total - 1 && (
            <div className={`w-12 h-px transition-colors ${i < current ? 'bg-black dark:bg-white' : 'bg-neutral-300 dark:bg-neutral-700'}`} />
          )}
        </div>
      ))}
    </div>
  );
}

export default function Sell() {
  const { addBookSold, booksSold, whatsappNumber } = useApp();
  const { addSellRequest } = useAdmin();
  const [step, setStep]             = useState(0);
  const [selectedBook, setSelectedBook] = useState(null);
  const [condition, setCondition]   = useState('');
  const [guideOpen, setGuideOpen]   = useState(false);
  const [form, setForm]             = useState({ name: '', address: '', city: '', phone: '', date: '' });
  const [orderId, setOrderId]       = useState('');

  // Manual entry state
  const [showManualForm, setShowManualForm] = useState(false);
  const [manualBook, setManualBook] = useState({
    title: '', author: '', mrp: '', genre: 'Fiction', condition: '', image: null,
  });
  const [manualErrors, setManualErrors] = useState({});
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setManualBook(p => ({ ...p, image: ev.target.result }));
    reader.readAsDataURL(file);
  };

  const validateManual = () => {
    const errs = {};
    if (!manualBook.title.trim()) errs.title = 'Book title is required';
    if (!manualBook.author.trim()) errs.author = 'Author name is required';
    if (!manualBook.mrp || isNaN(manualBook.mrp) || Number(manualBook.mrp) <= 0)
      errs.mrp = 'Enter a valid MRP (e.g. 350)';
    if (!manualBook.condition) errs.condition = 'Please select the book condition';
    return errs;
  };

  const handleManualSubmit = () => {
    const errs = validateManual();
    if (Object.keys(errs).length > 0) { setManualErrors(errs); return; }
    const randomColor = COVER_COLORS[Math.floor(Math.random() * COVER_COLORS.length)];
    setSelectedBook({
      id: `custom_${Date.now()}`,
      title: manualBook.title.trim(),
      author: manualBook.author.trim(),
      mrp: Number(manualBook.mrp),
      genre: manualBook.genre,
      demandLevel: 'medium',
      coverColor: randomColor,
      image: manualBook.image,
      isCustom: true,
    });
    setCondition(manualBook.condition);
    setStep(2); // skip condition step — go straight to payout
  };

  const payout = selectedBook && condition
    ? Math.round(selectedBook.mrp * CONDITION_PAYOUTS[condition])
    : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const sellReqInfo = {
       title: selectedBook.title,
       author: selectedBook.author,
       mrp: selectedBook.mrp,
       genre: selectedBook.genre,
       condition: condition,
       image: selectedBook.image,
       user: form
    };
    const id = await addSellRequest(sellReqInfo);
    setOrderId(id);
    await addBookSold(1);
    setStep(4);
  };

  const resetAll = () => {
    setStep(0);
    setSelectedBook(null); setCondition('');
    setForm({ name: '', address: '', city: '', phone: '', date: '' });
    setOrderId('');
    setShowManualForm(false);
    setManualBook({ title: '', author: '', mrp: '', genre: 'Fiction', condition: '', image: null });
    setManualErrors({});
  };

  const waLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hi! I want to sell a book — can you give me a quick quote?`)}`;

  return (
    <div className="page-enter pb-20 md:pb-0">
      {/* Header */}
      <div className="bg-black text-white p-12 border-b border-black text-center">
        <h1 className="font-bold text-5xl md:text-7xl mb-4 tracking-tighter uppercase">Sell Books</h1>
        <p className="text-neutral-400 text-sm font-bold uppercase tracking-widest max-w-lg mx-auto">Instant Quote. Free Pickup. 24h Payout.</p>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10">
        {step < 4 && <StepIndicator current={step} total={4} />}

        {/* ── STEP 0: Choose how to sell ── */}
        {step === 0 && (
          <div className="animate-fade-in">
            <div className="text-center mb-12">
              <h2 className="font-bold text-3xl uppercase tracking-tighter mb-2 text-black dark:text-white">
                Choose Method
              </h2>
            </div>
            {!showManualForm ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* WhatsApp Card */}
                <a
                  href={waLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col items-center text-center p-8 border border-black dark:border-white hover:bg-[#25D366] hover:text-white hover:border-[#25D366] transition-colors"
                >
                  <MessageCircle size={32} className="mb-4" />
                  <p className="font-bold text-xl uppercase tracking-widest mb-2">WhatsApp</p>
                  <p className="text-xs opacity-70 mb-6 px-4">Send a photo. Get a fast quote.</p>
                  <span className="mt-auto border border-current px-6 py-2 text-xs font-bold uppercase tracking-widest group-hover:bg-white group-hover:text-[#25D366] transition-colors">
                    Message Us
                  </span>
                </a>

                {/* Manual Entry Card */}
                <button
                  onClick={() => setShowManualForm(true)}
                  className="group flex flex-col items-center text-center p-8 border border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                >
                  <PenLine size={32} className="mb-4" />
                  <p className="font-bold text-xl uppercase tracking-widest mb-2">Manual</p>
                  <p className="text-xs opacity-70 mb-6 px-4">Enter book details directly.</p>
                  <span className="mt-auto border border-current px-6 py-2 text-xs font-bold uppercase tracking-widest group-hover:bg-white group-hover:text-black dark:group-hover:bg-black dark:group-hover:text-white transition-colors">
                    Start Form
                  </span>
                </button>
              </div>
            ) : (
              /* ── Manual Entry Form ── */
              <div className="w-full bg-white dark:bg-black border border-black dark:border-white">

                {/* Form Header */}
                <div className="flex items-center gap-2 bg-black text-white dark:bg-white dark:text-black py-4 px-6 border-b border-black dark:border-white">
                  <PenLine size={18} />
                  <p className="font-bold text-lg uppercase tracking-widest">Book Details</p>
                </div>

                <div className="p-8 space-y-6">

                  {/* ── Book Cover Image Upload ── */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-black dark:text-white mb-2">
                      Book Photo <span className="text-neutral-500 font-normal ml-2">(optional but recommended)</span>
                    </label>

                    {manualBook.image ? (
                      <div className="relative w-full border border-black dark:border-white bg-neutral-50 dark:bg-neutral-900 p-2">
                        <img
                          src={manualBook.image}
                          alt="Book cover"
                          className="w-full max-h-52 object-contain"
                        />
                        <button
                          type="button"
                          onClick={() => setManualBook(p => ({ ...p, image: null }))}
                          className="absolute top-4 right-4 w-8 h-8 bg-red-600 flex items-center justify-center text-white hover:bg-red-700 transition-colors"
                        >
                          <X size={14} />
                        </button>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="absolute bottom-4 right-4 flex items-center gap-1.5 bg-black text-white px-4 py-2 text-[10px] uppercase font-bold tracking-widest hover:bg-neutral-800 transition-colors"
                        >
                          <Camera size={12} /> Change
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full border border-dashed border-neutral-400 hover:border-black dark:hover:border-white py-12 flex flex-col items-center gap-3 text-neutral-500 hover:text-black dark:hover:text-white transition-colors bg-transparent"
                      >
                        <Camera size={28} />
                        <p className="text-xs uppercase font-bold tracking-widest">Tap to upload a photo</p>
                        <p className="text-[10px] uppercase tracking-widest font-bold opacity-60">JPG, PNG — helps us verify faster</p>
                      </button>
                    )}

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-black dark:text-white mb-2">Book Title *</label>
                    <input
                      type="text"
                      value={manualBook.title}
                      onChange={e => { setManualBook(p => ({ ...p, title: e.target.value })); setManualErrors(p => ({ ...p, title: '' })); }}
                      placeholder="e.g. Harry Potter and the Philosopher's Stone"
                      className={`w-full border px-4 py-3 bg-transparent text-black dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-black text-sm ${manualErrors.title ? 'border-red-500' : 'border-black dark:border-white'}`}
                    />
                    {manualErrors.title && <p className="text-[10px] font-bold uppercase tracking-widest text-red-500 mt-2">{manualErrors.title}</p>}
                  </div>

                  {/* Author */}
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-black dark:text-white mb-2">Author Name *</label>
                    <input
                      type="text"
                      value={manualBook.author}
                      onChange={e => { setManualBook(p => ({ ...p, author: e.target.value })); setManualErrors(p => ({ ...p, author: '' })); }}
                      placeholder="e.g. J.K. Rowling"
                      className={`w-full border px-4 py-3 bg-transparent text-black dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-black text-sm ${manualErrors.author ? 'border-red-500' : 'border-black dark:border-white'}`}
                    />
                    {manualErrors.author && <p className="text-[10px] font-bold uppercase tracking-widest text-red-500 mt-2">{manualErrors.author}</p>}
                  </div>

                  {/* MRP + Genre */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-black dark:text-white mb-2">MRP (₹) *</label>
                      <input
                        type="number"
                        min="1"
                        value={manualBook.mrp}
                        onChange={e => { setManualBook(p => ({ ...p, mrp: e.target.value })); setManualErrors(p => ({ ...p, mrp: '' })); }}
                        placeholder="e.g. 499"
                        className={`w-full border px-4 py-3 bg-transparent text-black dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-black text-sm ${manualErrors.mrp ? 'border-red-500' : 'border-black dark:border-white'}`}
                      />
                      {manualErrors.mrp && <p className="text-[10px] font-bold uppercase tracking-widest text-red-500 mt-2">{manualErrors.mrp}</p>}
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-black dark:text-white mb-2">Genre</label>
                      <select
                        value={manualBook.genre}
                        onChange={e => setManualBook(p => ({ ...p, genre: e.target.value }))}
                        className="w-full border border-black dark:border-white px-4 py-3 bg-transparent text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-black text-sm uppercase"
                      >
                        {genres.map(g => <option key={g.id} value={g.id}>{g.icon} {g.label}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* ── Condition Selector ── */}
                  <div className="pt-2">
                    <div className="flex items-center justify-between mb-3">
                      <label className="text-[10px] font-bold uppercase tracking-widest text-black dark:text-white">
                        Book Condition *
                      </label>
                      <button
                        type="button"
                        onClick={() => setGuideOpen(true)}
                        className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-neutral-500 hover:text-black dark:hover:text-white transition-colors"
                      >
                        <Info size={12} /> Condition Guide
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {CONDITIONS.map(c => {
                        const mrpVal = Number(manualBook.mrp);
                        const est = mrpVal > 0 ? Math.round(mrpVal * CONDITION_PAYOUTS[c]) : null;
                        const isSelected = manualBook.condition === c;
                        return (
                          <button
                            key={c}
                            type="button"
                            onClick={() => { setManualBook(p => ({ ...p, condition: c })); setManualErrors(p => ({ ...p, condition: '' })); }}
                            className={`text-left p-6 border transition-colors ${
                              isSelected
                                ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black'
                                : 'border-neutral-300 dark:border-neutral-700 hover:border-black dark:hover:border-white bg-transparent text-black dark:text-white'
                            }`}
                          >
                            <div className="flex items-start justify-between mb-2">
                              <span className="font-bold text-lg uppercase tracking-tighter">{c}</span>
                              {isSelected && <CheckCircle size={18} className={isSelected ? 'text-white dark:text-black' : 'text-neutral-300'} />}
                            </div>
                            <p className={`text-xs mb-4 ${isSelected ? 'opacity-80' : 'text-neutral-500'}`}>{CONDITION_DESC[c]}</p>
                            {est !== null ? (
                              <p className={`font-bold text-2xl ${isSelected ? 'text-white dark:text-black' : 'text-black dark:text-white'}`}>
                                ₹{est} <span className="text-[10px] font-bold uppercase tracking-widest ml-1">payout</span>
                              </p>
                            ) : (
                              <p className={`text-[10px] font-bold uppercase tracking-widest ${isSelected ? 'opacity-60' : 'text-neutral-400'}`}>[{Math.round(CONDITION_PAYOUTS[c] * 100)}% MRP]</p>
                            )}
                          </button>
                        );
                      })}
                    </div>
                    {manualErrors.condition && <p className="text-[10px] font-bold uppercase tracking-widest text-red-500 mt-2">{manualErrors.condition}</p>}
                  </div>

                  {/* MRP info tip */}
                  <div className="flex items-start gap-4 border border-black dark:border-neutral-700 bg-neutral-100 dark:bg-neutral-900 p-6 mt-4">
                    <Info size={16} className="text-black dark:text-white flex-shrink-0 mt-0.5" />
                    <p className="text-xs font-bold uppercase tracking-widest text-black dark:text-white leading-relaxed">
                      Check the back cover for the MRP. Our team will verify this at pickup.
                    </p>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => { setShowManualForm(false); setManualErrors({}); }}
                      className="border border-black dark:border-white px-6 py-4 text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors w-1/3 text-center"
                    >
                      Back
                    </button>
                    <button type="button" onClick={handleManualSubmit} className="bg-black text-white dark:bg-white dark:text-black px-6 py-4 text-xs font-bold uppercase tracking-widest hover:opacity-80 transition-opacity disabled:opacity-30 flex-1 text-center">
                      Get Estimate
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── STEP 1: Condition (only reached via future non-manual flows) ── */}
        {step === 1 && selectedBook && (
          <div className="animate-fade-in">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-neutral-100 dark:bg-neutral-900 border border-black dark:border-white p-6 mb-8">
              <div className="w-16 h-20 bg-neutral-200 dark:bg-neutral-800 border border-black dark:border-white flex items-center justify-center flex-shrink-0">
                <span className="text-[10px] uppercase font-bold text-neutral-500">Img</span>
              </div>
              <div className="flex-1">
                <p className="font-bold text-xl uppercase tracking-tighter mb-1 text-black dark:text-white">{selectedBook.title}</p>
                <p className="text-xs uppercase tracking-widest text-neutral-500 mb-2">{selectedBook.author} · MRP ₹{selectedBook.mrp}</p>
                <DemandMeter genre={selectedBook.genre} demandLevel={selectedBook.demandLevel} />
              </div>
            </div>

            <div className="flex items-center justify-between mb-4 border-b border-black dark:border-neutral-700 pb-2">
              <h2 className="font-bold text-2xl uppercase tracking-tighter text-black dark:text-white">Condition</h2>
              <button onClick={() => setGuideOpen(true)} className="flex items-center gap-1.5 text-xs uppercase tracking-widest font-bold text-neutral-400 hover:text-black dark:hover:text-white transition-colors">
                <Info size={14} /> Guide
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {CONDITIONS.map(c => {
                const est = Math.round(selectedBook.mrp * CONDITION_PAYOUTS[c]);
                const isSelected = condition === c;
                return (
                  <button key={c} onClick={() => setCondition(c)}
                    className={`text-left p-6 border transition-colors flex flex-col justify-between ${
                      isSelected
                        ? 'border-black bg-black text-white dark:border-white dark:bg-white dark:text-black'
                        : 'border-neutral-300 dark:border-neutral-700 bg-transparent hover:border-black dark:hover:border-white'
                    }`}>
                    <div className="w-full flex items-start justify-between mb-2">
                      <span className="font-bold text-lg uppercase tracking-tighter">{c}</span>
                      {isSelected && <CheckCircle size={18} className={isSelected ? 'text-white dark:text-black' : 'text-neutral-300'} />}
                    </div>
                    <p className={`text-xs mb-4 ${isSelected ? 'opacity-80' : 'text-neutral-500'}`}>{CONDITION_DESC[c]}</p>
                    <div className="mt-auto">
                      <p className={`font-bold text-2xl ${isSelected ? 'text-white dark:text-black' : 'text-black dark:text-white'}`}>₹{est}</p>
                      <p className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${isSelected ? 'opacity-60' : 'text-neutral-400'}`}>[{Math.round(CONDITION_PAYOUTS[c] * 100)}% MRP]</p>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="flex gap-4 mt-8">
              <button onClick={() => setStep(0)} className="border border-black dark:border-white px-6 py-4 text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors w-1/3 text-center">
                Back
              </button>
              <button onClick={() => setStep(2)} disabled={!condition} className="bg-black text-white dark:bg-white dark:text-black px-6 py-4 text-xs font-bold uppercase tracking-widest hover:opacity-80 transition-opacity disabled:opacity-30 disabled:cursor-not-allowed flex-1 text-center">
                View Payout
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 2: Payout ── */}
        {step === 2 && selectedBook && condition && (
          <div className="animate-fade-in">
            <h2 className="font-bold text-4xl uppercase tracking-tighter text-black dark:text-white text-center mb-8 border-b border-black dark:border-white pb-4">
              Payout
            </h2>

            <div className="bg-black text-white p-10 border border-black text-center mb-8">

              {/* Book cover preview if uploaded */}
              {selectedBook.image && (
                <div className="flex justify-center mb-6">
                  <img
                    src={selectedBook.image}
                    alt={selectedBook.title}
                    className="w-24 h-32 object-cover border border-white"
                  />
                </div>
              )}

              <p className="font-bold text-2xl uppercase tracking-tighter mb-2">{selectedBook.title}</p>
              <p className="text-xs text-neutral-400 uppercase tracking-widest mb-4">{selectedBook.author}</p>
              
              {selectedBook.isCustom && (
                <span className="inline-flex items-center gap-1 text-[10px] uppercase font-bold text-neutral-500 mb-6 border border-neutral-700 px-3 py-1">
                  <PenLine size={10} /> Needs Verification
                </span>
              )}
              
              <div className="grid grid-cols-3 items-center mt-6 border-t border-neutral-800 pt-8 gap-4 px-4">
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-neutral-500 mb-1">MRP</p>
                  <p className="text-lg line-through text-neutral-400">₹{selectedBook.mrp}</p>
                </div>
                <div className="text-neutral-500 text-lg mx-auto">→</div>
                <div>
                  <p className="text-[10px] uppercase font-bold tracking-widest text-neutral-500 mb-1">Quote</p>
                  <p className="font-bold text-4xl text-white">₹{payout}</p>
                </div>
              </div>

              <div className="mt-8 border border-neutral-800 px-6 py-4">
                <p className="text-xs font-bold uppercase tracking-widest text-neutral-400">
                  Value Guaranteed Post Verification
                </p>
              </div>
            </div>

            <div className="border-l-4 border-black dark:border-white px-6 py-4 mb-8 bg-neutral-100 dark:bg-neutral-900">
              <p className="text-xs font-bold uppercase tracking-widest text-black dark:text-white">
                Eco Impact
              </p>
              <p className="text-sm mt-1 text-neutral-600 dark:text-neutral-400">
                You are repurposing approx. <strong>0.5 KG of paper</strong> and reducing global CO2 footprint.
              </p>
            </div>

            <div className="flex gap-3">
              <button onClick={() => { setStep(0); setShowManualForm(true); }} className="btn-outline flex-1">← Back</button>
              <button onClick={() => setStep(3)} className="btn-primary flex-1">Schedule Pickup →</button>
            </div>
          </div>
        )}

        {/* ── STEP 3: Pickup Form ── */}
        {step === 3 && (
          <div className="animate-fade-in">
            <h2 className="font-bold text-3xl uppercase tracking-tighter text-black dark:text-white text-center mb-8 pb-4 border-b border-black dark:border-white">
              Pickup Details
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {[
                { key: 'name',    label: 'Full Name',       type: 'text', placeholder: 'Rahul Sharma'           },
                { key: 'phone',   label: 'Phone Number',    type: 'tel',  placeholder: '9876543210'              },
                { key: 'address', label: 'Pickup Address',  type: 'text', placeholder: 'Flat 4B, Green Park...' },
              ].map(f => (
                <div key={f.key}>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-black dark:text-white mb-2">{f.label} *</label>
                  <input type={f.type} value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                    placeholder={f.placeholder} required
                    className="w-full border border-black dark:border-white px-4 py-3 bg-transparent text-black dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-black text-sm" />
                </div>
              ))}

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-black dark:text-white mb-2">City *</label>
                <select value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))} required
                  className="w-full border border-black dark:border-white px-4 py-3 bg-transparent text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-black text-sm uppercase">
                  <option value="">Select city</option>
                  {INDIAN_CITIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-black dark:text-white mb-2">Preferred Payout Method *</label>
                <select value={form.payoutMethod || ''} onChange={e => setForm(p => ({ ...p, payoutMethod: e.target.value }))} required
                  className="w-full border border-black dark:border-white px-4 py-3 bg-transparent text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-black text-[10px] uppercase font-bold tracking-widest">
                  <option value="">Select payout method</option>
                  <option value="UPI">UPI</option>
                  <option value="NEFT">Bank Transfer (NEFT)</option>
                </select>
              </div>

              {form.payoutMethod === 'UPI' && (
                <div className="animate-fade-in animate-duration-150">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-black dark:text-white mb-2">UPI ID *</label>
                  <input type="text" value={form.upiId || ''} onChange={e => setForm(p => ({ ...p, upiId: e.target.value }))} required placeholder="e.g. name@okhdfcbank"
                    className="w-full border border-black dark:border-white px-4 py-3 bg-transparent text-black dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-black text-sm" />
                </div>
              )}

              {form.payoutMethod === 'NEFT' && (
                <div className="animate-fade-in animate-duration-150 space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-black dark:text-white mb-2">Account Number *</label>
                    <input type="text" value={form.bankAcc || ''} onChange={e => setForm(p => ({ ...p, bankAcc: e.target.value }))} required placeholder="e.g. 1234567890"
                      className="w-full border border-black dark:border-white px-4 py-3 bg-transparent text-black dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-black text-sm" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase tracking-widest text-black dark:text-white mb-2">IFSC Code *</label>
                    <input type="text" value={form.ifsc || ''} onChange={e => setForm(p => ({ ...p, ifsc: e.target.value }))} required placeholder="e.g. HDFC0001234"
                      className="w-full border border-black dark:border-white px-4 py-3 bg-transparent text-black dark:text-white placeholder-neutral-400 focus:outline-none focus:ring-1 focus:ring-black text-sm uppercase" />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-black dark:text-white mb-2">Preferred Pickup Date *</label>
                <input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} required
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full border border-black dark:border-white px-4 py-3 bg-transparent text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-black text-sm uppercase font-mono" />
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setStep(2)} className="border border-black dark:border-white px-6 py-4 text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors flex-1 text-center">Back</button>
                <button type="submit" className="bg-black text-white dark:bg-white dark:text-black px-6 py-4 text-xs font-bold uppercase tracking-widest hover:opacity-80 transition-opacity flex-1 text-center">Confirm Sell</button>
              </div>
            </form>
          </div>
        )}

        {/* ── STEP 4: Confirmation ── */}
        {step === 4 && (
          <div className="animate-fade-in text-center border border-black dark:border-white p-10 mt-8">
            <h2 className="font-bold text-4xl uppercase tracking-tighter text-black dark:text-white mb-2">
              Success
            </h2>
            <p className="text-neutral-500 mb-8 uppercase tracking-widest text-xs font-bold">Order Confirmed</p>
            
            <div className="bg-black text-white dark:bg-white dark:text-black py-4 px-6 inline-block font-mono text-xl mb-8">
              ID: {orderId}
            </div>
            
            <p className="text-sm font-bold uppercase tracking-widest text-black dark:text-white mb-8 border-b border-neutral-200 pb-8">
              We'll pick up on <span className="underline">{form.date}</span> from <span className="underline">{form.city}</span>. Payment processed 24 hours post verification.
            </p>

            <div className="border border-black dark:border-white p-6 mb-8 text-left">
              <p className="text-[10px] uppercase font-bold tracking-widest text-neutral-500 mb-4">Karma Stats</p>
              <KarmaScore sold={booksSold} large />
            </div>

            <div className="border-l-4 border-black dark:border-white px-6 py-4 mb-10 bg-neutral-100 dark:bg-neutral-900 text-left">
              <p className="text-[10px] uppercase font-bold tracking-widest text-black dark:text-white mb-2">Eco Impact</p>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                You saved approx. <strong>0.5 KG of paper</strong> and one more tree today.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <a href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(`Hi! My sell order ${orderId} is placed. Just confirming!`)}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 border border-[#25D366] text-[#25D366] hover:bg-[#25D366] hover:text-white py-4 text-xs font-bold uppercase tracking-widest transition-colors">
                <MessageCircle size={16} /> Contact Support
              </a>
              <button onClick={resetAll} className="border border-black dark:border-white px-6 py-4 text-xs font-bold uppercase tracking-widest hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors">
                Sell Another Title
              </button>
            </div>
          </div>
        )}
      </div>

      {guideOpen && <ConditionGuide onClose={() => setGuideOpen(false)} />}
    </div>
  );
}
