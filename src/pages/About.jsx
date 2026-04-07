import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Leaf, Users, BookOpen } from 'lucide-react';

const team = [
  { name: 'Arjun Kapoor', role: 'Co-Founder & CEO', emoji: '👨‍💼', color: 'from-blue-400 to-indigo-500', bio: 'IIT Bombay grad. Built PageBack after realising his JEE books were collecting dust.' },
  { name: 'Priya Nair', role: 'Co-Founder & COO', emoji: '👩‍💼', color: 'from-rose-400 to-pink-500', bio: 'XLRI alumna. Obsessed with logistics and making second-hand cool again.' },
  { name: 'Rohan Mehta', role: 'Head of Tech', emoji: '👨‍💻', color: 'from-violet-400 to-purple-500', bio: 'ex-Flipkart engineer. Believes every book deserves a second digital life too.' },
];

const milestones = [
  { year: '2022', label: 'Founded in a Mumbai apartment with 50 books' },
  { year: '2023', label: 'Crossed 1,000 happy customers' },
  { year: '2024', label: 'Expanded to 10 Indian cities' },
  { year: '2025', label: '5,000+ books rehomed. Planet smiling.' },
];

export default function About() {
  return (
    <div className="page-enter pb-20 md:pb-0">
      {/* Hero */}
      <section className="bg-gradient-to-br from-forest-700 to-forest-500 dark:from-forest-900 dark:to-forest-800 py-20 px-4 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <span className="text-5xl block mb-4">📚</span>
          <h1 className="font-display font-bold text-4xl md:text-6xl mb-4">
            Books deserve a <span className="text-amber-400">second life.</span>
          </h1>
          <p className="text-cream-300 text-xl leading-relaxed">
            PageBack was built by book lovers who hated seeing shelves gather dust — and wallets run empty at bookstores. We believe great reads should be affordable, sustainable, and accessible to everyone.
          </p>
        </div>
      </section>

      {/* Mission */}
      <section className="section-pad">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-amber-500 font-semibold text-sm tracking-wide uppercase mb-2">Our Mission</p>
            <h2 className="font-display font-bold text-3xl md:text-4xl text-forest-800 dark:text-cream-100 mb-6">
              Making reading accessible while healing the planet
            </h2>
            <p className="text-forest-600 dark:text-cream-300 text-lg leading-relaxed mb-4">
              Every year, millions of books in India are discarded, donated aimlessly, or left to rot on shelves. That's not just a waste of money — it's a waste of the knowledge, stories, and trees that went into creating them.
            </p>
            <p className="text-forest-600 dark:text-cream-300 leading-relaxed mb-6">
              PageBack is changing that. We buy used books at fair prices, verify their quality, and sell them to readers who need them — at a fraction of the original cost. No peer-to-peer hassle. No quality surprises. Just great books.
            </p>
            <Link to="/sell" className="btn-primary inline-flex items-center gap-2">
              Start Selling <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: BookOpen, val: '10,000+', label: 'Books in Inventory',  color: 'from-forest-400 to-forest-600' },
              { icon: Users,    val: '5,000+',  label: 'Happy Sellers',       color: 'from-amber-400 to-orange-500' },
              { icon: Heart,    val: '12,000+', label: 'Happy Buyers',        color: 'from-rose-400 to-pink-500' },
              { icon: Leaf,     val: '6,000+',  label: 'Trees Saved (est.)',  color: 'from-emerald-400 to-teal-500' },
            ].map((s, i) => (
              <div key={i} className={`bg-gradient-to-br ${s.color} rounded-2xl p-6 text-white flex flex-col gap-2`}>
                <s.icon size={28} className="opacity-80" />
                <p className="font-display font-bold text-3xl">{s.val}</p>
                <p className="text-sm text-white/80">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="bg-cream-50 dark:bg-forest-900/50 py-16 px-4 md:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-amber-500 font-semibold text-sm tracking-wide uppercase mb-2">Our Story</p>
            <h2 className="font-display font-bold text-3xl text-forest-800 dark:text-cream-100">How we got here</h2>
          </div>
          <div className="relative">
            <div className="absolute left-16 top-0 bottom-0 w-0.5 bg-cream-300 dark:bg-forest-700" />
            <div className="space-y-8">
              {milestones.map((m, i) => (
                <div key={i} className="flex gap-6 items-start">
                  <div className="w-32 flex-shrink-0 text-right">
                    <span className="font-display font-bold text-xl text-forest-700 dark:text-cream-200">{m.year}</span>
                  </div>
                  <div className="relative flex-shrink-0 w-4 flex items-center justify-center mt-1">
                    <div className="w-3.5 h-3.5 rounded-full bg-amber-500 border-2 border-white dark:border-forest-900 z-10" />
                  </div>
                  <div className="flex-1 bg-white dark:bg-forest-800 rounded-xl p-4 shadow-sm border border-cream-100 dark:border-forest-700">
                    <p className="text-forest-700 dark:text-cream-200">{m.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="section-pad">
        <div className="text-center mb-10">
          <p className="text-amber-500 font-semibold text-sm tracking-wide uppercase mb-2">The Team</p>
          <h2 className="font-display font-bold text-3xl text-forest-800 dark:text-cream-100">Built by book lovers</h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {team.map((t, i) => (
            <div key={i} className="bg-white dark:bg-forest-800 rounded-2xl overflow-hidden shadow-card border border-cream-100 dark:border-forest-700 text-center">
              <div className={`h-28 bg-gradient-to-br ${t.color} flex items-center justify-center text-5xl`}>{t.emoji}</div>
              <div className="p-5">
                <h3 className="font-display font-bold text-lg text-forest-800 dark:text-cream-100">{t.name}</h3>
                <p className="text-amber-500 text-sm font-medium mb-2">{t.role}</p>
                <p className="text-forest-500 dark:text-cream-400 text-sm leading-relaxed">{t.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-forest-700 dark:bg-forest-900 py-16 px-4 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="font-display font-bold text-3xl md:text-4xl text-white mb-4">Join the PageBack movement</h2>
          <p className="text-cream-300 text-lg mb-8">Buy smarter. Sell easier. Read more. Save the planet.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/buy"  className="btn-amber inline-flex items-center gap-2 text-lg px-8 py-4">Browse Books <ArrowRight size={18} /></Link>
            <Link to="/sell" className="btn-outline border-cream-300 text-cream-200 hover:bg-cream-100 hover:text-forest-800 text-lg px-8 py-4">Sell Your Books</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
