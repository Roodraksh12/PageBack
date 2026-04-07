import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { CartProvider } from './context/CartContext';
import { AppProvider } from './context/AppContext';
import Navbar from './components/Navbar';
import MobileNav from './components/MobileNav';
import Footer from './components/Footer';
import CartSidebar from './components/CartSidebar';
import Home from './pages/Home';
import Buy from './pages/Buy';
import Sell from './pages/Sell';
import Orders from './pages/Orders';
import About from './pages/About';
import Admin from './pages/Admin';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function AppLayout() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main className="min-h-screen">
        <Routes>
          <Route path="/"       element={<Home />}   />
          <Route path="/buy"    element={<Buy />}    />
          <Route path="/sell"   element={<Sell />}   />
          <Route path="/orders" element={<Orders />} />
          <Route path="/about"  element={<About />}  />
          <Route path="/admin"  element={<Admin />}  />
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
        <CartProvider>
          <BrowserRouter>
            <AppLayout />
          </BrowserRouter>
        </CartProvider>
      </AppProvider>
    </ThemeProvider>
  );
}
