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

  useEffect(() => {
    localStorage.setItem('pb_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('pb_orders', JSON.stringify(orders));
  }, [orders]);

  const addToCart = (book) => {
    setCartItems(prev => {
      const exists = prev.find(i => i.id === book.id);
      if (exists) return prev;
      return [...prev, { ...book, qty: 1 }];
    });
    setCartOpen(true);
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(i => i.id !== id));
  };

  const clearCart = () => setCartItems([]);

  const cartTotal = cartItems.reduce((sum, i) => sum + i.price * i.qty, 0);
  const cartCount = cartItems.length;

  const placeOrder = () => {
    if (cartItems.length === 0) return;
    const order = {
      id: `PB${Date.now()}`,
      items: cartItems,
      total: cartTotal,
      status: 'placed',
      date: new Date().toISOString(),
      statusHistory: [
        { status: 'placed',    label: 'Order Placed',      time: new Date().toISOString() }
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
      orders, placeOrder
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
