import { createContext, useContext, useState, useEffect } from 'react';
import { collection, doc, onSnapshot, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';

const AdminContext = createContext();

const DEFAULT_CREDS = { username: 'admin', password: 'pageback123' };
const DEFAULT_DELIVERY = { standardFee: 49, expressFee: 99, freeAbove: 499 };

export function AdminProvider({ children }) {
  const [adminLoggedIn, setAdminLoggedIn] = useState(() => localStorage.getItem('pb_admin_session') === 'true');
  const [adminCreds, setAdminCreds] = useState(DEFAULT_CREDS);
  const [orders, setOrders] = useState([]);
  const [sellRequests, setSellRequests] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [inventoryLoading, setInventoryLoading] = useState(true);
  const [promoCodes, setPromoCodes] = useState([]);
  const [deliverySettings, setDeliverySettings] = useState(DEFAULT_DELIVERY);

  useEffect(() => { localStorage.setItem('pb_admin_session', String(adminLoggedIn)); }, [adminLoggedIn]);

  useEffect(() => {
    const unsubOrders = onSnapshot(collection(db, 'orders'), snap => setOrders(snap.docs.map(d => ({ ...d.data(), id: d.id }))));
    const unsubSells = onSnapshot(collection(db, 'sellRequests'), snap => setSellRequests(snap.docs.map(d => ({ ...d.data(), id: d.id }))));
    const unsubInv = onSnapshot(collection(db, 'inventory'), snap => {
      setInventory(snap.docs.map(d => ({ ...d.data(), id: d.id })));
      setInventoryLoading(false);
    });
    const unsubPromos = onSnapshot(collection(db, 'promos'), snap => setPromoCodes(snap.docs.map(d => ({ ...d.data(), id: d.id }))));
    const unsubSettings = onSnapshot(doc(db, 'admin', 'settings'), docSnap => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.creds) setAdminCreds(data.creds);
        if (data.delivery) setDeliverySettings(data.delivery);
      }
    });
    return () => { unsubOrders(); unsubSells(); unsubInv(); unsubPromos(); unsubSettings(); };
  }, []);

  // ── Admin Auth ──
  const adminLogin = (username, password) => {
    if (username === adminCreds.username && password === adminCreds.password) {
      setAdminLoggedIn(true); return true;
    }
    return false;
  };
  const adminLogout = () => { setAdminLoggedIn(false); localStorage.removeItem('pb_admin_session'); };
  const changeAdminCredentials = async (u, p) => await setDoc(doc(db, 'admin', 'settings'), { creds: { username: u, password: p } }, { merge: true });

  // ── Orders ──
  const refreshOrders = () => {};

  const STATUS_ORDER = ['placed', 'confirmed', 'processing', 'shipped', 'outForDelivery', 'delivered', 'cancelled'];
  const STATUS_LABELS = {
    placed: 'Order Placed', confirmed: 'Confirmed', processing: 'Processing',
    shipped: 'Shipped', outForDelivery: 'Out for Delivery', delivered: 'Delivered', cancelled: 'Cancelled',
  };
  const updateOrderStatus = async (orderId, newStatus) => {
    const o = orders.find(x => x.id === orderId);
    if (!o) return;
    const currentIdx = STATUS_ORDER.indexOf(o.status);
    const nextIdx = STATUS_ORDER.indexOf(newStatus);
    if (nextIdx !== currentIdx && nextIdx !== currentIdx + 1) return;
    await updateDoc(doc(db, 'orders', String(orderId)), {
      status: newStatus,
      statusHistory: [...(o.statusHistory || []), {
        status: newStatus, label: STATUS_LABELS[newStatus] || newStatus, time: new Date().toISOString()
      }]
    });
  };

  // ── Sell Requests ──
  const addSellRequest = async (req) => {
    const rId = `SELL${Date.now()}`;
    await setDoc(doc(db, 'sellRequests', rId), { ...req, status: 'pending', submittedAt: new Date().toISOString() });
    return rId;
  };
  const updateSellRequest = async (id, action, note = '') => {
    await updateDoc(doc(db, 'sellRequests', String(id)), {
      status: action, adminNote: note, reviewedAt: new Date().toISOString()
    });
    if (action === 'accepted') {
      const req = sellRequests.find(r => r.id === id);
      if (req) {
        const newBookId = String(Date.now());
        await setDoc(doc(db, 'inventory', newBookId), {
          title: req.title, author: req.author,
          mrp: req.mrp, price: Math.round(req.mrp * 0.6),
          genre: req.genre || 'Fiction', condition: req.condition || 'Good',
          language: 'English', demandLevel: 'medium',
          coverColor: 'from-teal-400 to-emerald-600',
          description: `Acquired via sell request. Condition: ${req.condition}.`,
          conditionReport: req.condition, tags: ['acquired'],
        });
      }
    }
  };

  // ── Inventory ──
  const updateInventoryBook = async (id, data) => await updateDoc(doc(db, 'inventory', String(id)), data);
  const addInventoryBook = async (data) => await setDoc(doc(db, 'inventory', String(Date.now())), { ...data, tags: [], coverColor: data.coverColor || 'from-violet-400 to-purple-600' });
  const deleteInventoryBook = async (id) => await deleteDoc(doc(db, 'inventory', String(id)));

  const importCSV = async (csvText) => {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, '').toLowerCase());
    let imported = 0;
    const batch = [];
    for (let i = 1; i < lines.length; i++) {
      const vals = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
      const obj = {};
      headers.forEach((h, idx) => { obj[h] = vals[idx] || ''; });
      if (obj.title && obj.author) {
        batch.push(setDoc(doc(db, 'inventory', String(Date.now() + i)), {
          title: obj.title, author: obj.author,
          isbn: obj.isbn || '', genre: obj.genre || 'Fiction',
          mrp: parseInt(obj.mrp) || 0, price: parseInt(obj.price) || 0,
          condition: obj.condition || 'Good', language: obj.language || 'English',
          demandLevel: obj.demandlevel || 'medium',
          coverColor: 'from-slate-400 to-gray-600',
          description: obj.description || '', tags: [],
        }));
        imported++;
      }
    }
    await Promise.all(batch);
    return imported;
  };

  // ── Promo Codes ──
  const addPromoCode    = async (p)     => await setDoc(doc(db, 'promos', String(Date.now())), p);
  const updatePromoCode = async (id, d) => await updateDoc(doc(db, 'promos', String(id)), d);
  const deletePromoCode = async (id)    => await deleteDoc(doc(db, 'promos', String(id)));
  const updateDeliverySettings = async (s) => await setDoc(doc(db, 'admin', 'settings'), { delivery: s }, { merge: true });

  return (
    <AdminContext.Provider value={{
      adminLoggedIn, adminLogin, adminLogout, changeAdminCredentials, adminCreds,
      orders, refreshOrders, updateOrderStatus, STATUS_ORDER,
      sellRequests, addSellRequest, updateSellRequest,
      inventory, updateInventoryBook, addInventoryBook, deleteInventoryBook, importCSV, inventoryLoading,
      promoCodes, addPromoCode, updatePromoCode, deletePromoCode,
      deliverySettings, updateDeliverySettings,
    }}>
      {children}
    </AdminContext.Provider>
  );
}

export const useAdmin = () => useContext(AdminContext);
