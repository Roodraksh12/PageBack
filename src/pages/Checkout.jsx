import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { CreditCard, Truck, MapPin, CheckCircle, Package } from 'lucide-react';

export default function Checkout() {
  const { cartItems, cartTotal, promoDiscount, deliveryFee, cartFinalTotal, placeOrder } = useCart();
  const navigate = useNavigate();

  const { currentUser } = useAuth();
  const [form, setForm] = useState(() => {
    if (currentUser) {
      const saved = localStorage.getItem(`pb_user_address_${currentUser.id}`);
      if (saved) {
        try { return JSON.parse(saved); } catch (e) {}
      }
    }
    return {
      fullName: '', phone: '', pinCode: '', city: '', state: '', address: ''
    };
  });
  
  const [paymentMethod, setPaymentMethod] = useState('');

  const indianStates = [
    "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands", "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi", "Lakshadweep", "Puducherry"
  ];

  const fetchPincodeDetails = async (pin) => {
    if (pin.length === 6) {
      try {
        const res = await fetch(`https://api.postalpincode.in/pincode/${pin}`);
        const data = await res.json();
        if (data && data[0].Status === 'Success') {
          const postOffice = data[0].PostOffice[0];
          setForm(prev => ({ ...prev, city: postOffice.District, state: postOffice.State }));
        }
      } catch (err) {
        console.error('Failed to fetch pincode details', err);
      }
    }
  };

  // Redirect if cart is empty
  if (cartItems.length === 0) {
    return (
      <div className="page-enter pb-20 md:pb-0 min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <Package size={56} className="mx-auto text-neutral-300 dark:text-neutral-700 mb-6" />
        <h2 className="font-bold text-2xl uppercase tracking-tighter text-black dark:text-white mb-2">Cart is empty</h2>
        <p className="text-neutral-500 text-xs font-bold uppercase tracking-widest mb-8">Add items to your cart before checking out.</p>
        <button onClick={() => navigate('/buy')} className="border border-black dark:border-white px-8 py-4 text-xs font-bold uppercase tracking-widest transition-colors hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black">
          Browse Books
        </button>
      </div>
    );
  }

  const handlePlaceOrder = (e) => {
    e.preventDefault();
    if (!paymentMethod) {
      alert("Please select a payment method.");
      return;
    }
    const orderId = placeOrder(form, paymentMethod);
    if (orderId) navigate('/orders');
  };

  return (
    <div className="page-enter pb-20 md:pb-0 bg-neutral-50 dark:bg-neutral-900 min-h-screen">
      <div className="bg-forest-900 text-white p-12 text-center">
        <h1 className="font-bold text-5xl md:text-7xl uppercase tracking-tighter mb-4">Checkout</h1>
        <p className="text-cream-400 text-sm font-bold uppercase tracking-widest flex items-center justify-center gap-2">
          <Truck size={16} /> Secure Checkout
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10 lg:py-16">
        <form onSubmit={handlePlaceOrder} className="flex flex-col lg:flex-row gap-8 lg:gap-16">
          
          {/* Left Column: Forms */}
          <div className="flex-1 space-y-10">
            
            {/* Address Section */}
            <section>
              <div className="flex items-center gap-3 mb-6 border-b border-neutral-300 dark:border-neutral-700 pb-4">
                <MapPin className="text-forest-700 dark:text-cream-400" />
                <h2 className="font-bold text-2xl uppercase tracking-tighter text-black dark:text-white">Delivery Address</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-2">Full Name *</label>
                  <input type="text" value={form.fullName} onChange={e => setForm(p => ({ ...p, fullName: e.target.value }))} required
                    className="w-full border border-black dark:border-white px-4 py-3 bg-white dark:bg-black text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-forest-500 text-sm placeholder-neutral-400" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-2">Phone Number *</label>
                  <input type="tel" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} required pattern="[0-9]{10}"
                    className="w-full border border-black dark:border-white px-4 py-3 bg-white dark:bg-black text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-forest-500 text-sm placeholder-neutral-400" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-2">PIN Code *</label>
                  <input type="text" value={form.pinCode} onChange={e => {
                    setForm(p => ({ ...p, pinCode: e.target.value }));
                    if (e.target.value.length === 6) fetchPincodeDetails(e.target.value);
                  }} required pattern="[0-9]{6}" maxLength="6"
                    className="w-full border border-black dark:border-white px-4 py-3 bg-white dark:bg-black text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-forest-500 text-sm placeholder-neutral-400" />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-2">Address (House No, Building, Street) *</label>
                  <textarea value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} required rows="3"
                    className="w-full border border-black dark:border-white px-4 py-3 bg-white dark:bg-black text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-forest-500 text-sm placeholder-neutral-400"></textarea>
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-2">City *</label>
                  <input type="text" value={form.city} onChange={e => setForm(p => ({ ...p, city: e.target.value }))} required
                    className="w-full border border-black dark:border-white px-4 py-3 bg-white dark:bg-black text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-forest-500 text-sm placeholder-neutral-400" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-2">State *</label>
                  <select value={form.state} onChange={e => setForm(p => ({ ...p, state: e.target.value }))} required
                    className="w-full border border-black dark:border-white px-4 py-3 bg-white dark:bg-black text-black dark:text-white focus:outline-none focus:ring-1 focus:ring-forest-500 text-sm placeholder-neutral-400 appearance-none"
                  >
                    <option value="" disabled>Select State</option>
                    {indianStates.map(st => <option key={st} value={st}>{st}</option>)}
                  </select>
                </div>
              </div>
            </section>

            {/* Payment Section */}
            <section>
              <div className="flex items-center gap-3 mb-6 border-b border-neutral-300 dark:border-neutral-700 pb-4">
                <CreditCard className="text-forest-700 dark:text-cream-400" />
                <h2 className="font-bold text-2xl uppercase tracking-tighter text-black dark:text-white">Payment Method</h2>
              </div>

              <div className="space-y-4">
                {[
                  { id: 'Online', title: 'Pay Online', desc: 'UPI, Credit/Debit Card, Netbanking' },
                  { id: 'COD', title: 'Cash on Delivery', desc: 'Pay when your order arrives' }
                ].map(method => (
                  <label 
                    key={method.id} 
                    onClick={() => setPaymentMethod(method.id)}
                    className={`flex items-start gap-4 p-5 border cursor-pointer transition-colors ${
                      paymentMethod === method.id 
                        ? 'border-forest-600 bg-forest-50 dark:bg-forest-900/20' 
                        : 'border-neutral-300 dark:border-neutral-700 bg-white dark:bg-black hover:border-forest-400'
                    }`}
                  >
                    <div className="mt-0.5">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        paymentMethod === method.id ? 'border-forest-600' : 'border-neutral-400'
                      }`}>
                        {paymentMethod === method.id && <div className="w-2.5 h-2.5 rounded-full bg-forest-600" />}
                      </div>
                    </div>
                    <div>
                      <p className="font-bold uppercase tracking-widest text-sm text-black dark:text-white">{method.title}</p>
                      <p className="text-xs text-neutral-500 mt-1">{method.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:w-96">
            <div className="bg-white dark:bg-black border border-black dark:border-white p-8 sticky top-24">
              <h3 className="font-bold text-xl uppercase tracking-tighter text-black dark:text-white mb-6">Order Summary</h3>
              
              <div className="space-y-4 mb-6">
                {cartItems.map(item => (
                  <div key={item.id} className="flex justify-between items-start text-sm">
                    <div className="flex-1 pr-4">
                      <span className="font-bold uppercase tracking-tight line-clamp-1">{item.title}</span>
                      <span className="text-neutral-500 text-[10px] uppercase font-bold tracking-widest block mt-1">Qty: {item.qty}</span>
                    </div>
                    <span className="font-medium whitespace-nowrap">₹{item.price * item.qty}</span>
                  </div>
                ))}
              </div>

              <div className="h-px bg-neutral-200 dark:bg-neutral-800 my-6" />

              <div className="space-y-3 text-xs font-bold uppercase tracking-widest text-neutral-500">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="text-black dark:text-white">₹{cartTotal}</span>
                </div>
                {promoDiscount > 0 && (
                  <div className="flex justify-between text-forest-600 dark:text-forest-400">
                    <span>Discount</span>
                    <span>-₹{promoDiscount}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery ({deliveryFee === 0 ? 'Free' : 'Standard'})</span>
                  <span className="text-black dark:text-white">{deliveryFee === 0 ? '₹0' : `₹${deliveryFee}`}</span>
                </div>
              </div>

              <div className="h-px bg-neutral-200 dark:bg-neutral-800 my-6" />

              <div className="flex items-center justify-between font-bold text-3xl uppercase tracking-tighter text-black dark:text-white mb-8">
                <span>Total</span>
                <span>₹{cartFinalTotal}</span>
              </div>

              <button type="submit" className="w-full bg-forest-800 text-cream-100 hover:bg-forest-900 transition-colors uppercase font-bold tracking-widest text-xs py-5 flex items-center justify-center gap-2">
                Place Order <CheckCircle size={16} />
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
