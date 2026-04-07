import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { CartProvider } from './context/CartContext';
import { AppProvider } from './context/AppContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AdminProvider } from './context/AdminContext';
import Navbar from './components/Navbar';
import MobileNav from './components/MobileNav';
import Footer from './components/Footer';
import CartSidebar from './components/CartSidebar';
import AuthModal from './components/AuthModal';
import Home from './pages/Home';
import Buy from './pages/Buy';
import Sell from './pages/Sell';
import Checkout from './pages/Checkout';
import Orders from './pages/Orders';
import About from './pages/About';
import AdminPortal from './pages/AdminPortal';
import BookDetail from './pages/BookDetail';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

// Wrapper for auth-protected routes
function ProtectedRoute({ children }) {
  const { isLoggedIn } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  
  // If not logged in, show auth modal but don't kick them out of the route entirely
  // instead we show a placeholder or let the component handle the auth modal trigger
  if (!isLoggedIn) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <div className="w-16 h-16 bg-cream-200 dark:bg-forest-800 rounded-full flex items-center justify-center mb-4 text-2xl">🔒</div>
        <h2 className="font-display font-bold text-2xl text-forest-800 dark:text-cream-100 mb-2">Login Required</h2>
        <p className="text-forest-500 dark:text-cream-400 mb-6 max-w-md">
          You need an account to access this page. Sign up or log in to continue.
        </p>
        <button onClick={() => setShowAuth(true)} className="btn-primary">
          Log In / Sign Up
        </button>
        {showAuth && <AuthModal isOpen={true} onClose={() => setShowAuth(false)} mode="login" />}
      </div>
    );
  }
  
  return children;
}

function MainLayout() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        <Routes>
          <Route path="/"       element={<Home />}   />
          <Route path="/buy"    element={<Buy />}    />
          <Route path="/book/:id" element={<BookDetail />} />
          <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
          <Route path="/sell"   element={<ProtectedRoute><Sell /></ProtectedRoute>}   />
          <Route path="/orders" element={<ProtectedRoute><Orders /></ProtectedRoute>} />
          <Route path="/about"  element={<About />}  />
        </Routes>
      </main>
      <Footer />
      <MobileNav />
      <CartSidebar />
    </>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <AuthProvider>
          <AdminProvider>
            <CartProvider>
              <BrowserRouter>
                <ScrollToTop />
                <Routes>
                  {/* Completely isolated admin route */}
                  <Route path="/admin-portal/*" element={<AdminPortal />} />
                  
                  {/* Redirect the old admin route */}
                  <Route path="/admin" element={<Navigate to="/admin-portal" replace />} />
                  
                  {/* Main site layout handles everything else */}
                  <Route path="/*" element={<MainLayout />} />
                </Routes>
              </BrowserRouter>
            </CartProvider>
          </AdminProvider>
        </AuthProvider>
      </AppProvider>
    </ThemeProvider>
  );
}
