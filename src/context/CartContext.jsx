import { createContext, useContext, useState, useEffect } from 'react';
import { collection, doc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('pb_cart')) || []; }
    catch { return []; }
  });
  const [orders, setOrders] = useState([]);
  const [activePromos, setActivePromos] = useState([]);
  const [deliverySettings, setDeliverySettings] = useState({ standardFee: 49, expressFee: 99, freeAbove: 499 });
  const [cartOpen, setCartOpen] = useState(false);
  const [promoCode, setPromoCode] = useState(null);

  useEffect(() => { localStorage.setItem('pb_cart', JSON.stringify(cartItems)); }, [cartItems]);

  useEffect(() => {
    const unsubOrders = onSnapshot(collection(db, 'orders'), snap => setOrders(snap.docs.map(d => ({ ...d.data(), id: d.id })).sort((a,b) => new Date(b.date) - new Date(a.date))));
    const unsubPromos = onSnapshot(collection(db, 'promos'), snap => setActivePromos(snap.docs.map(d => ({ ...d.data(), id: d.id }))));
    const unsubSettings = onSnapshot(doc(db, 'admin', 'settings'), docSnap => {
      if (docSnap.exists() && docSnap.data().delivery) setDeliverySettings(docSnap.data().delivery);
    });
    return () => { unsubOrders(); unsubPromos(); unsubSettings(); };
  }, []);

  const addToCart = (book) => {
    setCartItems(prev => {
      if (prev.find(i => i.id === book.id)) return prev;
      return [...prev, { ...book, qty: 1 }];
    });
    setCartOpen(true);
  };

  const removeFromCart = (id) => setCartItems(prev => prev.filter(i => i.id !== id));
  
  const clearCart = () => {
    setCartItems([]);
    setPromoCode(null);
  };

  const cartTotal = cartItems.reduce((sum, i) => sum + i.price * i.qty, 0);
  const cartCount = cartItems.length;

  const deliveryFee = cartTotal >= deliverySettings.freeAbove ? 0 : Number(deliverySettings.standardFee);

  // Calculate discount
  let promoDiscount = 0;
  if (promoCode) {
    if (promoCode.type === 'percent') {
      promoDiscount = Math.round((cartTotal * promoCode.discount) / 100);
    } else {
      promoDiscount = promoCode.discount;
    }
  }

  // Ensure discount doesn't exceed total (excluding delivery)
  if (promoDiscount > cartTotal) promoDiscount = cartTotal;

  const cartFinalTotal = cartTotal - promoDiscount + deliveryFee;

  const applyPromo = (codeStr) => {
    const p = activePromos.find(x => x.code.toUpperCase() === codeStr.toUpperCase() && x.active);
    if (!p) throw new Error('Invalid or expired promo code');
    if (cartTotal < p.minOrder) throw new Error(`Minimum order of ₹${p.minOrder} required`);
    
    setPromoCode(p);
    return p;
  };

  const removePromo = () => setPromoCode(null);

  const cancelOrder = async (orderId) => {
    const order = orders.find(o => o.id === orderId);
    if (order && ['placed', 'qc'].includes(order.status)) {
      await updateDoc(doc(db, 'orders', String(orderId)), {
        status: 'cancelled',
        statusHistory: [
          ...(order.statusHistory || []),
          { status: 'cancelled', label: 'Order Cancelled', time: new Date().toISOString() }
        ]
      });
    }
  };

  const placeOrder = async (deliveryAddress, paymentMethod) => {
    if (cartItems.length === 0) return null;
    const orderId = `PB${Date.now()}`;
    const order = {
      items: cartItems,
      subtotal: cartTotal,
      discount: promoDiscount,
      promoCode: promoCode ? promoCode.code : null,
      deliveryFee,
      total: cartFinalTotal,
      status: 'placed',
      date: new Date().toISOString(),
      deliveryAddress,
      paymentMethod,
      statusHistory: [
        { status: 'placed', label: 'Order Placed', time: new Date().toISOString() }
      ]
    };
    try {
      await setDoc(doc(db, 'orders', orderId), order);
      clearCart();
      setCartOpen(false);
      return orderId;
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order: " + error.message);
      return null;
    }
  };

  return (
    <CartContext.Provider value={{
      cartItems, addToCart, removeFromCart, clearCart,
      cartTotal, cartCount, cartOpen, setCartOpen,
      promoCode, promoDiscount, cartFinalTotal, applyPromo, removePromo, deliveryFee, deliverySettings,
      orders, placeOrder, cancelOrder
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
