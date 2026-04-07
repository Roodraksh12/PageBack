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
    <div className="bg-white dark:bg-forest-800 rounded-2xl shadow-card border border-cream-100 dark:border-forest-700 overflow-hidden">
      <div className="bg-forest-700 dark:bg-forest-900 px-5 py-3 flex items-center justify-between">
        <div>
          <span className="text-white font-semibold text-sm">{order.id}</span>
          <span className="text-cream-300 text-xs ml-3">{new Date(order.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
        </div>
        <span className="bg-amber-500 text-white text-xs font-semibold px-2.5 py-1 rounded-full capitalize">{order.status}</span>
      </div>

      <div className="p-5">
        {/* Items */}
        <div className="space-y-2 mb-5">
          {order.items.map(item => (
            <div key={item.id} className="flex items-center gap-3">
              <div className={`w-10 h-12 rounded-lg bg-gradient-to-br ${item.coverColor} flex items-center justify-center text-lg flex-shrink-0`}>📖</div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-forest-800 dark:text-cream-100 text-sm truncate">{item.title}</p>
                <p className="text-xs text-forest-400 dark:text-cream-500">{item.author}</p>
              </div>
              <span className="font-bold text-forest-700 dark:text-cream-200 text-sm">₹{item.price}</span>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="flex items-center justify-between py-3 border-y border-cream-100 dark:border-forest-700 mb-5">
          <span className="text-forest-600 dark:text-cream-400 text-sm font-medium">{order.items.length} item{order.items.length > 1 ? 's' : ''}</span>
          <span className="font-display font-bold text-lg text-forest-700 dark:text-cream-100">₹{order.total}</span>
        </div>

        {/* Status stepper */}
        <div className="flex items-center justify-between">
          {STATUS_STEPS.map((s, i) => {
            const Icon = s.icon;
            const done = i <= effectiveIdx;
            const active = i === effectiveIdx;
            return (
              <div key={s.key} className="flex flex-col items-center gap-1 flex-1">
                <div className={`relative w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                  done ? 'bg-emerald-500' : 'bg-cream-200 dark:bg-forest-700'
                } ${active ? 'ring-2 ring-emerald-400 ring-offset-2 ring-offset-white dark:ring-offset-forest-800' : ''}`}>
                  <Icon size={14} className={done ? 'text-white' : 'text-forest-400 dark:text-forest-500'} />
                </div>
                <span className={`text-[10px] font-medium text-center leading-tight ${done ? 'text-emerald-600 dark:text-emerald-400' : 'text-forest-400 dark:text-cream-600'}`}>
                  {s.label}
                </span>
                {i < STATUS_STEPS.length - 1 && (
                  <div className={`absolute h-0.5 w-full top-4 left-1/2 ${done && i < effectiveIdx ? 'bg-emerald-500' : 'bg-cream-200 dark:bg-forest-700'}`} style={{ display: 'none' }} />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function Orders() {
  const { orders } = useCart();

  return (
    <div className="page-enter pb-20 md:pb-0">
      <div className="bg-forest-700 dark:bg-forest-900 py-12 px-4 text-white text-center">
        <h1 className="font-display font-bold text-4xl md:text-5xl mb-2">My Orders</h1>
        <p className="text-cream-300">Track your PageBack purchases</p>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-10">
        {orders.length === 0 ? (
          <div className="text-center py-20">
            <Package size={56} className="mx-auto text-forest-300 dark:text-forest-600 mb-4" />
            <h2 className="font-display text-2xl font-bold text-forest-700 dark:text-cream-200 mb-2">No orders yet</h2>
            <p className="text-forest-400 dark:text-cream-500 mb-6">Your order history will appear here once you make a purchase.</p>
            <Link to="/buy" className="btn-primary inline-flex items-center gap-2">
              <ShoppingBag size={16} /> Browse Books
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="font-display font-bold text-xl text-forest-800 dark:text-cream-100">
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
