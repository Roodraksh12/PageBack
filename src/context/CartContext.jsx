import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem('pb_cart')) || []; }
    catch { return []; }
  });
  const [orders, setOrders] = useState(() => {
    try { return JSON.parse(localStorage.getItem('pb_orders')) || []; }
    catch { return []; }
  });
  const [cartOpen, setCartOpen] = useState(false);
  
  // Promo code state
  const [promoCode, setPromoCode] = useState(null); // { code, discount, type }

  useEffect(() => { localStorage.setItem('pb_cart', JSON.stringify(cartItems)); }, [cartItems]);
  useEffect(() => { localStorage.setItem('pb_orders', JSON.stringify(orders)); }, [orders]);

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

  // Delivery config (syncs with admin, defaulting to something sensible)
  const deliverySettings = (() => {
    try { return JSON.parse(localStorage.getItem('pb_delivery_settings')) || { standardFee: 49, expressFee: 99, freeAbove: 499 }; }
    catch { return { standardFee: 49, expressFee: 99, freeAbove: 499 }; }
  })();

  const deliveryFee = cartTotal >= deliverySettings.freeAbove ? 0 : deliverySettings.standardFee;

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
    const activePromos = (() => {
      try { return JSON.parse(localStorage.getItem('pb_promo_codes')) || []; }
      catch { return []; }
    })();
    
    const p = activePromos.find(x => x.code.toUpperCase() === codeStr.toUpperCase() && x.active);
    if (!p) throw new Error('Invalid or expired promo code');
    if (cartTotal < p.minOrder) throw new Error(`Minimum order of ₹${p.minOrder} required`);
    
    setPromoCode(p);
    return p;
  };

  const removePromo = () => setPromoCode(null);

  const cancelOrder = (orderId) => {
    setOrders(prev => prev.map(order => {
      if (order.id === orderId && ['placed', 'qc'].includes(order.status)) {
        return {
          ...order,
          status: 'cancelled',
          statusHistory: [
            ...order.statusHistory,
            { status: 'cancelled', label: 'Order Cancelled', time: new Date().toISOString() }
          ]
        };
      }
      return order;
    }));
  };

  const placeOrder = (deliveryAddress, paymentMethod) => {
    if (cartItems.length === 0) return null;
    const order = {
      id: `PB${Date.now()}`,
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
    setOrders(prev => [order, ...prev]);
    clearCart();
    setCartOpen(false);
    return order.id;
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
