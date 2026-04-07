import { createContext, useContext, useState, useEffect } from 'react';
import { collection, doc, onSnapshot, setDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from './AuthContext';

const AppContext = createContext();

const KARMA_TIERS = [
  { min: 0,  max: 0,  label: 'New Member',    emoji: '✨', color: 'text-gray-500'   },
  { min: 1,  max: 5,  label: 'Seedling',      emoji: '🌱', color: 'text-green-600'  },
  { min: 6,  max: 20, label: 'Reader',        emoji: '📚', color: 'text-blue-600'   },
  { min: 21, max: 50, label: 'Bibliophile',   emoji: '🌳', color: 'text-emerald-600' },
  { min: 51, max: Infinity, label: 'PageBack Legend', emoji: '🏆', color: 'text-amber-500' },
];

export function AppProvider({ children }) {
  const { currentUser } = useAuth();
  
  const [booksSold, setBooksSold] = useState(0);
  const [totalBooksSite, setTotalBooksSite] = useState(5248);
  const [whatsappNumber, setWhatsappNumber] = useState('919999999999');
  
  const [wishlist, setWishlist] = useState([]);
  const [bookRequests, setBookRequests] = useState([]);

  useEffect(() => {
    // Global stats and settings
    const unsubStats = onSnapshot(doc(db, 'app', 'stats'), snap => {
      if (snap.exists()) {
        const data = snap.data();
        if (data.booksSold !== undefined) setBooksSold(data.booksSold);
        if (data.totalBooksSite !== undefined) setTotalBooksSite(data.totalBooksSite);
      }
    });
    
    const unsubAdminSet = onSnapshot(doc(db, 'admin', 'settings'), snap => {
      if (snap.exists() && snap.data().whatsappNumber) {
        setWhatsappNumber(snap.data().whatsappNumber);
      }
    });

    const unsubReqs = onSnapshot(collection(db, 'bookRequests'), snap => {
      setBookRequests(snap.docs.map(d => ({ ...d.data(), id: d.id })));
    });

    return () => { unsubStats(); unsubAdminSet(); unsubReqs(); };
  }, []);

  useEffect(() => {
    if (currentUser) {
      const unsub = onSnapshot(doc(db, 'users', currentUser.id), snap => {
        if (snap.exists() && snap.data().wishlist) {
          setWishlist(snap.data().wishlist);
        } else {
          setWishlist([]);
        }
      });
      return unsub;
    } else {
      setWishlist([]);
    }
  }, [currentUser]);

  const updateWhatsappNumber = async (num) => {
    setWhatsappNumber(num);
    await setDoc(doc(db, 'admin', 'settings'), { whatsappNumber: num }, { merge: true });
  };

  const addBookSold = async (count = 1) => {
    await setDoc(doc(db, 'app', 'stats'), {
      booksSold: booksSold + count,
      totalBooksSite: totalBooksSite + count
    }, { merge: true });
  };

  const getKarmaTier = (sold = booksSold) => {
    return KARMA_TIERS.find(t => sold >= t.min && sold <= t.max) || KARMA_TIERS[0];
  };

  const addToWishlist = async (book) => {
    if (!currentUser) return; // Silent return if guest
    await setDoc(doc(db, 'users', currentUser.id), {
      wishlist: arrayUnion(book)
    }, { merge: true });
  };

  const removeFromWishlist = async (id) => {
    if (!currentUser) return;
    const bookToRemove = wishlist.find(b => b.id === id);
    if (bookToRemove) {
      await setDoc(doc(db, 'users', currentUser.id), {
        wishlist: arrayRemove(bookToRemove)
      }, { merge: true });
    }
  };

  const addBookRequest = async (req) => {
    const newReqId = String(Date.now());
    const newReq = { ...req, id: newReqId, date: new Date().toISOString() };
    await setDoc(doc(db, 'bookRequests', newReqId), newReq);
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
      whatsappNumber, setWhatsappNumber: updateWhatsappNumber,
      totalBooksSite, envImpact
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
