import { createContext, useContext, useState, useEffect } from 'react';
import { books as defaultBooks } from '../data/books';

const AdminContext = createContext();

const DEFAULT_CREDS = { username: 'admin', password: 'pageback123' };

const DEFAULT_PROMOS = [
  { id: 1, code: 'WELCOME10', discount: 10, type: 'percent', active: true, minOrder: 0 },
  { id: 2, code: 'FLAT50',    discount: 50, type: 'flat',    active: true, minOrder: 200 },
];

const DEFAULT_DELIVERY = { standardFee: 49, expressFee: 99, freeAbove: 499 };

const ls = (key, fallback) => {
  try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : fallback; }
  catch { return fallback; }
};

export function AdminProvider({ children }) {
  const [adminLoggedIn, setAdminLoggedIn]   = useState(() => localStorage.getItem('pb_admin_session') === 'true');
  const [adminCreds,    setAdminCreds]       = useState(() => ls('pb_admin_creds',     DEFAULT_CREDS));
  const [orders,        setOrders]           = useState(() => ls('pb_orders',          []));
  const [sellRequests,  setSellRequests]     = useState(() => ls('pb_sell_requests',   []));
  const [inventory,     setInventory]        = useState(() => ls('pb_inventory',       defaultBooks));
  const [promoCodes,    setPromoCodes]       = useState(() => ls('pb_promo_codes',     DEFAULT_PROMOS));
  const [deliverySettings, setDeliverySettings] = useState(() => ls('pb_delivery_settings', DEFAULT_DELIVERY));

  useEffect(() => { localStorage.setItem('pb_admin_session',   String(adminLoggedIn)); },   [adminLoggedIn]);
  useEffect(() => { localStorage.setItem('pb_admin_creds',     JSON.stringify(adminCreds)); }, [adminCreds]);
  useEffect(() => { localStorage.setItem('pb_orders',          JSON.stringify(orders)); },      [orders]);
  useEffect(() => { localStorage.setItem('pb_sell_requests',   JSON.stringify(sellRequests)); }, [sellRequests]);
  useEffect(() => { localStorage.setItem('pb_inventory',       JSON.stringify(inventory)); },    [inventory]);
  useEffect(() => { localStorage.setItem('pb_promo_codes',     JSON.stringify(promoCodes)); },   [promoCodes]);
  useEffect(() => { localStorage.setItem('pb_delivery_settings', JSON.stringify(deliverySettings)); }, [deliverySettings]);

  // ── Admin Auth ──
  const adminLogin = (username, password) => {
    if (username === adminCreds.username && password === adminCreds.password) {
      setAdminLoggedIn(true); return true;
    }
    return false;
  };
  const adminLogout = () => { setAdminLoggedIn(false); localStorage.removeItem('pb_admin_session'); };
  const changeAdminCredentials = (u, p) => setAdminCreds({ username: u, password: p });

  // ── Orders ──
  const refreshOrders = () => setOrders(ls('pb_orders', []));

  const STATUS_LABELS = {
    placed: 'Order Placed', confirmed: 'Confirmed', processing: 'Processing',
    shipped: 'Shipped', outForDelivery: 'Out for Delivery', delivered: 'Delivered', cancelled: 'Cancelled',
  };
  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => prev.map(o =>
      o.id !== orderId ? o : {
        ...o, status: newStatus,
        statusHistory: [...(o.statusHistory || []), {
          status: newStatus, label: STATUS_LABELS[newStatus] || newStatus, time: new Date().toISOString()
        }]
      }
    ));
  };

  // ── Sell Requests ──
  const addSellRequest = (req) => {
    const r = { ...req, id: `SELL${Date.now()}`, status: 'pending', submittedAt: new Date().toISOString() };
    setSellRequests(prev => [r, ...prev]);
    return r.id;
  };
  const updateSellRequest = (id, action, note = '') => {
    setSellRequests(prev => prev.map(r =>
      r.id === id ? { ...r, status: action, adminNote: note, reviewedAt: new Date().toISOString() } : r
    ));
    // If accepted, add book to inventory
    if (action === 'accepted') {
      const req = sellRequests.find(r => r.id === id);
      if (req) {
        const newBook = {
          id: Date.now(), title: req.title, author: req.author,
          mrp: req.mrp, price: Math.round(req.mrp * 0.6),
          genre: req.genre || 'Fiction', condition: req.condition || 'Good',
          language: 'English', demandLevel: 'medium',
          coverColor: 'from-teal-400 to-emerald-600',
          description: `Acquired via sell request. Condition: ${req.condition}.`,
          conditionReport: req.condition, tags: ['acquired'],
        };
        setInventory(prev => [newBook, ...prev]);
      }
    }
  };

  // ── Inventory ──
  const updateInventoryBook = (id, data) => setInventory(prev => prev.map(b => b.id === id ? { ...b, ...data } : b));
  const addInventoryBook = (data) => setInventory(prev => [{ ...data, id: Date.now(), tags: [], coverColor: data.coverColor || 'from-violet-400 to-purple-600' }, ...prev]);
  const deleteInventoryBook = (id) => setInventory(prev => prev.filter(b => b.id !== id));

  const importCSV = (csvText) => {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, '').toLowerCase());
    const imported = [];
    for (let i = 1; i < lines.length; i++) {
      const vals = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
      const obj = {};
      headers.forEach((h, idx) => { obj[h] = vals[idx] || ''; });
      if (obj.title && obj.author) {
        imported.push({
          id: Date.now() + i, title: obj.title, author: obj.author,
          isbn: obj.isbn || '', genre: obj.genre || 'Fiction',
          mrp: parseInt(obj.mrp) || 0, price: parseInt(obj.price) || 0,
          condition: obj.condition || 'Good', language: obj.language || 'English',
          demandLevel: obj.demandlevel || 'medium',
          coverColor: 'from-slate-400 to-gray-600',
          description: obj.description || '', tags: [],
        });
      }
    }
    setInventory(prev => [...imported, ...prev]);
    return imported.length;
  };

  // ── Promo Codes ──
  const addPromoCode    = (p)     => setPromoCodes(prev => [...prev, { ...p, id: Date.now() }]);
  const updatePromoCode = (id, d) => setPromoCodes(prev => prev.map(p => p.id === id ? { ...p, ...d } : p));
  const deletePromoCode = (id)    => setPromoCodes(prev => prev.filter(p => p.id !== id));
  const updateDeliverySettings = (s) => setDeliverySettings(s);

  return (
    <AdminContext.Provider value={{
      adminLoggedIn, adminLogin, adminLogout, changeAdminCredentials, adminCreds,
      orders, refreshOrders, updateOrderStatus,
      sellRequests, addSellRequest, updateSellRequest,
      inventory, updateInventoryBook, addInventoryBook, deleteInventoryBook, importCSV,
      promoCodes, addPromoCode, updatePromoCode, deletePromoCode,
      deliverySettings, updateDeliverySettings,
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => useContext(AdminContext);
