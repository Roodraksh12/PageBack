import { useState, useRef, useEffect, useCallback } from 'react';
import { useAdmin } from '../context/AdminContext';
import { useApp } from '../context/AppContext';
import { 
  Lock, Tag, PackageSearch, Inbox, Database, LogOut, 
  Search, Plus, Upload, Trash2, Check, X, ShieldAlert, Camera,
  Menu
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const INACTIVITY_TIMEOUT = 30;
const WARNING_BEFORE   = 10;

export default function AdminPortal() {
  const { adminLoggedIn, adminLogin, adminLogout } = useAdmin();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState('orders');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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

  /* ── Login Screen ── */
  if (!adminLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-cream-50 dark:bg-forest-900">
        <div className="w-full max-w-sm">
          {/* Header strip */}
          <div className="bg-forest-800 dark:bg-forest-900 text-white text-center py-8 px-8 mb-0">
            <ShieldAlert size={32} className="mx-auto mb-3 text-cream-300" />
            <h1 className="font-display font-bold text-3xl uppercase tracking-tight">Admin Portal</h1>
            <p className="text-cream-400 text-xs font-medium uppercase tracking-widest mt-1">PageBack Management</p>
          </div>
          {/* Form card */}
          <div className="bg-white dark:bg-forest-800 border border-cream-200 dark:border-forest-700 p-8 shadow-warm-lg">
            <form onSubmit={handleLogin} className="space-y-5">
              {loginError && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 text-red-600 text-sm rounded-lg">
                  {loginError}
                </div>
              )}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-forest-500 dark:text-cream-400 mb-2">Username</label>
                <input type="text" value={username} onChange={e => setUsername(e.target.value)} required
                  className="w-full border border-cream-300 dark:border-forest-600 px-4 py-3 bg-white dark:bg-forest-700 text-forest-800 dark:text-cream-100 focus:outline-none focus:ring-2 focus:ring-forest-500 text-sm" />
              </div>
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-forest-500 dark:text-cream-400 mb-2">Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                  className="w-full border border-cream-300 dark:border-forest-600 px-4 py-3 bg-white dark:bg-forest-700 text-forest-800 dark:text-cream-100 focus:outline-none focus:ring-2 focus:ring-forest-500 text-sm" />
              </div>
              <button type="submit" className="w-full bg-forest-800 hover:bg-forest-900 text-white py-4 font-bold text-xs uppercase tracking-widest transition-colors flex justify-center items-center gap-2">
                <Lock size={14} /> Access Portal
              </button>
              <div className="text-center pt-1">
                <Link to="/" className="text-xs text-forest-400 hover:text-forest-700 dark:hover:text-cream-300 transition-colors font-medium uppercase tracking-widest">
                  ← Return to site
                </Link>
              </div>
            </form>
          </div>
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
    <div className="min-h-screen flex bg-cream-50 dark:bg-forest-900 border-x">
      {/* ── Mobile Header ── */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-forest-800 dark:bg-forest-950 flex items-center justify-between px-4 z-20 border-b border-forest-700">
        <button onClick={() => setIsSidebarOpen(true)} className="p-2 text-cream-300 hover:bg-forest-700 transition-colors">
          <Menu size={24} />
        </button>
        <div className="flex items-center gap-2">
          <ShieldAlert size={18} className="text-cream-300" />
          <h1 className="font-display font-bold text-white uppercase tracking-tight text-lg">Admin</h1>
        </div>
        <div className="w-10"></div> {/* Spacer for balance */}
      </div>

      {/* ── Sidebar Overlay (Mobile) ── */}
      {isSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-30 backdrop-blur-sm transition-opacity"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* ── Dark Forest Sidebar ── */}
      <aside className={`w-64 bg-forest-800 dark:bg-forest-950 flex flex-col fixed inset-y-0 z-40 transition-transform duration-300 lg:translate-x-0 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Sidebar header */}
        <div className="p-6 border-b border-forest-700 dark:border-forest-800 flex justify-between items-center lg:block">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <ShieldAlert size={20} className="text-cream-300 flex-shrink-0" />
              <h2 className="font-display font-bold text-xl text-white tracking-tight">Admin</h2>
            </div>
            <p className="text-cream-500 text-[10px] font-bold uppercase tracking-widest pl-8">Control Center</p>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 text-cream-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
          {tabs.map(t => {
            const Icon = t.icon;
            return (
              <button key={t.id} onClick={() => { setActiveTab(t.id); setIsSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors text-left ${
                  activeTab === t.id
                    ? 'bg-forest-700 text-white'
                    : 'text-cream-400 hover:bg-forest-700/60 hover:text-white'
                }`}>
                <Icon size={16} className="flex-shrink-0" />
                {t.label}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-forest-700 dark:border-forest-800">
          <button onClick={() => adminLogout()}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-400 hover:bg-red-900/30 hover:text-red-300 transition-colors">
            <LogOut size={16} /> Log Out
          </button>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="flex-1 lg:ml-64 overflow-y-auto pt-16 lg:pt-0">
        {/* Inactivity Warning Toast */}
        {countdown !== null && (
          <div className="fixed top-20 right-4 left-4 lg:top-4 lg:left-auto lg:right-4 z-50 flex items-center gap-4 bg-white dark:bg-forest-800 border border-red-200 dark:border-red-800 text-forest-800 dark:text-cream-100 px-5 py-4 shadow-warm-lg" role="alert">
            <div className="relative w-12 h-12 flex-shrink-0">
              <svg className="w-12 h-12 -rotate-90" viewBox="0 0 44 44">
                <circle cx="22" cy="22" r="18" fill="none" stroke="#e5e7eb" strokeWidth="2" />
                <circle cx="22" cy="22" r="18" fill="none" stroke="#ef4444" strokeWidth="2.5"
                  strokeDasharray={`${2 * Math.PI * 18}`}
                  strokeDashoffset={`${2 * Math.PI * 18 * (1 - countdown / WARNING_BEFORE)}`}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 1s linear' }} />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center font-bold text-red-500 text-xs">{countdown}</span>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm text-red-500">Session expiring</p>
              <p className="text-xs text-forest-400 dark:text-cream-500 mt-0.5">Logout in <span className="font-bold">{countdown}s</span> due to inactivity</p>
            </div>
            <button onClick={() => resetTimer()}
              className="ml-2 px-4 py-2 bg-forest-700 text-white text-xs font-medium hover:bg-forest-800 transition-colors">
              Stay Active
            </button>
          </div>
        )}

        <div className="max-w-5xl mx-auto p-4 lg:p-8">
          {activeTab === 'orders'    && <OrdersTab />}
          {activeTab === 'sellReqs' && <SellRequestsTab />}
          {activeTab === 'inventory' && <InventoryTab />}
          {activeTab === 'promo'     && <PromoTab />}
          {activeTab === 'security'  && <SecurityTab />}
        </div>
      </main>
    </div>
  );
}

// ────────────────────────────────────────────────────────
// Shared input / card styles matching the normal site
// ────────────────────────────────────────────────────────
const inputCls   = "w-full border border-cream-300 dark:border-forest-600 px-4 py-3 bg-cream-50 dark:bg-forest-700 text-forest-700 dark:text-cream-100 focus:outline-none focus:ring-2 focus:ring-forest-500 text-sm";
const cardCls    = "bg-cream-50 dark:bg-forest-800 border border-cream-200 dark:border-forest-700 shadow-sm";
const btnPrimary = "bg-forest-800 hover:bg-forest-900 text-white font-bold text-xs uppercase tracking-widest transition-colors py-3 px-6 flex items-center gap-2";
const lblCls     = "block text-[10px] font-bold uppercase tracking-widest text-forest-600 dark:text-cream-400 mb-2";

// ────────────────────────────────────────────────────────
function OrdersTab() {
  const { orders, updateOrderStatus, STATUS_ORDER } = useAdmin();

  return (
    <div className="animate-fade-in">
      <h2 className="font-display font-bold text-2xl text-forest-800 dark:text-cream-100 mb-6">Order Management</h2>

      <div className="space-y-4">
        {orders.length === 0 ? (
          <p className="text-sm text-forest-400 dark:text-cream-500">No orders received yet.</p>
        ) : orders.map(o => (
          <div key={o.id} className={`${cardCls} p-5`}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-forest-700 dark:text-cream-100 text-sm">{o.id}</h3>
                <p className="text-xs text-forest-500 dark:text-cream-500 mt-0.5">{new Date(o.date).toLocaleString()}</p>
              </div>
              <select value={o.status} 
                onChange={e => updateOrderStatus(o.id, e.target.value)}
                className="border border-cream-300 dark:border-forest-600 bg-white dark:bg-forest-700 text-forest-700 dark:text-cream-200 px-3 py-1.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-forest-500 appearance-none">
                {STATUS_ORDER.map((s, idx) => {
                  const currentIdx = STATUS_ORDER.indexOf(o.status);
                  const isNext = idx === currentIdx + 1;
                  const isCurrent = s === o.status;
                  
                  if (isCurrent || isNext) {
                    return <option key={s} value={s}>{s}</option>;
                  }
                  return null;
                })}
              </select>
            </div>
            <div className="space-y-2 mb-4">
              {o.items.map(i => (
                <div key={i.id} className="flex justify-between text-sm">
                  <span className="text-forest-700 dark:text-cream-200">{i.qty}x {i.title}</span>
                  <span className="font-semibold text-forest-700 dark:text-cream-100">₹{i.price * i.qty}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-cream-200 dark:border-forest-700 pt-3 flex flex-wrap justify-between text-xs gap-3">
              <span className="text-forest-500 dark:text-cream-500">Subtotal: ₹{o.subtotal} | Delivery: ₹{o.deliveryFee} | Discount: -₹{o.discount || 0}</span>
              <span className="font-bold text-forest-700 dark:text-cream-100 whitespace-nowrap">Total: ₹{o.total}</span>
            </div>
            {o.deliveryAddress && (
              <div className="border-t border-cream-200 dark:border-forest-700 mt-4 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-cream-100 dark:bg-forest-700/30 p-4">
                <div>
                  <span className={lblCls}>Deliver To</span>
                  <span className="font-semibold text-forest-700 dark:text-cream-100 block">{o.deliveryAddress.fullName}</span>
                  <span className="text-forest-600 dark:text-cream-400 block mt-1">{o.deliveryAddress.address}</span>
                  <span className="text-forest-600 dark:text-cream-300 block">{o.deliveryAddress.city}, {o.deliveryAddress.state} - {o.deliveryAddress.pinCode}</span>
                  <span className="text-forest-500 dark:text-cream-500 block mt-1">Ph: {o.deliveryAddress.phone}</span>
                </div>
                <div>
                  <span className={lblCls}>Payment Method</span>
                  <span className="font-semibold text-forest-700 dark:text-cream-100">{o.paymentMethod === 'Online' ? 'Prepaid (Online)' : 'Cash on Delivery'}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function SellRequestsTab() {
  const { sellRequests, updateSellRequest } = useAdmin();

  return (
    <div className="animate-fade-in">
      <h2 className="font-display font-bold text-2xl text-forest-800 dark:text-cream-100 mb-6">Sell Requests</h2>
      <div className="space-y-4">
        {sellRequests.filter(r => r.status === 'pending' || r.status === 'review').length === 0 ? (
          <p className="text-sm text-forest-400 dark:text-cream-500">No pending requests.</p>
        ) : sellRequests.filter(r => r.status === 'pending' || r.status === 'review').map(r => (
          <div key={r.id} className={`${cardCls} p-5`}>
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-bold text-forest-700 dark:text-cream-100 text-lg">{r.title}</h3>
                <p className="text-xs text-forest-500 dark:text-cream-500 mt-1">By {r.author} | Condition: {r.condition} | MRP: ₹{r.mrp}</p>
              </div>
              <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-xs px-3 py-1 font-medium capitalize">{r.status}</span>
            </div>
            {r.image && (
              <div className="mb-4">
                <p className={lblCls}>Uploaded Photo</p>
                <img src={r.image} alt="Book" className="h-32 object-contain border border-cream-200 dark:border-forest-600" />
              </div>
            )}
            <div className="flex flex-wrap gap-2 mt-4">
              <button onClick={() => updateSellRequest(r.id, 'accepted')} className="flex-1 sm:flex-none px-4 py-2 border border-forest-200 bg-forest-50 dark:bg-forest-700/30 text-forest-700 dark:text-cream-300 hover:bg-forest-100 transition-colors text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                <Check size={13} /> Accept
              </button>
              <button onClick={() => updateSellRequest(r.id, 'rejected')} className="flex-1 sm:flex-none px-4 py-2 border border-red-200 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 transition-colors text-[10px] font-bold uppercase tracking-widest flex items-center justify-center gap-2">
                <X size={13} /> Reject
              </button>
            </div>
          </div>
        ))}
      </div>

      <h3 className="font-display font-bold text-xl text-forest-800 dark:text-cream-100 mt-10 mb-4">Past Decisions</h3>
      <div className="space-y-3 opacity-70">
        {sellRequests.filter(r => r.status === 'accepted' || r.status === 'rejected').map(r => (
          <div key={r.id} className={`${cardCls} p-4 flex justify-between items-center`}>
            <div>
              <p className="font-semibold text-sm text-forest-700 dark:text-cream-100">{r.title}</p>
              <p className="text-xs text-forest-500 dark:text-cream-500 mt-1">
                <span className={r.status === 'accepted' ? 'text-forest-600 dark:text-forest-400 font-medium' : 'text-red-500 font-medium'}>{r.status.toUpperCase()}</span>
                {' '}· {new Date(r.reviewedAt).toLocaleDateString()}
              </p>
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

  const filtered = inventory.filter(b =>
    b.title.toLowerCase().includes(q.toLowerCase()) || b.author.toLowerCase().includes(q.toLowerCase())
  );
  const handleEdit = (b) => { setEditingId(b.id); setEditForm(b); };
  const handleSave = () => { updateInventoryBook(editingId, editForm); setEditingId(null); };
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setEditForm(prev => ({ ...prev, image: ev.target.result }));
    reader.readAsDataURL(file);
  };
  const handleCSV = (e) => {
    const f = e.target.files[0];
    if (f) {
      const r = new FileReader();
      r.onload = ev => alert(`Imported ${importCSV(ev.target.result)} books!`);
      r.readAsText(f);
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h2 className="font-display font-bold text-2xl text-forest-800 dark:text-cream-100">Inventory ({inventory.length})</h2>
        <div className="flex gap-2 w-full sm:w-auto">
          <input type="file" accept=".csv" ref={fileInput} className="hidden" onChange={handleCSV} />
          <button onClick={() => fileInput.current.click()} className="flex-1 sm:flex-none border border-cream-300 dark:border-forest-600 bg-white dark:bg-forest-800 px-3 py-2 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-widest text-forest-600 dark:text-cream-300 hover:bg-cream-50 dark:hover:bg-forest-700 transition-colors">
            <Upload size={13} /> Import
          </button>
          <button onClick={() => { setEditForm({ title: '', author: '', mrp: 0, price: 0, condition: 'Good', genre: 'Fiction' }); setEditingId('new'); }}
            className={`${btnPrimary} flex-1 sm:flex-none justify-center px-4`}>
            <Plus size={13} /> Add
          </button>
        </div>
      </div>

      <div className="relative mb-5">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-forest-400" size={14} />
        <input type="text" placeholder="Search inventory..." value={q} onChange={e => setQ(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-cream-200 dark:border-forest-600 bg-white dark:bg-forest-800 text-forest-700 dark:text-cream-200 focus:outline-none focus:ring-2 focus:ring-forest-500 text-sm placeholder:text-forest-300 dark:placeholder:text-cream-600" />
      </div>

      <div className="space-y-3">
        {editingId === 'new' && (
          <div className={`${cardCls} p-5 mb-4`}>
            <h3 className="font-semibold text-forest-800 dark:text-cream-100 mb-4">Add New Book</h3>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <input type="text" placeholder="Title" value={editForm.title} onChange={e=>setEditForm({...editForm, title: e.target.value})} className={inputCls} />
              <input type="text" placeholder="Author" value={editForm.author} onChange={e=>setEditForm({...editForm, author: e.target.value})} className={inputCls} />
              <input type="number" placeholder="MRP" value={editForm.mrp} onChange={e=>setEditForm({...editForm, mrp: e.target.value})} className={inputCls} />
              <input type="number" placeholder="Sell Price" value={editForm.price} onChange={e=>setEditForm({...editForm, price: e.target.value})} className={inputCls} />
              <div className="col-span-2 flex items-center gap-3 bg-cream-50 dark:bg-forest-700/30 border border-cream-200 dark:border-forest-600 p-3">
                <label className="bg-forest-800 hover:bg-forest-900 text-white px-3 py-1.5 text-xs font-bold uppercase tracking-widest cursor-pointer transition-colors flex items-center gap-2">
                  <Camera size={12} /> Upload Cover
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
                {editForm.image && <span className="text-xs text-forest-600 dark:text-forest-400 font-medium flex items-center gap-1"><Check size={12} /> Attached</span>}
              </div>
            </div>
            <div className="flex gap-2">
              <button className={btnPrimary} onClick={() => { addInventoryBook(editForm); setEditingId(null); }}>Save</button>
              <button className="border border-cream-300 dark:border-forest-600 px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-forest-600 dark:text-cream-400 hover:bg-cream-50 dark:hover:bg-forest-700 transition-colors" onClick={() => setEditingId(null)}>Cancel</button>
            </div>
          </div>
        )}

        {filtered.slice(0, 50).map(b => (
          <div key={b.id} className={`${cardCls} p-4 flex justify-between items-center group hover:border-cream-300 dark:hover:border-forest-500 transition-colors`}>
            {editingId === b.id ? (
              <div className="flex-1 mr-4">
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <input type="text" value={editForm.title} onChange={e=>setEditForm({...editForm, title: e.target.value})} className={inputCls} />
                  <input type="text" value={editForm.author} onChange={e=>setEditForm({...editForm, author: e.target.value})} className={inputCls} />
                  <input type="number" value={editForm.mrp} onChange={e=>setEditForm({...editForm, mrp: e.target.value})} className={inputCls} placeholder="MRP" />
                  <input type="number" value={editForm.price} onChange={e=>setEditForm({...editForm, price: e.target.value})} className={inputCls} placeholder="Price" />
                  <div className="col-span-2 flex items-center gap-2 bg-cream-50 dark:bg-forest-700/30 border border-cream-200 dark:border-forest-600 p-2">
                    <label className="text-xs px-3 py-1.5 bg-forest-800 hover:bg-forest-900 text-white font-bold uppercase tracking-widest cursor-pointer transition-colors">
                      Replace Cover <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                    {editForm.image && <span className="text-xs text-forest-600 dark:text-forest-400 font-medium">Attached ✔</span>}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className={btnPrimary} onClick={handleSave}>Save</button>
                  <button className="border border-cream-300 dark:border-forest-600 px-4 py-2 text-xs font-bold uppercase tracking-widest text-forest-600 dark:text-cream-400 hover:bg-cream-50 transition-colors" onClick={() => setEditingId(null)}>Cancel</button>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex gap-4 items-center">
                {b.image
                  ? <img src={b.image} alt={b.title} className="w-12 h-16 object-cover border border-cream-200 dark:border-forest-700 flex-shrink-0" />
                  : <div className={`w-12 h-16 flex-shrink-0 flex items-center justify-center text-xs border border-cream-200 dark:border-forest-700 ${b.coverColor || 'bg-cream-100 dark:bg-forest-700'}`}>📖</div>
                }
                <div>
                  <h4 className="font-semibold text-sm text-forest-700 dark:text-cream-100">{b.title}</h4>
                  <p className="text-xs text-forest-500 dark:text-cream-500 mt-0.5">{b.author} · MRP ₹{b.mrp}</p>
                </div>
                <div className="ml-auto text-right mr-4">
                  <p className="font-bold text-forest-700 dark:text-cream-100">₹{b.price}</p>
                  <span className="text-[10px] font-medium text-forest-600 bg-cream-100 dark:bg-forest-700 dark:text-cream-400 px-2 py-0.5 mt-1 inline-block">{b.condition}</span>
                </div>
              </div>
            )}
            {editingId !== b.id && (
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleEdit(b)} className="px-3 py-1.5 border border-cream-200 dark:border-forest-600 text-xs font-bold uppercase tracking-widest text-forest-600 dark:text-cream-400 hover:bg-cream-50 dark:hover:bg-forest-700 transition-colors">Edit</button>
                <button onClick={() => deleteInventoryBook(b.id)} className="p-1.5 border border-red-200 text-red-500 hover:bg-red-50 transition-colors"><Trash2 size={14}/></button>
              </div>
            )}
          </div>
        ))}
        {filtered.length > 50 && <p className="text-center text-xs text-forest-400 dark:text-cream-500 pt-6">Showing 50 of {filtered.length} results. Use search to filter.</p>}
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
    updateDeliverySettings({ standardFee: Number(delSet.standardFee), expressFee: Number(delSet.expressFee), freeAbove: Number(delSet.freeAbove) });
    alert('Delivery settings saved');
  };
  const handleAddPromo = (e) => {
    e.preventDefault();
    if (newPromo.code) { addPromoCode({ ...newPromo, code: newPromo.code.toUpperCase() }); setNewPromo({ code: '', discount: 0, type: 'flat', minOrder: 0, active: true }); }
  };

  return (
    <div className="animate-fade-in space-y-10">
      <section>
        <h2 className="font-display font-bold text-2xl text-forest-800 dark:text-cream-100 mb-5">Delivery Fees</h2>
        <form onSubmit={handleDeliverySave} className={`${cardCls} p-6 grid grid-cols-1 md:grid-cols-3 gap-4`}>
          {[['Standard Delivery (₹)', 'standardFee'], ['Express Delivery (₹)', 'expressFee'], ['Free Delivery Above (₹)', 'freeAbove']].map(([lbl, key]) => (
            <div key={key}>
              <label className={lblCls}>{lbl}</label>
              <input type="number" value={delSet[key]} onChange={e=>setDelSet({...delSet, [key]: e.target.value})} className={inputCls} />
            </div>
          ))}
          <div className="md:col-span-3 flex justify-end mt-2">
            <button type="submit" className={btnPrimary}>Save Settings</button>
          </div>
        </form>
      </section>

      <section>
        <h2 className="font-display font-bold text-2xl text-forest-800 dark:text-cream-100 mb-5">Promo Codes</h2>
        <div className={`${cardCls} p-6 mb-4`}>
          <h3 className="font-semibold text-forest-800 dark:text-cream-100 mb-4">Create New Promo</h3>
          <form onSubmit={handleAddPromo} className="grid grid-cols-2 md:grid-cols-5 gap-3 items-end">
            <div><label className={lblCls}>Code</label><input type="text" value={newPromo.code} onChange={e=>setNewPromo({...newPromo, code: e.target.value})} required className={inputCls + " uppercase"} /></div>
            <div><label className={lblCls}>Type</label><select value={newPromo.type} onChange={e=>setNewPromo({...newPromo, type: e.target.value})} className={inputCls + " appearance-none"}><option value="flat">Flat (₹)</option><option value="percent">Percent (%)</option></select></div>
            <div><label className={lblCls}>Discount</label><input type="number" value={newPromo.discount} onChange={e=>setNewPromo({...newPromo, discount: Number(e.target.value)})} required className={inputCls} /></div>
            <div><label className={lblCls}>Min Order (₹)</label><input type="number" value={newPromo.minOrder} onChange={e=>setNewPromo({...newPromo, minOrder: Number(e.target.value)})} className={inputCls} /></div>
            <button type="submit" className={btnPrimary + " justify-center"}>Add</button>
          </form>
        </div>
        <div className="space-y-3">
          {promoCodes.map(p => (
            <div key={p.id} className={`${cardCls} p-4 flex justify-between items-center ${!p.active ? 'opacity-50' : ''}`}>
              <div className="flex items-center gap-3">
                <span className="font-display font-bold text-lg text-forest-800 dark:text-cream-100">{p.code}</span>
                <span className="bg-cream-100 dark:bg-forest-700 text-forest-700 dark:text-cream-300 px-2.5 py-0.5 text-xs font-medium">
                  {p.type === 'percent' ? `${p.discount}% OFF` : `₹${p.discount} OFF`} · Min ₹{p.minOrder}
                </span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => updatePromoCode(p.id, { active: !p.active })} className="border border-cream-300 dark:border-forest-600 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-forest-600 dark:text-cream-400 hover:bg-cream-50 dark:hover:bg-forest-700 transition-colors">{p.active ? 'Disable' : 'Enable'}</button>
                <button onClick={() => deletePromoCode(p.id)} className="border border-red-200 px-3 py-1.5 text-xs font-bold uppercase tracking-widest text-red-500 hover:bg-red-50 transition-colors">Delete</button>
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
    if (currentP !== adminCreds.password) { setErrorMsg('Incorrect current password.'); return; }
    if (u && p) {
      changeAdminCredentials(u, p);
      setMsg('Credentials updated successfully!');
      setTimeout(() => setMsg(''), 3000);
      setCurrentP(''); setU(''); setP('');
    }
  };

  return (
    <div className="animate-fade-in max-w-md">
      <h2 className="font-display font-bold text-2xl text-forest-800 dark:text-cream-100 mb-6">Settings</h2>

      <div className={`${cardCls} p-6 mb-5`}>
        <h3 className="font-semibold text-forest-800 dark:text-cream-100 mb-1">WhatsApp Support Number</h3>
        <p className="text-xs text-forest-400 dark:text-cream-500 mb-4">Include country code, no + sign (e.g. 919999999999)</p>
        <div className="flex gap-2">
          <input type="text" value={whatsappNumber} onChange={e => setWhatsappNumber(e.target.value)} placeholder="919999999999" className={inputCls + " flex-1"} />
          <button onClick={() => alert('Saved!')} className={btnPrimary}>Save</button>
        </div>
      </div>

      <div className={`${cardCls} p-6`}>
        <h3 className="font-semibold text-forest-800 dark:text-cream-100 mb-1">Admin Credentials</h3>
        <p className="text-xs text-forest-400 dark:text-cream-500 mb-5">Update master login. Store credentials safely.</p>
        {msg && <div className="mb-4 p-3 bg-forest-50 dark:bg-forest-700/30 border border-forest-200 text-forest-700 dark:text-forest-400 text-sm">{msg}</div>}
        {errorMsg && <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 text-red-600 text-sm">{errorMsg}</div>}
        <form onSubmit={handleUpdate} className="space-y-4">
          <div><label className={lblCls}>Current Password</label><input type="password" value={currentP} onChange={e=>setCurrentP(e.target.value)} required className={inputCls} /></div>
          <div><label className={lblCls}>New Username</label><input type="text" value={u} onChange={e=>setU(e.target.value)} required placeholder={`Current: ${adminCreds.username}`} className={inputCls} /></div>
          <div><label className={lblCls}>New Password</label><input type="password" value={p} onChange={e=>setP(e.target.value)} required className={inputCls} /></div>
          <button type="submit" className={btnPrimary + " w-full justify-center mt-2"}>Update Credentials</button>
        </form>
      </div>
    </div>
  );
}
