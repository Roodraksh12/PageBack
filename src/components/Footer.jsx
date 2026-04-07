import { useState } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Globe, Mail, Share2, Send, Heart } from 'lucide-react';
import { genres } from '../data/books';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subDone, setSubDone] = useState(false);

  const handleSub = (e) => {
    e.preventDefault();
    if (email) { setSubDone(true); setEmail(''); }
  };

  return (
    <footer className="bg-forest-700 dark:bg-forest-900 text-cream-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center">
                <BookOpen size={20} className="text-white" />
              </div>
              <span className="font-display font-bold text-xl text-white">
                Page<span className="text-amber-400">Back</span>
              </span>
            </Link>
            <p className="text-cream-300 text-sm leading-relaxed mb-6">
              India's trusted used bookstore. Buy affordable reads, sell your old books, and give every book a second life.
            </p>
            <div className="flex gap-3">
              {[Globe, Mail, Share2].map((Icon, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-lg bg-forest-600 hover:bg-amber-500 flex items-center justify-center transition-colors duration-200">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Browse */}
          <div>
            <h3 className="font-display font-semibold text-white mb-4 text-lg">Browse</h3>
            <ul className="space-y-2">
              {genres.map(g => (
                <li key={g.id}>
                  <Link to={`/buy?genre=${g.id}`} className="text-cream-300 hover:text-amber-400 text-sm transition-colors">
                    {g.icon} {g.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-display font-semibold text-white mb-4 text-lg">Company</h3>
            <ul className="space-y-2">
              {[
                { to: '/about',  label: 'About Us'       },
                { to: '/sell',   label: 'Sell Your Books' },
                { to: '/orders', label: 'Track Orders'    },
                { to: '/admin',  label: 'Admin Portal'    },
              ].map(l => (
                <li key={l.to}>
                  <Link to={l.to} className="text-cream-300 hover:text-amber-400 text-sm transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-6">
              <p className="text-cream-400 text-xs mb-1">Support</p>
              <a href="mailto:hello@pageback.in" className="text-cream-300 hover:text-amber-400 text-sm transition-colors">
                hello@pageback.in
              </a>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-display font-semibold text-white mb-4 text-lg">Stay Updated</h3>
            <p className="text-cream-300 text-sm mb-4">New arrivals, deals, and BookKarma perks — straight to your inbox.</p>
            {subDone ? (
              <div className="bg-emerald-500/20 border border-emerald-500/40 rounded-xl p-4 text-center">
                <p className="text-emerald-400 font-medium text-sm">🎉 You're subscribed!</p>
              </div>
            ) : (
              <form onSubmit={handleSub} className="flex flex-col gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@email.com"
                  className="bg-forest-600 border border-forest-500 text-cream-100 placeholder-cream-400 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500/30"
                  required
                />
                <button type="submit" className="btn-amber text-sm py-2.5 flex items-center justify-center gap-2">
                  <Send size={14} /> Subscribe
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-forest-600 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-cream-400">
          <p>© 2025 PageBack. All rights reserved.</p>
          <p className="flex items-center gap-1">Made with <Heart size={12} className="text-amber-400 fill-amber-400" /> in India</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-amber-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-amber-400 transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
