import { useState, useRef, useEffect, useCallback } from 'react';
import { useAdmin } from '../context/AdminContext';
import { useApp } from '../context/AppContext';
import { 
  Lock, Tag, PackageSearch, Inbox, Database, LogOut, 
  Search, Plus, Upload, Trash2, Check, X, ShieldAlert, Camera 
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const INACTIVITY_TIMEOUT = 30; // seconds before logout
const WARNING_BEFORE   = 10; // seconds of countdown warning

export default function AdminPortal() {
  const { adminLoggedIn, adminLogin, adminLogout } = useAdmin();
  const navigate = useNavigate();

  // Login state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Dashboard state
  const [activeTab, setActiveTab] = useState('orders');

  // Inactivity auto-logout state
  const [countdown, setCountdown] = useState(null);
  const logoutTimerRef  = useRef(null);
  const countdownRef    = useRef(null);

  const clearAllTimers = useCallback(() => {
    clearTimeout(logoutTimerRef.current);
    clearInterval(countdownRef.current);
  }, []);

  const startLogoutTimer = useCallback(() => {
    clearAllTimers();
    setCountdown(null);
    logoutTimerRef.current = setTimeout(() => {
      let secs = WARNING_BEFORE;
      setCountdown(secs);
      countdownRef.current = setInterval(() => {
        secs -= 1;
        if (secs <= 0) {
          clearInterval(countdownRef.current);
          adminLogout();
        } else {
          setCountdown(secs);
        }
      }, 1000);
    }, (INACTIVITY_TIMEOUT - WARNING_BEFORE) * 1000);
  }, [clearAllTimers, adminLogout]);

  const resetTimer = useCallback(() => {
    if (adminLoggedIn) startLogoutTimer();
  }, [adminLoggedIn, startLogoutTimer]);

  useEffect(() => {
    if (adminLoggedIn) {
      startLogoutTimer();
      const events = ['mousemove', 'mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
      events.forEach(e => window.addEventListener(e, resetTimer, { passive: true }));
      return () => {
        clearAllTimers();
        events.forEach(e => window.removeEventListener(e, resetTimer));
      };
    }
  }, [adminLoggedIn, startLogoutTimer, resetTimer, clearAllTimers]);

  const handleLogin = (e) => {
    e.preventDefault();
    setLoginError('');
    if (!adminLogin(username, password)) {
      setLoginError('Invalid credentials');
    }
  };

  if (!adminLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-cream-100 dark:bg-forest-900 transition-colors">
        <div className="w-full max-w-md bg-white dark:bg-forest-800 p-10 rounded-2xl shadow-warm-lg border border-cream-200 dark:border-forest-700">
          <div className="flex justify-between items-start mb-8">
            <div>
              <div className="w-12 h-12 rounded-xl bg-forest-700/10 dark:bg-forest-600/20 flex items-center justify-center mb-4">
                <ShieldAlert size={24} className="text-forest-700 dark:text-cream-300" />
              </div>
              <h1 className="font-display font-bold text-3xl text-forest-800 dark:text-cream-100 mb-1">Admin Portal</h1>
              <p className="text-sm text-forest-400 dark:text-cream-500">PageBack internal management</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {loginError && (
              <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm rounded-xl">
                {loginError}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-forest-700 dark:text-cream-300 mb-1.5">Username</label>
              <input type="text" value={username} onChange={e => setUsername(e.target.value)} required
                className="w-full border border-cream-300 dark:border-forest-600 px-4 py-3 bg-white dark:bg-forest-700 text-forest-800 dark:text-cream-100 focus:outline-none focus:ring-2 focus:ring-forest-400 rounded-xl text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-forest-700 dark:text-cream-300 mb-1.5">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                className="w-full border border-cream-300 dark:border-forest-600 px-4 py-3 bg-white dark:bg-forest-700 text-forest-800 dark:text-cream-100 focus:outline-none focus:ring-2 focus:ring-forest-400 rounded-xl text-sm" />
            </div>
            <button type="submit" className="w-full bg-forest-700 hover:bg-forest-800 text-white py-3.5 rounded-xl font-bold text-sm transition-colors flex justify-center items-center gap-2 shadow-sm">
              <Lock size={16} /> Access Portal
            </button>
            <div className="text-center mt-2">
              <Link to="/" className="text-sm text-forest-400 dark:text-cream-500 hover:text-forest-700 dark:hover:text-cream-300 transition-colors">
                ← Return to main site
              </Link>
            </div>
          </form>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'orders',    label: 'Orders',              icon: PackageSearch },
    { id: 'sellReqs',  label: 'Sell Requests',        icon: Inbox },
    { id: 'inventory', label: 'Inventory',            icon: Database },
    { id: 'promo',     label: 'Discounts & Delivery', icon: Tag },
    { id: 'security',  label: 'Settings',             icon: Lock },
  ];

  return (
    <div className="min-h-screen flex bg-cream-50 dark:bg-forest-900 transition-colors">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-forest-800 border-r border-cream-200 dark:border-forest-700 flex flex-col fixed inset-y-0 z-10 shadow-sm">
        <div className="p-6 border-b border-cream-200 dark:border-forest-700">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 rounded-lg bg-forest-700/10 dark:bg-forest-600/20 flex items-center justify-center">
              <ShieldAlert size={18} className="text-forest-700 dark:text-cream-300" />
            </div>
            <h2 className="font-display font-bold text-lg text-forest-800 dark:text-cream-100">Admin</h2>
          </div>
          <p className="text-xs text-forest-400 dark:text-cream-500 pl-11">Control Center</p>
        </div>
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {tabs.map(t => {
            const Icon = t.icon;
            return (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  activeTab === t.id 
                    ? 'bg-forest-700/10 dark:bg-forest-600/20 text-forest-700 dark:text-cream-200' 
                    : 'text-forest-500 dark:text-cream-400 hover:bg-cream-100 dark:hover:bg-forest-700 hover:text-forest-700 dark:hover:text-cream-200'
                }`}>
                <Icon size={17} /> {t.label}
              </button>
            )
          })}
        </nav>
        <div className="p-3 border-t border-cream-200 dark:border-forest-700">
          <button onClick={() => adminLogout()} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
            <LogOut size={17} /> Log Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 p-8 overflow-y-auto">
        {/* Inactivity Warning Toast */}
        {countdown !== null && (
          <div className="fixed top-4 right-4 z-50 flex items-center gap-4 bg-white dark:bg-forest-800 border border-red-200 dark:border-red-800 text-forest-800 dark:text-cream-100 px-5 py-4 rounded-2xl shadow-warm-lg animate-fade-in" role="alert">
            <div className="relative w-12 h-12 flex-shrink-0">
              <svg className="w-12 h-12 -rotate-90" viewBox="0 0 44 44">
                <circle cx="22" cy="22" r="18" fill="none" stroke="#e5e7eb" strokeWidth="2" />
                <circle
                  cx="22" cy="22" r="18" fill="none" stroke="#ef4444" strokeWidth="2.5"
                  strokeDasharray={`${2 * Math.PI * 18}`}
                  strokeDashoffset={`${2 * Math.PI * 18 * (1 - countdown / WARNING_BEFORE)}`}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 1s linear' }}
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center font-bold text-red-500 text-xs">{countdown}</span>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm text-red-500">Session expiring</p>
              <p className="text-xs text-forest-400 dark:text-cream-500 mt-0.5">Logout in <span className="font-bold text-forest-700 dark:text-cream-200">{countdown}s</span> due to inactivity</p>
            </div>
            <button
               onClick={() => { resetTimer(); }}
              className="ml-2 px-4 py-2 bg-forest-700 text-white text-xs font-medium rounded-lg hover:bg-forest-800 transition-colors"
            >
              Stay Active
            </button>
          </div>
        )}
        <div className="max-w-5xl mx-auto">
          {activeTab === 'orders' && <OrdersTab />}
          {activeTab === 'sellReqs' && <SellRequestsTab />}
          {activeTab === 'inventory' && <InventoryTab />}
          {activeTab === 'promo' && <PromoTab />}
          {activeTab === 'security' && <SecurityTab />}
        </div>
      </main>
    </div>
  );
}

// ────────────────────────────────────────────────────────
// Tab Components
// ────────────────────────────────────────────────────────

function OrdersTab() {
  const { orders, updateOrderStatus } = useAdmin();
  const statuses = ['placed', 'confirmed', 'processing', 'shipped', 'outForDelivery', 'delivered', 'cancelled'];
  
  return (
    <div className="animate-fade-in">
      <h2 className="font-display font-bold text-2xl text-forest-800 dark:text-cream-100 mb-6">Order Management</h2>
      <div className="space-y-4">
        {orders.length === 0 ? (
          <p className="text-sm text-forest-400 dark:text-cream-500">No orders received yet.</p>
        ) : (
          orders.map(o => (
            <div key={o.id} className="bg-white dark:bg-forest-800 p-5 rounded-2xl border border-cream-100 dark:border-forest-700 shadow-sm">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-forest-800 dark:text-cream-100 text-sm">{o.id}</h3>
                  <p className="text-xs text-forest-400 dark:text-cream-500 mt-0.5">{new Date(o.date).toLocaleString()}</p>
                </div>
                <select 
                  value={o.status}
                  onChange={e => updateOrderStatus(o.id, e.target.value)}
                  className="bg-white dark:bg-forest-700 border border-cream-300 dark:border-forest-600 px-3 py-1.5 text-xs font-medium text-forest-700 dark:text-cream-200 focus:outline-none focus:ring-2 focus:ring-forest-400 rounded-lg appearance-none"
                >
                  {statuses.map(s => <option key={s} value={s} className="bg-white dark:bg-forest-800">{s}</option>)}
                </select>
              </div>
              <div className="space-y-2 mb-4">
                {o.items.map(i => (
                  <div key={i.id} className="flex justify-between text-sm">
                    <span className="text-forest-700 dark:text-cream-200">{i.qty}x {i.title}</span>
                    <span className="font-medium text-forest-800 dark:text-cream-100">₹{i.price * i.qty}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-cream-100 dark:border-forest-700 pt-3 flex flex-col md:flex-row justify-between text-xs gap-2">
                <span className="text-forest-400 dark:text-cream-500">Subtotal: ₹{o.subtotal} | Delivery: ₹{o.deliveryFee} | Discount: -₹{o.discount || 0}</span>
                <span className="font-bold text-forest-800 dark:text-cream-100">Total: ₹{o.total}</span>
              </div>
              
              {o.deliveryAddress && (
                <div className="border-t border-cream-100 dark:border-forest-700 mt-4 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs text-forest-700 dark:text-cream-200 bg-cream-50 dark:bg-forest-700/50 p-4 rounded-xl">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-forest-400 dark:text-cream-500 block mb-1">Deliver To</span>
                    <span className="font-bold block">{o.deliveryAddress.fullName}</span>
                    <span className="block text-forest-500 dark:text-cream-400 mt-1">{o.deliveryAddress.address}</span>
                    <span className="block mt-1">{o.deliveryAddress.city}, {o.deliveryAddress.state} - {o.deliveryAddress.pinCode}</span>
                    <span className="block mt-1 text-forest-400 dark:text-cream-500">Ph: {o.deliveryAddress.phone}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-forest-400 dark:text-cream-500 block mb-1">Payment Method</span>
                    <span className="font-bold">
                      {o.paymentMethod === 'Online' ? 'Prepaid (Online)' : 'Cash on Delivery'}
                    </span>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function SellRequestsTab() {
  const { sellRequests, updateSellRequest } = useAdmin();
  
  return (
    <div className="animate-fade-in">
      <h2 className="font-display font-bold text-2xl text-forest-800 dark:text-cream-100 mb-6">Sell Requests To Review</h2>
      <div className="space-y-4">
        {sellRequests.filter(r => r.status === 'pending' || r.status === 'review').length === 0 ? (
          <p className="text-sm text-forest-400 dark:text-cream-500">No pending requests.</p>
        ) : (
          sellRequests.filter(r => r.status === 'pending' || r.status === 'review').map(r => (
            <div key={r.id} className="bg-white dark:bg-forest-800 p-5 border border-cream-100 dark:border-forest-700 rounded-2xl shadow-sm">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-forest-800 dark:text-cream-100 text-lg">{r.title}</h3>
                  <p className="text-xs text-forest-400 dark:text-cream-500 mt-1">By {r.author} | Condition: {r.condition} | MRP: ₹{r.mrp}</p>
                </div>
                <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs px-3 py-1 rounded-full font-medium capitalize">{r.status}</span>
              </div>
              {r.image && (
                <div className="mb-4">
                  <p className="text-xs font-medium text-forest-400 dark:text-cream-500 mb-2">Uploaded Photo:</p>
                  <img src={r.image} alt="Book" className="h-32 object-contain rounded-xl border border-cream-200 dark:border-forest-600" />
                </div>
              )}
              <div className="flex gap-2 mt-4">
                <button onClick={() => updateSellRequest(r.id, 'accepted')} className="px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 transition-colors text-sm font-medium rounded-lg flex items-center gap-2">
                  <Check size={14} /> Accept & Add
                </button>
                <button onClick={() => updateSellRequest(r.id, 'rejected')} className="px-4 py-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors text-sm font-medium rounded-lg flex items-center gap-2">
                  <X size={14} /> Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <h3 className="font-display font-bold text-xl text-forest-800 dark:text-cream-100 mt-10 mb-4">Past Decisions</h3>
      <div className="space-y-3 opacity-70">
        {sellRequests.filter(r => r.status === 'accepted' || r.status === 'rejected').map(r => (
          <div key={r.id} className="bg-white dark:bg-forest-800 p-4 border border-cream-100 dark:border-forest-700 rounded-xl flex justify-between items-center">
            <div>
              <p className="font-semibold text-sm text-forest-800 dark:text-cream-100">{r.title}</p>
              <p className="text-xs text-forest-400 dark:text-cream-500 mt-1">Decision: <span className={r.status === 'accepted' ? 'text-emerald-600 dark:text-emerald-400 font-medium' : 'text-red-500 font-medium'}>{r.status.toUpperCase()}</span> on {new Date(r.reviewedAt).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function InventoryTab() {
  const { inventory, updateInventoryBook, addInventoryBook, deleteInventoryBook, importCSV } = useAdmin();
  const [q, setQ] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const fileInput = useRef(null);

  const filtered = inventory.filter(b => b.title.toLowerCase().includes(q.toLowerCase()) || b.author.toLowerCase().includes(q.toLowerCase()));

  const handleEdit = (b) => { setEditingId(b.id); setEditForm(b); };
  const handleSave = () => { updateInventoryBook(editingId, editForm); setEditingId(null); };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setEditForm(prev => ({ ...prev, image: ev.target.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleCSV = (e) => {
    const f = e.target.files[0];
    if (f) {
      const r = new FileReader();
      r.onload = ev => {
        const c = importCSV(ev.target.result);
        alert(`Imported ${c} books!`);
      };
      r.readAsText(f);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-display font-bold text-2xl text-forest-800 dark:text-cream-100">Live Inventory ({inventory.length})</h2>
        <div className="flex gap-2">
          <input type="file" accept=".csv" ref={fileInput} className="hidden" onChange={handleCSV} />
          <button onClick={() => fileInput.current.click()} className="border border-cream-300 dark:border-forest-600 bg-white dark:bg-forest-800 px-3 py-2 flex items-center gap-2 text-xs font-medium text-forest-600 dark:text-cream-300 hover:bg-cream-50 dark:hover:bg-forest-700 transition-colors rounded-lg">
            <Upload size={14} /> Bulk CSV
          </button>
          <button onClick={() => {
            setEditForm({ title: '', author: '', mrp: 0, price: 0, condition: 'Good', genre: 'Fiction' });
            setEditingId('new');
          }} className="bg-forest-700 hover:bg-forest-800 text-white px-3 py-2 flex items-center gap-2 text-xs font-medium transition-colors rounded-lg shadow-sm">
            <Plus size={14} /> Add Book
          </button>
        </div>
      </div>

      <div className="relative mb-5">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-forest-400 dark:text-cream-500" size={15} />
        <input type="text" placeholder="Search inventory..." value={q} onChange={e => setQ(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-forest-800 border border-cream-200 dark:border-forest-700 focus:outline-none focus:ring-2 focus:ring-forest-400 text-sm text-forest-700 dark:text-cream-200 placeholder:text-forest-300 dark:placeholder:text-cream-600 rounded-xl" />
      </div>

      <div className="space-y-3">
        {editingId === 'new' && (
          <div className="p-5 border border-cream-200 dark:border-forest-700 bg-white dark:bg-forest-800 rounded-2xl mb-5 shadow-sm">
            <h3 className="font-semibold text-forest-800 dark:text-cream-100 mb-4">Add New Book</h3>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <input type="text" placeholder="Title" value={editForm.title} onChange={e=>setEditForm({...editForm, title: e.target.value})} className="border border-cream-200 dark:border-forest-600 p-2.5 bg-white dark:bg-forest-700 dark:text-cream-100 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-400" />
              <input type="text" placeholder="Author" value={editForm.author} onChange={e=>setEditForm({...editForm, author: e.target.value})} className="border border-cream-200 dark:border-forest-600 p-2.5 bg-white dark:bg-forest-700 dark:text-cream-100 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-400" />
              <input type="number" placeholder="MRP" value={editForm.mrp} onChange={e=>setEditForm({...editForm, mrp: e.target.value})} className="border border-cream-200 dark:border-forest-600 p-2.5 bg-white dark:bg-forest-700 dark:text-cream-100 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-400" />
              <input type="number" placeholder="Sell Price" value={editForm.price} onChange={e=>setEditForm({...editForm, price: e.target.value})} className="border border-cream-200 dark:border-forest-600 p-2.5 bg-white dark:bg-forest-700 dark:text-cream-100 text-sm rounded-lg focus:outline-none focus:ring-2 focus:ring-forest-400" />
              <div className="col-span-2 flex items-center gap-3 border border-cream-200 dark:border-forest-600 p-3 rounded-lg bg-cream-50 dark:bg-forest-700/50">
                <label className="bg-forest-700 hover:bg-forest-800 text-white px-3 py-1.5 text-xs font-medium cursor-pointer transition-colors rounded-lg flex items-center gap-2">
                  <Camera size={13} /> Upload Cover
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
                {editForm.image && <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1"><Check size={13} /> Attached</span>}
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button className="bg-forest-700 hover:bg-forest-800 text-white px-5 py-2 text-sm font-medium rounded-lg transition-colors shadow-sm" onClick={() => { addInventoryBook(editForm); setEditingId(null); }}>Save</button>
              <button className="border border-cream-200 dark:border-forest-600 px-5 py-2 text-sm font-medium text-forest-600 dark:text-cream-400 hover:bg-cream-50 dark:hover:bg-forest-700 rounded-lg transition-colors" onClick={() => setEditingId(null)}>Cancel</button>
            </div>
          </div>
        )}

        {filtered.slice(0, 50).map(b => (
          <div key={b.id} className="p-4 border border-cream-100 dark:border-forest-700 flex justify-between items-center group hover:border-cream-300 dark:hover:border-forest-600 transition-colors bg-white dark:bg-forest-800 rounded-xl">
            {editingId === b.id ? (
              <div className="flex-1 mr-4">
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <input type="text" value={editForm.title} onChange={e=>setEditForm({...editForm, title: e.target.value})} className="border border-cream-200 dark:border-forest-600 p-2 text-sm bg-white dark:bg-forest-700 dark:text-cream-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-forest-400" />
                  <input type="text" value={editForm.author} onChange={e=>setEditForm({...editForm, author: e.target.value})} className="border border-cream-200 dark:border-forest-600 p-2 text-sm bg-white dark:bg-forest-700 dark:text-cream-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-forest-400" />
                  <input type="number" value={editForm.mrp} onChange={e=>setEditForm({...editForm, mrp: e.target.value})} className="border border-cream-200 dark:border-forest-600 p-2 text-sm bg-white dark:bg-forest-700 dark:text-cream-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-forest-400" placeholder="MRP" />
                  <input type="number" value={editForm.price} onChange={e=>setEditForm({...editForm, price: e.target.value})} className="border border-cream-200 dark:border-forest-600 p-2 text-sm bg-white dark:bg-forest-700 dark:text-cream-100 rounded-lg focus:outline-none focus:ring-1 focus:ring-forest-400" placeholder="Price" />
                  <div className="col-span-2 flex items-center gap-2 border border-cream-200 dark:border-forest-600 p-2 rounded-lg bg-cream-50 dark:bg-forest-700/50">
                    <label className="text-xs px-3 py-1.5 bg-forest-700 hover:bg-forest-800 text-white font-medium cursor-pointer transition-colors rounded-lg">
                      Replace Cover
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                    {editForm.image && <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Attached ✔</span>}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="bg-forest-700 hover:bg-forest-800 text-white px-4 py-1.5 text-sm font-medium rounded-lg transition-colors" onClick={handleSave}>Save</button>
                  <button className="border border-cream-200 dark:border-forest-600 px-4 py-1.5 text-sm font-medium text-forest-600 dark:text-cream-400 hover:bg-cream-50 dark:hover:bg-forest-700 rounded-lg transition-colors" onClick={() => setEditingId(null)}>Cancel</button>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex gap-4 items-center">
                {b.image ? (
                  <img src={b.image} alt={b.title} className="w-12 h-16 object-cover rounded-lg border border-cream-200 dark:border-forest-700 flex-shrink-0" />
                ) : (
                  <div className={`w-12 h-16 flex-shrink-0 flex items-center justify-center text-xs font-bold rounded-lg border border-cream-200 dark:border-forest-700 ${b.coverColor || 'bg-cream-100 dark:bg-forest-700'}`}>📖</div>
                )}
                <div>
                  <h4 className="font-semibold text-sm text-forest-800 dark:text-cream-100">{b.title}</h4>
                  <p className="text-xs text-forest-400 dark:text-cream-500 mt-0.5">{b.author} | MRP: ₹{b.mrp}</p>
                </div>
                <div className="ml-auto text-right mr-4">
                  <p className="font-bold text-forest-800 dark:text-cream-100">₹{b.price}</p>
                  <span className="text-[10px] font-medium text-forest-500 dark:text-cream-400 bg-cream-100 dark:bg-forest-700 px-2 py-0.5 rounded-full mt-1 inline-block">{b.condition}</span>
                </div>
              </div>
            )}
            
            {editingId !== b.id && (
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleEdit(b)} className="px-3 py-1.5 border border-cream-200 dark:border-forest-600 text-xs font-medium text-forest-600 dark:text-cream-400 hover:bg-cream-50 dark:hover:bg-forest-700 rounded-lg transition-colors">Edit</button>
                <button onClick={() => deleteInventoryBook(b.id)} className="p-1.5 border border-red-200 dark:border-red-800 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"><Trash2 size={15}/></button>
              </div>
            )}
          </div>
        ))}
        {filtered.length > 50 && <p className="text-center text-xs text-forest-400 dark:text-cream-500 pt-6">Showing 50 of {filtered.length} results. Use search to find more.</p>}
      </div>
    </div>
  );
}

function PromoTab() {
  const { promoCodes, addPromoCode, updatePromoCode, deletePromoCode, deliverySettings, updateDeliverySettings } = useAdmin();
  const [newPromo, setNewPromo] = useState({ code: '', discount: 0, type: 'flat', minOrder: 0, active: true });
  const [delSet, setDelSet] = useState(deliverySettings);

  const handleDeliverySave = (e) => {
    e.preventDefault();
    updateDeliverySettings({
      standardFee: Number(delSet.standardFee),
      expressFee: Number(delSet.expressFee),
      freeAbove: Number(delSet.freeAbove)
    });
    alert('Delivery settings saved');
  };

  const handleAddPromo = (e) => {
    e.preventDefault();
    if (newPromo.code) {
      addPromoCode({ ...newPromo, code: newPromo.code.toUpperCase() });
      setNewPromo({ code: '', discount: 0, type: 'flat', minOrder: 0, active: true });
    }
  };

  return (
    <div className="animate-fade-in space-y-10">
      <section>
        <h2 className="font-display font-bold text-2xl text-forest-800 dark:text-cream-100 mb-6">Delivery Fees</h2>
        <form onSubmit={handleDeliverySave} className="bg-white dark:bg-forest-800 p-6 border border-cream-100 dark:border-forest-700 rounded-2xl shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-forest-500 dark:text-cream-400 mb-2">Standard Delivery (₹)</label>
            <input type="number" value={delSet.standardFee} onChange={e=>setDelSet({...delSet, standardFee: e.target.value})} className="w-full border border-cream-200 dark:border-forest-600 p-3 bg-white dark:bg-forest-700 dark:text-cream-100 focus:outline-none focus:ring-2 focus:ring-forest-400 text-sm rounded-lg" />
          </div>
          <div>
            <label className="block text-xs font-medium text-forest-500 dark:text-cream-400 mb-2">Express Delivery (₹)</label>
            <input type="number" value={delSet.expressFee} onChange={e=>setDelSet({...delSet, expressFee: e.target.value})} className="w-full border border-cream-200 dark:border-forest-600 p-3 bg-white dark:bg-forest-700 dark:text-cream-100 focus:outline-none focus:ring-2 focus:ring-forest-400 text-sm rounded-lg" />
          </div>
          <div>
            <label className="block text-xs font-medium text-forest-500 dark:text-cream-400 mb-2">Free Delivery Above (₹)</label>
            <input type="number" value={delSet.freeAbove} onChange={e=>setDelSet({...delSet, freeAbove: e.target.value})} className="w-full border border-cream-200 dark:border-forest-600 p-3 bg-white dark:bg-forest-700 dark:text-cream-100 focus:outline-none focus:ring-2 focus:ring-forest-400 text-sm rounded-lg" />
          </div>
          <div className="md:col-span-3 flex justify-end mt-2">
            <button type="submit" className="bg-forest-700 hover:bg-forest-800 text-white py-2.5 px-8 text-sm font-medium rounded-lg transition-colors shadow-sm">Save Settings</button>
          </div>
        </form>
      </section>

      <section>
        <h2 className="font-display font-bold text-2xl text-forest-800 dark:text-cream-100 mb-6">Promo Codes</h2>
        <div className="bg-white dark:bg-forest-800 p-6 border border-cream-100 dark:border-forest-700 rounded-2xl shadow-sm mb-5">
          <h3 className="font-semibold text-forest-800 dark:text-cream-100 mb-4">Create New Promo</h3>
          <form onSubmit={handleAddPromo} className="grid grid-cols-2 md:grid-cols-5 gap-3 items-end">
            <div><label className="text-xs font-medium text-forest-500 dark:text-cream-400 mb-2 block">Code</label><input type="text" value={newPromo.code} onChange={e=>setNewPromo({...newPromo, code: e.target.value})} required className="w-full border border-cream-200 dark:border-forest-600 p-2.5 uppercase bg-white dark:bg-forest-700 dark:text-cream-100 focus:outline-none focus:ring-2 focus:ring-forest-400 text-sm rounded-lg" /></div>
            <div><label className="text-xs font-medium text-forest-500 dark:text-cream-400 mb-2 block">Type</label><select value={newPromo.type} onChange={e=>setNewPromo({...newPromo, type: e.target.value})} className="w-full border border-cream-200 dark:border-forest-600 p-2.5 bg-white dark:bg-forest-700 dark:text-cream-100 focus:outline-none focus:ring-1 focus:ring-forest-400 text-sm rounded-lg appearance-none"><option value="flat">Flat (₹)</option><option value="percent">Percent (%)</option></select></div>
            <div><label className="text-xs font-medium text-forest-500 dark:text-cream-400 mb-2 block">Discount</label><input type="number" value={newPromo.discount} onChange={e=>setNewPromo({...newPromo, discount: Number(e.target.value)})} required className="w-full border border-cream-200 dark:border-forest-600 p-2.5 bg-white dark:bg-forest-700 dark:text-cream-100 focus:outline-none focus:ring-2 focus:ring-forest-400 text-sm rounded-lg" /></div>
            <div><label className="text-xs font-medium text-forest-500 dark:text-cream-400 mb-2 block">Min Order (₹)</label><input type="number" value={newPromo.minOrder} onChange={e=>setNewPromo({...newPromo, minOrder: Number(e.target.value)})} className="w-full border border-cream-200 dark:border-forest-600 p-2.5 bg-white dark:bg-forest-700 dark:text-cream-100 focus:outline-none focus:ring-2 focus:ring-forest-400 text-sm rounded-lg" /></div>
            <button type="submit" className="bg-forest-700 hover:bg-forest-800 text-white py-2.5 text-sm font-medium rounded-lg transition-colors shadow-sm">Add</button>
          </form>
        </div>

        <div className="space-y-3">
          {promoCodes.map(p => (
            <div key={p.id} className={`p-4 border border-cream-100 dark:border-forest-700 rounded-xl flex justify-between items-center bg-white dark:bg-forest-800 ${!p.active ? 'opacity-50' : ''}`}>
              <div className="flex items-center gap-3">
                <span className="font-display font-bold text-lg text-forest-800 dark:text-cream-100">{p.code}</span>
                <span className="bg-forest-100 dark:bg-forest-700 text-forest-700 dark:text-cream-300 px-2.5 py-0.5 text-xs font-medium rounded-full">
                  {p.type === 'percent' ? `${p.discount}% OFF` : `₹${p.discount} OFF`} · Min ₹{p.minOrder}
                </span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => updatePromoCode(p.id, { active: !p.active })} className="px-3 py-1.5 border border-cream-200 dark:border-forest-600 text-xs font-medium text-forest-600 dark:text-cream-400 hover:bg-cream-50 dark:hover:bg-forest-700 rounded-lg transition-colors">
                  {p.active ? 'Disable' : 'Enable'}
                </button>
                <button onClick={() => deletePromoCode(p.id)} className="px-3 py-1.5 border border-red-200 dark:border-red-800 text-xs font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function SecurityTab() {
  const { adminCreds, changeAdminCredentials } = useAdmin();
  const { whatsappNumber, setWhatsappNumber } = useApp();
  const [currentP, setCurrentP] = useState('');
  const [u, setU] = useState('');
  const [p, setP] = useState('');
  const [msg, setMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleUpdate = (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (currentP !== adminCreds.password) {
      setErrorMsg('Incorrect current password.');
      return;
    }
    if (u && p) {
      changeAdminCredentials(u, p);
      setMsg('Credentials updated successfully!');
      setTimeout(() => setMsg(''), 3000);
      setCurrentP(''); setU(''); setP('');
    }
  };

  return (
    <div className="animate-fade-in max-w-md">
      <h2 className="font-display font-bold text-2xl text-forest-800 dark:text-cream-100 mb-6">General Settings</h2>
      
      <div className="bg-white dark:bg-forest-800 p-6 border border-cream-100 dark:border-forest-700 rounded-2xl shadow-sm mb-5">
        <h3 className="font-semibold text-forest-800 dark:text-cream-100 mb-1">Support Contact</h3>
        <p className="text-xs text-forest-400 dark:text-cream-500 mb-4">Update the WhatsApp number for support queries. (Include country code, no + sign)</p>
        <div className="flex gap-2">
          <input 
            type="text" 
            value={whatsappNumber} 
            onChange={e => setWhatsappNumber(e.target.value)} 
            placeholder="e.g. 919999999999"
            className="flex-1 border border-cream-200 dark:border-forest-600 p-3 bg-white dark:bg-forest-700 dark:text-cream-100 focus:outline-none focus:ring-2 focus:ring-forest-400 text-sm rounded-lg" 
          />
          <button onClick={() => alert('WhatsApp number updated!')} className="bg-forest-700 hover:bg-forest-800 text-white py-3 px-5 text-sm font-medium rounded-lg transition-colors shadow-sm">Save</button>
        </div>
      </div>

      <div className="bg-white dark:bg-forest-800 p-6 border border-cream-100 dark:border-forest-700 rounded-2xl shadow-sm">
        <h3 className="font-semibold text-forest-800 dark:text-cream-100 mb-1">Admin Credentials</h3>
        <p className="text-xs text-forest-400 dark:text-cream-500 mb-5">Update the master admin login. Store credentials safely.</p>
        
        {msg && <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-sm rounded-xl">{msg}</div>}
        {errorMsg && <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm rounded-xl">{errorMsg}</div>}
        
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-forest-500 dark:text-cream-400 mb-1.5">Current Password</label>
            <input type="password" value={currentP} onChange={e=>setCurrentP(e.target.value)} required className="w-full border border-cream-200 dark:border-forest-600 p-3 bg-white dark:bg-forest-700 dark:text-cream-100 focus:outline-none focus:ring-2 focus:ring-forest-400 text-sm rounded-lg" />
          </div>
          <div>
            <label className="block text-xs font-medium text-forest-500 dark:text-cream-400 mb-1.5">New Username</label>
            <input type="text" value={u} onChange={e=>setU(e.target.value)} required placeholder={`Current: ${adminCreds.username}`} className="w-full border border-cream-200 dark:border-forest-600 p-3 bg-white dark:bg-forest-700 dark:text-cream-100 focus:outline-none focus:ring-2 focus:ring-forest-400 text-sm rounded-lg" />
          </div>
          <div>
            <label className="block text-xs font-medium text-forest-500 dark:text-cream-400 mb-1.5">New Password</label>
            <input type="password" value={p} onChange={e=>setP(e.target.value)} required className="w-full border border-cream-200 dark:border-forest-600 p-3 bg-white dark:bg-forest-700 dark:text-cream-100 focus:outline-none focus:ring-2 focus:ring-forest-400 text-sm rounded-lg" />
          </div>
          <button type="submit" className="w-full bg-forest-700 hover:bg-forest-800 text-white py-3 mt-2 text-sm font-medium rounded-lg transition-colors shadow-sm">Update Credentials</button>
        </form>
      </div>
    </div>
  );
}
