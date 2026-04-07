import { useState } from 'react';
import { Save, Phone, Settings, Eye, EyeOff, CheckCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export default function Admin() {
  const { whatsappNumber, setWhatsappNumber, totalBooksSite, bookRequests } = useApp();
  const [inputNumber, setInputNumber] = useState(whatsappNumber);
  const [showNumber, setShowNumber] = useState(false);
  const [saved, setSaved] = useState(false);
  const [pin, setPin] = useState('');
  const [authenticated, setAuthenticated] = useState(() => {
    return sessionStorage.getItem('pb_admin') === 'true';
  });
  const [pinError, setPinError] = useState(false);

  const ADMIN_PIN = '2580'; // simple demo PIN

  const handleLogin = (e) => {
    e.preventDefault();
    if (pin === ADMIN_PIN) {
      setAuthenticated(true);
      sessionStorage.setItem('pb_admin', 'true');
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const handleSave = () => {
    // Validate: must be a 10-12 digit number
    const cleaned = inputNumber.replace(/\D/g, '');
    if (cleaned.length < 10) return;
    setWhatsappNumber(cleaned.startsWith('91') ? cleaned : `91${cleaned}`);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (!authenticated) {
    return (
      <div className="page-enter min-h-[80vh] flex items-center justify-center px-4">
        <div className="bg-white dark:bg-forest-800 rounded-2xl shadow-warm-lg border border-cream-100 dark:border-forest-700 p-8 w-full max-w-sm">
          <div className="text-center mb-6">
            <Settings size={40} className="mx-auto text-forest-600 dark:text-cream-300 mb-3" />
            <h1 className="font-display font-bold text-2xl text-forest-800 dark:text-cream-100">Admin Portal</h1>
            <p className="text-sm text-forest-400 dark:text-cream-500 mt-1">PageBack internal management</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-forest-700 dark:text-cream-300 mb-1">Admin PIN</label>
              <input
                type="password"
                value={pin}
                onChange={e => { setPin(e.target.value); setPinError(false); }}
                placeholder="Enter PIN"
                className={`w-full border rounded-xl px-4 py-3 bg-white dark:bg-forest-700 text-forest-800 dark:text-cream-100 focus:outline-none focus:ring-2 focus:ring-forest-400 text-sm text-center tracking-widest text-lg ${pinError ? 'border-red-400 dark:border-red-500' : 'border-cream-300 dark:border-forest-600'}`}
                maxLength={6}
              />
              {pinError && <p className="text-red-500 text-xs mt-1 text-center">Incorrect PIN. Try again.</p>}
            </div>
            <button type="submit" className="btn-primary w-full">Login</button>
          </form>
          <p className="text-center text-xs text-forest-400 dark:text-cream-600 mt-4">Demo PIN: 2580</p>
        </div>
      </div>
    );
  }

  return (
    <div className="page-enter pb-20 md:pb-0">
      <div className="bg-forest-700 dark:bg-forest-900 py-10 px-4 text-white">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-display font-bold text-3xl mb-1">Admin Portal</h1>
            <p className="text-cream-300 text-sm">PageBack management dashboard</p>
          </div>
          <button
            onClick={() => { setAuthenticated(false); sessionStorage.removeItem('pb_admin'); }}
            className="btn-outline border-cream-400 text-cream-200 text-sm py-2 px-4"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Books in Stock',   val: '20',                      icon: '📚', color: 'bg-forest-100 dark:bg-forest-800 text-forest-700 dark:text-cream-200' },
            { label: 'Total Rehomed',    val: totalBooksSite.toLocaleString(), icon: '♻️', color: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' },
            { label: 'Book Requests',    val: bookRequests.length,        icon: '🎯', color: 'bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300' },
            { label: 'Avg. Savings',     val: '₹183',                    icon: '💰', color: 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300' },
          ].map((s, i) => (
            <div key={i} className={`${s.color} rounded-2xl p-5 border border-transparent shadow-sm`}>
              <span className="text-2xl block mb-2">{s.icon}</span>
              <p className="font-display font-bold text-2xl">{s.val}</p>
              <p className="text-sm opacity-70">{s.label}</p>
            </div>
          ))}
        </div>

        {/* WhatsApp Number Setting */}
        <div className="bg-white dark:bg-forest-800 rounded-2xl p-6 shadow-card border border-cream-100 dark:border-forest-700">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-[#25D366]/10 flex items-center justify-center">
              <Phone size={20} className="text-[#25D366]" />
            </div>
            <div>
              <h2 className="font-display font-bold text-lg text-forest-800 dark:text-cream-100">WhatsApp Business Number</h2>
              <p className="text-sm text-forest-400 dark:text-cream-500">Used for Quick Sell button and buyer inquiries</p>
            </div>
          </div>

          <div className="flex gap-2 mb-3">
            <div className="relative flex-1">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-forest-500 dark:text-cream-400 text-sm font-medium">+</span>
              <input
                type={showNumber ? 'text' : 'password'}
                value={inputNumber}
                onChange={e => { setInputNumber(e.target.value); setSaved(false); }}
                placeholder="919876543210"
                className="w-full pl-8 pr-12 py-3 border border-cream-300 dark:border-forest-600 rounded-xl bg-white dark:bg-forest-700 text-forest-800 dark:text-cream-100 focus:outline-none focus:ring-2 focus:ring-forest-400 text-sm font-mono"
              />
              <button onClick={() => setShowNumber(!showNumber)} className="absolute right-3 top-1/2 -translate-y-1/2 text-forest-400 hover:text-forest-600">
                {showNumber ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <button onClick={handleSave} className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-sm transition-all ${saved ? 'bg-emerald-500 text-white' : 'btn-primary'}`}>
              {saved ? <><CheckCircle size={16} /> Saved!</> : <><Save size={16} /> Save</>}
            </button>
          </div>

          <p className="text-xs text-forest-400 dark:text-cream-600">
            Format: Country code + number (e.g., <code className="bg-cream-100 dark:bg-forest-700 px-1 rounded">919876543210</code> for India). No spaces or dashes.
          </p>

          <div className="mt-4 p-3 bg-cream-50 dark:bg-forest-700 rounded-xl border border-cream-200 dark:border-forest-600">
            <p className="text-xs text-forest-500 dark:text-cream-400">
              📱 Preview: <a href={`https://wa.me/${inputNumber}?text=Hi+PageBack!`} target="_blank" rel="noopener noreferrer" className="text-[#25D366] underline font-medium">
                wa.me/{inputNumber}
              </a>
            </p>
          </div>
        </div>

        {/* Book Requests */}
        {bookRequests.length > 0 && (
          <div className="bg-white dark:bg-forest-800 rounded-2xl p-6 shadow-card border border-cream-100 dark:border-forest-700">
            <h2 className="font-display font-bold text-lg text-forest-800 dark:text-cream-100 mb-4">
              🎯 Book Requests ({bookRequests.length})
            </h2>
            <div className="space-y-3">
              {bookRequests.map(r => (
                <div key={r.id} className="flex items-start gap-4 p-4 rounded-xl bg-cream-50 dark:bg-forest-700 border border-cream-200 dark:border-forest-600">
                  <div className="flex-1">
                    <p className="font-semibold text-forest-800 dark:text-cream-100 text-sm">{r.title}</p>
                    {r.author && <p className="text-xs text-forest-400 dark:text-cream-500">by {r.author}</p>}
                    <div className="flex gap-3 mt-1">
                      {r.budget && <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">Budget: ₹{r.budget}</span>}
                      {r.condition && <span className="text-xs text-forest-500 dark:text-cream-400">Condition: {r.condition}</span>}
                    </div>
                  </div>
                  <span className="text-xs text-forest-400 dark:text-cream-600 whitespace-nowrap">
                    {new Date(r.date).toLocaleDateString('en-IN')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
