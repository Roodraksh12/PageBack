import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, MapPin, CheckCircle, Loader2 } from 'lucide-react';

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Lakshadweep", "Puducherry"
];

export default function Account() {
  const { currentUser } = useAuth();
  const [success, setSuccess] = useState(false);
  const [pincodeLoading, setPincodeLoading] = useState(false);
  const [pincodeError, setPincodeError] = useState('');
  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    pinCode: '',
    address: '',
    city: '',
    state: ''
  });

  useEffect(() => {
    if (currentUser) {
      const saved = localStorage.getItem(`pb_user_address_${currentUser.id}`);
      if (saved) {
        try { setForm(JSON.parse(saved)); } catch (e) {}
      }
    }
  }, [currentUser]);

  const fetchPincodeDetails = async (pin) => {
    if (pin.length === 6) {
      setPincodeLoading(true);
      setPincodeError('');
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
        const data = await res.json();
        if (data && data[0].Status === 'Success') {
          const postOffice = data[0].PostOffice[0];
          setForm(prev => ({ ...prev, city: postOffice.District, state: postOffice.State }));
        } else {
          setPincodeError('Invalid PIN code. Please enter manually.');
        }
      } catch (err) {
        setPincodeError('Could not fetch location. Please enter manually.');
      } finally {
        setPincodeLoading(false);
      }
    } else {
      setPincodeError('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (currentUser) {
      localStorage.setItem(`pb_user_address_${currentUser.id}`, JSON.stringify(form));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  return (
    <div className="page-enter pb-20 md:pb-0 min-h-[80vh] bg-neutral-50 dark:bg-neutral-900">
      <div className="bg-black text-white p-12 border-b border-black text-center">
        <h1 className="font-bold text-5xl md:text-7xl uppercase tracking-tighter mb-4">My Account</h1>
        <p className="text-neutral-400 text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-2">
          <User size={16} /> Welcome back, {currentUser?.name}
        </p>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-12">
        <div className="bg-white dark:bg-black border border-neutral-300 dark:border-neutral-800 p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-8 border-b border-neutral-200 dark:border-neutral-800 pb-4">
            <MapPin className="text-forest-700 dark:text-cream-400" />
            <h2 className="font-bold text-2xl uppercase tracking-tighter text-black dark:text-white">Permanent Address</h2>
          </div>

          <p className="text-neutral-500 text-xs font-bold uppercase tracking-widest mb-6">
            Save your delivery details here so you don't have to enter them at checkout.
          </p>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="md:col-span-2">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-2">Full Name *</label>
              <input type="text" value={form.fullName} onChange={e => setForm(p => ({ ...p, fullName: e.target.value }))} required
                className="w-full border border-neutral-300 dark:border-neutral-700 px-4 py-3 bg-white dark:bg-black text-black dark:text-white focus:outline-none focus:border-forest-500 text-sm" />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-2">Phone Number *</label>
              <input type="tel" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} required pattern="[0-9]{10}"
                className="w-full border border-neutral-300 dark:border-neutral-700 px-4 py-3 bg-white dark:bg-black text-black dark:text-white focus:outline-none focus:border-forest-500 text-sm" />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-2">PIN Code *</label>
              <div className="relative">
                <input type="text" value={form.pinCode} onChange={e => {
                  setForm(p => ({ ...p, pinCode: e.target.value, city: '', state: '' }));
                  fetchPincodeDetails(e.target.value);
                }} required pattern="[0-9]{6}" maxLength="6"
                  className="w-full border border-neutral-300 dark:border-neutral-700 px-4 py-3 bg-white dark:bg-black text-black dark:text-white focus:outline-none focus:border-forest-500 text-sm pr-10" />
                {pincodeLoading && (
                  <Loader2 size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-forest-500 animate-spin" />
                )}
                {!pincodeLoading && form.city && (
                  <CheckCircle size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-500" />
                )}
              </div>
              {pincodeError && <p className="text-[10px] text-red-500 font-bold mt-1 uppercase tracking-widest">{pincodeError}</p>}
              {!pincodeLoading && form.city && <p className="text-[10px] text-emerald-600 font-bold mt-1 uppercase tracking-widest">✓ Detected: {form.city}, {form.state}</p>}
            </div>
            <div className="md:col-span-2">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-2">Address (House No, Street) *</label>
              <textarea value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} required rows="3"
                className="w-full border border-neutral-300 dark:border-neutral-700 px-4 py-3 bg-white dark:bg-black text-black dark:text-white focus:outline-none focus:border-forest-500 text-sm"></textarea>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-2">City *</label>
              <input type="text" value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))} required
                className="w-full border border-neutral-300 dark:border-neutral-700 px-4 py-3 bg-white dark:bg-black text-black dark:text-white focus:outline-none focus:border-forest-500 text-sm" />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-2">State *</label>
              <select value={form.state} onChange={e => setForm(p => ({ ...p, state: e.target.value }))} required
                className="w-full border border-neutral-300 dark:border-neutral-700 px-4 py-3 bg-white dark:bg-black text-black dark:text-white focus:outline-none focus:border-forest-500 text-sm appearance-none"
              >
                <option value="" disabled>Select State</option>
                {indianStates.map(st => <option key={st} value={st}>{st}</option>)}
              </select>
            </div>

            <div className="md:col-span-2 pt-4">
              <button type="submit" className="w-full bg-forest-800 text-cream-100 hover:bg-forest-900 transition-colors uppercase font-bold tracking-widest text-xs py-4 flex items-center justify-center gap-2">
                {success ? <><CheckCircle size={16} /> Saved Successfully!</> : 'Save Permanent Address'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
