import { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

const KARMA_TIERS = [
  { min: 0,  max: 0,  label: 'New Member',    emoji: '✨', color: 'text-gray-500'   },
  { min: 1,  max: 5,  label: 'Seedling',      emoji: '🌱', color: 'text-green-600'  },
  { min: 6,  max: 20, label: 'Reader',        emoji: '📚', color: 'text-blue-600'   },
  { min: 21, max: 50, label: 'Bibliophile',   emoji: '🌳', color: 'text-emerald-600' },
  { min: 51, max: Infinity, label: 'PageBack Legend', emoji: '🏆', color: 'text-amber-500' },
];

export function AppProvider({ children }) {
  const [booksSold, setBooksSold] = useState(() => {
    try { return parseInt(localStorage.getItem('pb_sold') || '0', 10); }
    catch { return 0; }
  });
  const [wishlist, setWishlist] = useState(() => {
    try { return JSON.parse(localStorage.getItem('pb_wishlist')) || []; }
    catch { return []; }
  });
  const [bookRequests, setBookRequests] = useState(() => {
    try { return JSON.parse(localStorage.getItem('pb_requests')) || []; }
    catch { return []; }
  });
  const [whatsappNumber, setWhatsappNumber] = useState(() => {
    return localStorage.getItem('pb_wa_number') || '919999999999';
  });
  const [totalBooksSite, setTotalBooksSite] = useState(5248);

  useEffect(() => { localStorage.setItem('pb_sold', booksSold); }, [booksSold]);
  useEffect(() => { localStorage.setItem('pb_wishlist', JSON.stringify(wishlist)); }, [wishlist]);
  useEffect(() => { localStorage.setItem('pb_requests', JSON.stringify(bookRequests)); }, [bookRequests]);
  useEffect(() => { localStorage.setItem('pb_wa_number', whatsappNumber); }, [whatsappNumber]);

  const addBookSold = (count = 1) => {
    setBooksSold(prev => prev + count);
    setTotalBooksSite(prev => prev + count);
  };

  const getKarmaTier = (sold = booksSold) => {
    return KARMA_TIERS.find(t => sold >= t.min && sold <= t.max) || KARMA_TIERS[0];
  };

  const addToWishlist = (book) => {
    setWishlist(prev => prev.find(b => b.id === book.id) ? prev : [...prev, book]);
  };

  const removeFromWishlist = (id) => {
    setWishlist(prev => prev.filter(b => b.id !== id));
  };

  const addBookRequest = (req) => {
    const newReq = { ...req, id: Date.now(), date: new Date().toISOString() };
    setBookRequests(prev => [newReq, ...prev]);
    return newReq;
  };

  // Environmental impact: each used book saves ~0.5 kg paper, ~0.008 trees
  const envImpact = {
    paperKg: (totalBooksSite * 0.5).toFixed(0),
    trees:   (totalBooksSite * 0.008).toFixed(0),
  };

  return (
    <AppContext.Provider value={{
      booksSold, addBookSold, getKarmaTier, KARMA_TIERS,
      wishlist, addToWishlist, removeFromWishlist,
      bookRequests, addBookRequest,
      whatsappNumber, setWhatsappNumber,
      totalBooksSite, envImpact
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
