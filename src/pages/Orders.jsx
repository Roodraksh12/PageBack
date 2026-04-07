import { useCart } from '../context/CartContext';
import { Package, CheckCircle, Truck, Home, Clock, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

const STATUS_STEPS = [
  { key: 'placed',    label: 'Order Placed',  icon: ShoppingBag },
  { key: 'qc',        label: 'Quality Check', icon: CheckCircle },
  { key: 'shipped',   label: 'Shipped',        icon: Truck       },
  { key: 'delivered', label: 'Delivered',      icon: Home        },
];

function OrderCard({ order }) {
  const currentIdx = STATUS_STEPS.findIndex(s => s.key === order.status);
  const effectiveIdx = currentIdx === -1 ? 0 : currentIdx;

  return (
    <div className="bg-white dark:bg-black border border-black dark:border-white overflow-hidden">
      <div className="bg-black text-white dark:bg-white dark:text-black px-6 py-4 flex items-center justify-between">
        <div>
          <span className="font-bold text-xs uppercase tracking-widest">{order.id}</span>
          <span className="text-neutral-400 dark:text-neutral-500 text-[10px] font-bold uppercase tracking-widest ml-4">{new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
        </div>
        <span className="border border-current px-3 py-1 text-[10px] uppercase font-bold tracking-widest">{order.status}</span>
      </div>

      <div className="p-6">
        {/* Items */}
        <div className="space-y-4 mb-6">
          {order.items.map(item => (
            <div key={item.id} className="flex items-center gap-4">
              <div className="w-12 h-16 bg-neutral-100 dark:bg-neutral-900 border border-black dark:border-white flex items-center justify-center flex-shrink-0">
                <span className="text-[10px] uppercase font-bold text-neutral-400">Img</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold uppercase tracking-tight text-black dark:text-white truncate">{item.title}</p>
                <p className="text-[10px] uppercase font-bold tracking-widest text-neutral-500 mt-1">{item.author}</p>
              </div>
              <span className="font-bold text-lg text-black dark:text-white">₹{item.price}</span>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="flex items-center justify-between py-4 border-t border-b border-black dark:border-neutral-800 mb-6">
          <span className="text-xs uppercase font-bold tracking-widest text-neutral-500">{order.items.length} item{order.items.length > 1 ? 's' : ''}</span>
          <span className="font-bold text-xl uppercase tracking-tighter text-black dark:text-white">₹{order.total}</span>
        </div>

        {/* Status stepper */}
        <div className="flex items-center justify-between pt-2">
          {STATUS_STEPS.map((s, i) => {
            const Icon = s.icon;
            const done = i <= effectiveIdx;
            const active = i === effectiveIdx;
            return (
              <div key={s.key} className="flex flex-col items-center gap-3 flex-1 relative">
                <div className={`w-8 h-8 flex items-center justify-center border transition-colors z-10 bg-white dark:bg-black ${
                  done ? 'border-black dark:border-white text-black dark:text-white' : 'border-neutral-300 dark:border-neutral-700 text-neutral-300 dark:text-neutral-700'
                } ${active ? 'bg-black text-white dark:bg-white dark:text-black' : ''}`}>
                  <Icon size={14} className="opacity-100" />
                </div>
                <span className={`text-[9px] uppercase tracking-widest font-bold text-center ${done ? 'text-black dark:text-white' : 'text-neutral-400'}`}>
                  {s.label}
                </span>
                {i < STATUS_STEPS.length - 1 && (
                  <div className={`absolute h-px w-full top-4 left-1/2 ${done && i < effectiveIdx ? 'bg-black dark:bg-white' : 'bg-neutral-300 dark:bg-neutral-700'}`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Checkout Info */}
        {order.deliveryAddress && (
          <div className="mt-8 pt-6 border-t border-neutral-200 dark:border-neutral-800 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-neutral-500 mb-2">Delivery Address</p>
              <p className="text-sm text-black dark:text-white leading-relaxed">
                <span className="font-bold">{order.deliveryAddress.fullName}</span><br/>
                {order.deliveryAddress.address}<br/>
                {order.deliveryAddress.city}, {order.deliveryAddress.state} - {order.deliveryAddress.pinCode}<br/>
                Phone: {order.deliveryAddress.phone}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold tracking-widest text-neutral-500 mb-2">Payment Method</p>
              <p className="text-sm font-bold text-black dark:text-white">
                {order.paymentMethod === 'Online' ? 'Prepaid (Online)' : 'Cash on Delivery'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Orders() {
  const { orders } = useCart();

  return (
    <div className="page-enter pb-20 md:pb-0">
      <div className="bg-black text-white p-12 border-b border-black text-center">
        <h1 className="font-bold text-5xl md:text-7xl uppercase tracking-tighter mb-4">My Orders</h1>
        <p className="text-neutral-400 text-sm font-bold uppercase tracking-widest">Track your PageBack purchases</p>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10">
        {orders.length === 0 ? (
          <div className="text-center py-20 border border-black dark:border-white p-8">
            <Package size={56} className="mx-auto text-neutral-300 dark:text-neutral-700 mb-6" />
            <h2 className="text-2xl font-bold uppercase tracking-tighter text-black dark:text-white mb-2">No orders yet</h2>
            <p className="text-neutral-500 text-xs font-bold uppercase tracking-widest mb-8">Your order history will appear here once you make a purchase.</p>
            <Link to="/buy" className="border border-black dark:border-white px-8 py-4 text-xs font-bold uppercase tracking-widest transition-colors hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black inline-flex items-center gap-2">
              <ShoppingBag size={16} /> Browse Books
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-black dark:border-white pb-4 mb-6">
              <h2 className="font-bold text-2xl uppercase tracking-tighter text-black dark:text-white">
                {orders.length} Order{orders.length > 1 ? 's' : ''}
              </h2>
            </div>
            {orders.map(o => <OrderCard key={o.id} order={o} />)}
          </div>
        )}
      </div>
    </div>
  );
}
