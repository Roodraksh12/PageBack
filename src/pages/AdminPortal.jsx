import { useState, useRef, useEffect, useCallback } from 'react';
import { useAdmin } from '../context/AdminContext';
import { useApp } from '../context/AppContext';
import { 
  Lock, Tag, PackageSearch, Inbox, Database, LogOut, 
  Search, Plus, Upload, Trash2, Check, X, ShieldAlert 
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
  const [countdown, setCountdown] = useState(null); // null = idle timer running; number = warning phase
  const logoutTimerRef  = useRef(null);
  const countdownRef    = useRef(null);

  const clearAllTimers = useCallback(() => {
    clearTimeout(logoutTimerRef.current);
    clearInterval(countdownRef.current);
  }, []);

  const startLogoutTimer = useCallback(() => {
    clearAllTimers();
    setCountdown(null);
    // After (INACTIVITY_TIMEOUT - WARNING_BEFORE)s → start countdown warning
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

  // Start timer when admin logs in; kill it when they log out
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
      <div className="min-h-screen flex items-center justify-center p-4 bg-cream-50 dark:bg-forest-900 transition-colors">
        <div className="w-full max-w-md bg-white dark:bg-forest-800 rounded-3xl shadow-warm-lg p-8 border border-cream-200 dark:border-forest-700">
          <div className="flex justify-between items-start mb-6">
            <div>
              <ShieldAlert size={32} className="text-amber-500 mb-2" />
              <h1 className="font-display font-bold text-2xl text-forest-800 dark:text-cream-100">Admin Portal</h1>
              <p className="text-sm text-forest-500 dark:text-cream-400">Restricted access area.</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {loginError && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-xl">{loginError}</div>}
            <div>
              <label className="block text-sm font-medium text-forest-700 dark:text-cream-300 mb-1">Username</label>
              <input type="text" value={username} onChange={e => setUsername(e.target.value)} required
                className="w-full border rounded-xl px-4 py-3 bg-white dark:bg-forest-700 text-forest-800 dark:text-cream-100 focus:outline-none focus:ring-2 focus:ring-amber-500 border-cream-300 dark:border-forest-600" />
            </div>
            <div>
              <label className="block text-sm font-medium text-forest-700 dark:text-cream-300 mb-1">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                className="w-full border rounded-xl px-4 py-3 bg-white dark:bg-forest-700 text-forest-800 dark:text-cream-100 focus:outline-none focus:ring-2 focus:ring-amber-500 border-cream-300 dark:border-forest-600" />
            </div>
            <button type="submit" className="w-full btn-amber py-3 flex justify-center items-center gap-2">
              <Lock size={18} /> Access Portal
            </button>
            <div className="text-center mt-4">
              <Link to="/" className="text-sm text-forest-500 hover:text-forest-700 dark:text-cream-400 dark:hover:text-cream-200">
                ← Return to main site
              </Link>
            </div>
          </form>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'orders',    label: 'Orders',        icon: PackageSearch },
    { id: 'sellReqs',  label: 'Sell Requests', icon: Inbox },
    { id: 'inventory', label: 'Inventory',     icon: Database },
    { id: 'promo',     label: 'Discounts & Delivery', icon: Tag },
    { id: 'security',  label: 'Settings',      icon: Lock },
  ];

  return (
    <div className="min-h-screen flex bg-cream-50 dark:bg-forest-900 transition-colors">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-forest-800 border-r border-cream-200 dark:border-forest-700 flex flex-col fixed inset-y-0 z-10">
        <div className="p-6 border-b border-cream-200 dark:border-forest-700">
          <h2 className="font-display font-bold text-xl text-forest-800 dark:text-cream-100 flex items-center gap-2">
            <ShieldAlert className="text-amber-500" /> Admin
          </h2>
          <p className="text-xs text-forest-500 mt-1">PageBack Control Center</p>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {tabs.map(t => {
            const Icon = t.icon;
            return (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  activeTab === t.id 
                    ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400' 
                    : 'text-forest-600 dark:text-cream-300 hover:bg-cream-100 dark:hover:bg-forest-700'
                }`}>
                <Icon size={18} /> {t.label}
              </button>
            )
          })}
        </nav>
        <div className="p-4 border-t border-cream-200 dark:border-forest-700 space-y-2">
          <button onClick={() => adminLogout()} className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
            <LogOut size={16} /> Log Out
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 p-8 overflow-y-auto">
        {/* Inactivity Warning Toast */}
        {countdown !== null && (
          <div className="fixed top-4 right-4 z-50 flex items-center gap-4 bg-amber-50 border-2 border-amber-400 text-amber-900 px-5 py-4 rounded-2xl shadow-xl animate-fade-in" role="alert">
            {/* Circular countdown ring */}
            <div className="relative w-12 h-12 flex-shrink-0">
              <svg className="w-12 h-12 -rotate-90" viewBox="0 0 44 44">
                <circle cx="22" cy="22" r="18" fill="none" stroke="#fde68a" strokeWidth="4" />
                <circle
                  cx="22" cy="22" r="18" fill="none" stroke="#d97706" strokeWidth="4"
                  strokeDasharray={`${2 * Math.PI * 18}`}
                  strokeDashoffset={`${2 * Math.PI * 18 * (1 - countdown / WARNING_BEFORE)}`}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dashoffset 1s linear' }}
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center font-bold text-amber-700 text-sm">{countdown}</span>
            </div>
            <div className="flex-1">
              <p className="font-bold text-sm">Session expiring soon</p>
              <p className="text-xs text-amber-700 mt-0.5">You'll be logged out in <span className="font-bold">{countdown}s</span> due to inactivity.</p>
            </div>
            <button
              onClick={() => { resetTimer(); }}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg transition-colors"
            >
              Stay Logged In
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
      <h2 className="text-2xl font-bold text-forest-800 dark:text-cream-100 mb-6">Order Management</h2>
      <div className="space-y-4">
        {orders.length === 0 ? (
          <p className="text-forest-500">No orders received yet.</p>
        ) : (
          orders.map(o => (
            <div key={o.id} className="bg-white dark:bg-forest-800 p-5 rounded-2xl shadow-sm border border-cream-200 dark:border-forest-700">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="font-bold text-forest-800 dark:text-cream-100">{o.id}</h3>
                  <p className="text-sm text-forest-500">{new Date(o.date).toLocaleString()}</p>
                </div>
                <select 
                  value={o.status}
                  onChange={e => updateOrderStatus(o.id, e.target.value)}
                  className="bg-cream-50 dark:bg-forest-900 border border-cream-200 dark:border-forest-600 rounded-lg px-3 py-1.5 text-sm font-medium text-forest-800 dark:text-cream-100 focus:ring-2 focus:ring-amber-500"
                >
                  {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="space-y-2 mb-4">
                {o.items.map(i => (
                  <div key={i.id} className="flex justify-between text-sm">
                    <span className="text-forest-600 dark:text-cream-300">{i.qty}x {i.title}</span>
                    <span className="text-forest-800 dark:text-cream-100">₹{i.price * i.qty}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-cream-100 dark:border-forest-700 pt-3 flex justify-between text-sm">
                <span className="text-forest-500">Subtotal: ₹{o.subtotal} | Delivery: ₹{o.deliveryFee} | Discount: -₹{o.discount || 0}</span>
                <span className="font-bold text-forest-800 dark:text-emerald-400">Total: ₹{o.total}</span>
              </div>
              
              {o.deliveryAddress && (
                <div className="border-t border-cream-100 dark:border-forest-700 mt-4 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-forest-600 dark:text-cream-300 bg-cream-50 dark:bg-forest-900/30 p-4 rounded-xl">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-forest-500 block mb-1">Deliver To</span>
                    <span className="font-bold block text-forest-800 dark:text-cream-100">{o.deliveryAddress.fullName}</span>
                    <span className="block line-clamp-2">{o.deliveryAddress.address}</span>
                    <span className="block">{o.deliveryAddress.city}, {o.deliveryAddress.state} - {o.deliveryAddress.pinCode}</span>
                    <span className="block mt-1">Ph: {o.deliveryAddress.phone}</span>
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-forest-500 block mb-1">Payment Method</span>
                    <span className="font-bold text-forest-800 dark:text-cream-100">
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
      <h2 className="text-2xl font-bold text-forest-800 dark:text-cream-100 mb-6">Sell Requests To Review</h2>
      <div className="space-y-4">
        {sellRequests.filter(r => r.status === 'pending' || r.status === 'review').length === 0 ? (
          <p className="text-forest-500">No pending requests.</p>
        ) : (
          sellRequests.filter(r => r.status === 'pending' || r.status === 'review').map(r => (
            <div key={r.id} className="bg-white dark:bg-forest-800 p-5 rounded-2xl shadow-sm border border-amber-200 dark:border-amber-900">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-forest-800 dark:text-cream-100 text-lg">{r.title}</h3>
                  <p className="text-sm text-forest-600 dark:text-cream-400">By {r.author} | Condition: {r.condition} | MRP: ₹{r.mrp}</p>
                </div>
                <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full font-bold uppercase">{r.status}</span>
              </div>
              {r.image && (
                <div className="mb-4">
                  <p className="text-xs text-forest-500 mb-1">Uploaded Photo:</p>
                  <img src={r.image} alt="Book" className="h-32 object-contain border border-cream-200 dark:border-forest-700 rounded-lg" />
                </div>
              )}
              <div className="flex gap-2 mt-4">
                <button onClick={() => updateSellRequest(r.id, 'accepted')} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium flex items-center gap-1">
                  <Check size={16} /> Accept & Add to Inventory
                </button>
                <button onClick={() => updateSellRequest(r.id, 'rejected')} className="px-4 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded-lg text-sm font-medium flex items-center gap-1">
                  <X size={16} /> Reject
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      <h3 className="text-xl font-bold text-forest-800 dark:text-cream-100 mt-10 mb-4">Past Decisions</h3>
      <div className="space-y-3 opacity-70">
        {sellRequests.filter(r => r.status === 'accepted' || r.status === 'rejected').map(r => (
          <div key={r.id} className="bg-white dark:bg-forest-800 p-4 rounded-xl border border-cream-200 dark:border-forest-700 flex justify-between items-center">
            <div>
              <p className="font-bold text-forest-800 dark:text-cream-100">{r.title}</p>
              <p className="text-xs text-forest-500">Decision: {r.status.toUpperCase()} on {new Date(r.reviewedAt).toLocaleDateString()}</p>
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
        <h2 className="text-2xl font-bold text-forest-800 dark:text-cream-100">Live Inventory ({inventory.length})</h2>
        <div className="flex gap-2">
          <input type="file" accept=".csv" ref={fileInput} className="hidden" onChange={handleCSV} />
          <button onClick={() => fileInput.current.click()} className="btn-outline flex items-center gap-2 py-2 px-3 text-sm">
            <Upload size={16} /> Bulk CSV Import
          </button>
          <button onClick={() => {
            setEditForm({ title: '', author: '', mrp: 0, price: 0, condition: 'Good', genre: 'Fiction' });
            setEditingId('new');
          }} className="btn-amber flex items-center gap-2 py-2 px-3 text-sm">
            <Plus size={16} /> Add Book
          </button>
        </div>
      </div>

      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-forest-400" size={18} />
        <input type="text" placeholder="Search inventory..." value={q} onChange={e => setQ(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white dark:bg-forest-800 border border-cream-200 dark:border-forest-700 rounded-xl focus:ring-2 focus:ring-amber-500 outline-none text-forest-800 dark:text-cream-100" />
      </div>

      <div className="space-y-3">
        {editingId === 'new' && (
          <div className="bg-amber-50 dark:bg-amber-900/10 p-5 rounded-2xl border-2 border-amber-400">
            <h3 className="font-bold mb-4 dark:text-amber-400">Add New Book</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <input type="text" placeholder="Title" value={editForm.title} onChange={e=>setEditForm({...editForm, title: e.target.value})} className="border p-2 rounded bg-white dark:bg-forest-800 dark:text-cream-100" />
              <input type="text" placeholder="Author" value={editForm.author} onChange={e=>setEditForm({...editForm, author: e.target.value})} className="border p-2 rounded bg-white dark:bg-forest-800 dark:text-cream-100" />
              <input type="number" placeholder="MRP" value={editForm.mrp} onChange={e=>setEditForm({...editForm, mrp: e.target.value})} className="border p-2 rounded bg-white dark:bg-forest-800 dark:text-cream-100" />
              <input type="number" placeholder="Sell Price" value={editForm.price} onChange={e=>setEditForm({...editForm, price: e.target.value})} className="border p-2 rounded bg-white dark:bg-forest-800 dark:text-cream-100" />
              <div className="col-span-2 flex items-center gap-3 border p-2 rounded bg-white dark:bg-forest-800 dark:text-cream-100">
                <label className="text-sm border border-cream-300 dark:border-forest-600 px-3 py-1 bg-cream-100 dark:bg-forest-700 text-forest-700 dark:text-cream-200 rounded-lg cursor-pointer hover:bg-cream-200 dark:hover:bg-forest-600 transition-colors flex items-center gap-1 font-medium">
                  <Camera size={14} /> Upload Cover
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
                {editForm.image && <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1"><Check size={14} /> Image Attached</span>}
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button className="btn-primary py-1 px-4 text-sm" onClick={() => { addInventoryBook(editForm); setEditingId(null); }}>Save</button>
              <button className="btn-outline py-1 px-4 text-sm" onClick={() => setEditingId(null)}>Cancel</button>
            </div>
          </div>
        )}

        {filtered.slice(0, 50).map(b => (
          <div key={b.id} className="bg-white dark:bg-forest-800 p-4 rounded-xl border border-cream-200 dark:border-forest-700 flex justify-between items-center group hover:shadow-md transition-shadow">
            {editingId === b.id ? (
              <div className="flex-1 mr-4">
                <div className="grid grid-cols-2 gap-2 mb-2">
                  <input type="text" value={editForm.title} onChange={e=>setEditForm({...editForm, title: e.target.value})} className="border p-1 text-sm bg-white dark:bg-forest-700 dark:text-white" />
                  <input type="text" value={editForm.author} onChange={e=>setEditForm({...editForm, author: e.target.value})} className="border p-1 text-sm bg-white dark:bg-forest-700 dark:text-white" />
                  <input type="number" value={editForm.mrp} onChange={e=>setEditForm({...editForm, mrp: e.target.value})} className="border p-1 text-sm bg-white dark:bg-forest-700 dark:text-white" placeholder="MRP" />
                  <input type="number" value={editForm.price} onChange={e=>setEditForm({...editForm, price: e.target.value})} className="border p-1 text-sm bg-white dark:bg-forest-700 dark:text-white" placeholder="Price" />
                  <div className="col-span-2 flex items-center gap-2 border border-transparent p-1 text-sm bg-white dark:bg-forest-700 rounded">
                    <label className="text-xs px-2 py-1 bg-cream-200 dark:bg-forest-600 text-forest-800 dark:text-cream-100 rounded cursor-pointer hover:bg-cream-300 dark:hover:bg-forest-500 font-medium">
                      Upload Cover
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                    {editForm.image && <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400">Attached ✔</span>}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="bg-emerald-600 text-white px-3 py-1 rounded text-xs" onClick={handleSave}>Save</button>
                  <button className="bg-gray-200 dark:bg-forest-600 text-forest-800 dark:text-cream-100 px-3 py-1 rounded text-xs" onClick={() => setEditingId(null)}>Cancel</button>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex gap-4 items-center">
                {b.image ? (
                  <img src={b.image} alt={b.title} className="w-10 h-14 object-cover rounded shadow-sm flex-shrink-0" />
                ) : (
                  <div className={`w-10 h-14 bg-gradient-to-br ${b.coverColor} rounded shadow-sm flex-shrink-0 flex items-center justify-center text-xs`}>📖</div>
                )}
                <div>
                  <h4 className="font-bold text-forest-800 dark:text-cream-100">{b.title}</h4>
                  <p className="text-xs text-forest-500">{b.author} | MRP: ₹{b.mrp}</p>
                </div>
                <div className="ml-auto text-right mr-4">
                  <p className="font-bold text-amber-600 dark:text-amber-400">₹{b.price}</p>
                  <p className="text-xs text-emerald-600 border border-emerald-200 bg-emerald-50 dark:bg-emerald-900/30 dark:border-emerald-700 px-1.5 py-0.5 rounded inline-block mt-1">{b.condition}</p>
                </div>
              </div>
            )}
            
            {editingId !== b.id && (
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button onClick={() => handleEdit(b)} className="px-3 py-2 bg-cream-100 dark:bg-forest-700 text-forest-700 dark:text-cream-300 rounded hover:bg-forest-200">Edit</button>
                <button onClick={() => deleteInventoryBook(b.id)} className="px-3 py-2 bg-red-100 text-red-600 hover:bg-red-200 rounded"><Trash2 size={16}/></button>
              </div>
            )}
          </div>
        ))}
        {filtered.length > 50 && <p className="text-center text-sm text-forest-400 pt-4">Showing 50 of {filtered.length} results. Use search to find more.</p>}
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
        <h2 className="text-2xl font-bold text-forest-800 dark:text-cream-100 mb-6">Delivery Fees</h2>
        <form onSubmit={handleDeliverySave} className="bg-white dark:bg-forest-800 p-6 rounded-2xl border border-cream-200 dark:border-forest-700 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm mb-1 text-forest-600 dark:text-cream-300">Standard Delivery (₹)</label>
            <input type="number" value={delSet.standardFee} onChange={e=>setDelSet({...delSet, standardFee: e.target.value})} className="w-full border p-2 rounded bg-cream-50 dark:bg-forest-700 dark:text-white dark:border-forest-600" />
          </div>
          <div>
            <label className="block text-sm mb-1 text-forest-600 dark:text-cream-300">Express Delivery (₹)</label>
            <input type="number" value={delSet.expressFee} onChange={e=>setDelSet({...delSet, expressFee: e.target.value})} className="w-full border p-2 rounded bg-cream-50 dark:bg-forest-700 dark:text-white dark:border-forest-600" />
          </div>
          <div>
            <label className="block text-sm mb-1 text-forest-600 dark:text-cream-300">Free Delivery Above (₹)</label>
            <input type="number" value={delSet.freeAbove} onChange={e=>setDelSet({...delSet, freeAbove: e.target.value})} className="w-full border p-2 rounded bg-cream-50 dark:bg-forest-700 dark:text-white dark:border-forest-600" />
          </div>
          <div className="md:col-span-3 flex justify-end">
            <button type="submit" className="btn-primary py-2 px-6">Save Settings</button>
          </div>
        </form>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-forest-800 dark:text-cream-100 mb-6">Promo Codes</h2>
        <div className="bg-white dark:bg-forest-800 p-6 rounded-2xl border border-cream-200 dark:border-forest-700 mb-6">
          <h3 className="font-bold mb-4 dark:text-cream-100">Create New Promo</h3>
          <form onSubmit={handleAddPromo} className="grid grid-cols-2 md:grid-cols-5 gap-3 items-end">
            <div><label className="text-xs mb-1 block dark:text-cream-300">Code</label><input type="text" value={newPromo.code} onChange={e=>setNewPromo({...newPromo, code: e.target.value})} required className="w-full border p-2 rounded uppercase bg-cream-50 dark:bg-forest-700 dark:text-white dark:border-forest-600" /></div>
            <div><label className="text-xs mb-1 block dark:text-cream-300">Type</label><select value={newPromo.type} onChange={e=>setNewPromo({...newPromo, type: e.target.value})} className="w-full border p-2 rounded bg-cream-50 dark:bg-forest-700 dark:text-white dark:border-forest-600"><option value="flat">Flat (₹)</option><option value="percent">Percent (%)</option></select></div>
            <div><label className="text-xs mb-1 block dark:text-cream-300">Discount</label><input type="number" value={newPromo.discount} onChange={e=>setNewPromo({...newPromo, discount: Number(e.target.value)})} required className="w-full border p-2 rounded bg-cream-50 dark:bg-forest-700 dark:text-white dark:border-forest-600" /></div>
            <div><label className="text-xs mb-1 block dark:text-cream-300">Min Order (₹)</label><input type="number" value={newPromo.minOrder} onChange={e=>setNewPromo({...newPromo, minOrder: Number(e.target.value)})} className="w-full border p-2 rounded bg-cream-50 dark:bg-forest-700 dark:text-white dark:border-forest-600" /></div>
            <button type="submit" className="btn-amber py-2">Add</button>
          </form>
        </div>

        <div className="space-y-3">
          {promoCodes.map(p => (
            <div key={p.id} className={`p-4 rounded-xl border flex justify-between items-center ${p.active ? 'bg-white border-emerald-200 dark:bg-forest-800 dark:border-emerald-900/50' : 'bg-gray-50 border-gray-200 opacity-60 dark:bg-forest-900 dark:border-forest-800'}`}>
              <div>
                <span className="font-bold text-lg dark:text-cream-100 mr-3">{p.code}</span>
                <span className="bg-cream-100 text-forest-700 dark:bg-forest-700 dark:text-cream-300 px-2 py-0.5 rounded text-xs">
                  {p.type === 'percent' ? `${p.discount}% OFF` : `₹${p.discount} OFF`} (Min: ₹{p.minOrder})
                </span>
              </div>
              <div className="flex gap-2">
                <button onClick={() => updatePromoCode(p.id, { active: !p.active })} className="px-3 py-1 bg-cream-200 dark:bg-forest-700 hover:bg-cream-300 rounded text-sm text-forest-800 dark:text-cream-100">
                  {p.active ? 'Disable' : 'Enable'}
                </button>
                <button onClick={() => deletePromoCode(p.id)} className="px-3 py-1 bg-red-100 hover:bg-red-200 text-red-600 rounded text-sm">Delete</button>
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
      <h2 className="text-2xl font-bold text-forest-800 dark:text-cream-100 mb-6">General Settings</h2>
      
      <div className="bg-white dark:bg-forest-800 p-6 rounded-2xl border border-cream-200 dark:border-forest-700 mb-6">
        <h3 className="font-bold mb-4 dark:text-cream-100">Support Contact</h3>
        <p className="text-sm text-forest-500 dark:text-cream-400 mb-4">Update the WhatsApp number where support queries and manual orders are routed. (Include country code, no + sign)</p>
        <div className="flex gap-2">
          <input 
            type="text" 
            value={whatsappNumber} 
            onChange={e => setWhatsappNumber(e.target.value)} 
            placeholder="e.g. 919999999999"
            className="flex-1 border p-2 rounded bg-cream-50 dark:bg-forest-700 dark:text-white dark:border-forest-600" 
          />
          <button onClick={() => alert('WhatsApp number updated!')} className="btn-primary py-2 px-6">Save</button>
        </div>
      </div>

      <div className="bg-white dark:bg-forest-800 p-6 rounded-2xl border border-cream-200 dark:border-forest-700">
        <p className="text-sm text-forest-500 dark:text-cream-400 mb-6">Update the master admin login credentials. Ensure you store these safely.</p>
        
        {msg && <div className="mb-4 p-3 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg text-sm">{msg}</div>}
        {errorMsg && <div className="mb-4 p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm">{errorMsg}</div>}
        
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-sm mb-1 dark:text-cream-300">Current Password</label>
            <input type="password" value={currentP} onChange={e=>setCurrentP(e.target.value)} required className="w-full border p-2 rounded bg-cream-50 dark:bg-forest-700 dark:text-white dark:border-forest-600" />
          </div>
          <div>
            <label className="block text-sm mb-1 dark:text-cream-300">New Username</label>
            <input type="text" value={u} onChange={e=>setU(e.target.value)} required placeholder={`Current: ${adminCreds.username}`} className="w-full border p-2 rounded bg-cream-50 dark:bg-forest-700 dark:text-white dark:border-forest-600" />
          </div>
          <div>
            <label className="block text-sm mb-1 dark:text-cream-300">New Password</label>
            <input type="password" value={p} onChange={e=>setP(e.target.value)} required className="w-full border p-2 rounded bg-cream-50 dark:bg-forest-700 dark:text-white dark:border-forest-600" />
          </div>
          <button type="submit" className="btn-amber w-full py-2">Update Credentials</button>
        </form>
      </div>
    </div>
  );
}
