import { X } from 'lucide-react';

const conditions = [
  {
    label: 'Like New',
    emoji: '✨',
    color: 'bg-emerald-100 dark:bg-emerald-900/30 border-emerald-300 dark:border-emerald-700',
    textColor: 'text-emerald-700 dark:text-emerald-400',
    payout: '40% of MRP',
    desc: 'No marks, no folds, no highlights. Looks and feels brand new. Original packaging preferred.',
    signs: ['No pencil/pen marks', 'No dog-ears', 'Spine intact + uncracked', 'Cover pristine'],
  },
  {
    label: 'Good',
    emoji: '👍',
    color: 'bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-700',
    textColor: 'text-blue-700 dark:text-blue-400',
    payout: '25% of MRP',
    desc: 'Minor signs of use. A few pencil marks or slight page yellowing, but very readable.',
    signs: ['Light pencil marks ok', 'Minor page yellowing', 'Spine intact', 'Cover in good shape'],
  },
  {
    label: 'Acceptable',
    emoji: '🙂',
    color: 'bg-amber-100 dark:bg-amber-900/30 border-amber-300 dark:border-amber-700',
    textColor: 'text-amber-700 dark:text-amber-400',
    payout: '15% of MRP',
    desc: 'Clearly used. May have pen marks, highlighting, or wear. All text must be readable.',
    signs: ['Pen/highlighter marks ok', 'Dog-ears allowed', 'Cover may be worn', 'No missing pages'],
  },
  {
    label: 'Poor',
    emoji: '😕',
    color: 'bg-red-100 dark:bg-red-900/30 border-red-300 dark:border-red-700',
    textColor: 'text-red-700 dark:text-red-400',
    payout: '5% of MRP',
    desc: 'Heavy wear. Still readable but heavily marked, torn cover, or water damage.',
    signs: ['Heavy highlighting ok', 'Torn cover accepted', 'Loose pages: not ok', 'All text readable'],
  },
];

export default function ConditionGuide({ onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-forest-900/60 backdrop-blur-sm" />
      <div
        className="relative bg-cream-100 dark:bg-forest-800 rounded-2xl shadow-warm-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-fade-in p-6"
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-cream-200 dark:bg-forest-700 flex items-center justify-center hover:bg-cream-300 transition-colors"
        >
          <X size={16} />
        </button>

        <h2 className="font-display font-bold text-2xl text-forest-800 dark:text-cream-100 mb-1">Condition Guide</h2>
        <p className="text-sm text-forest-500 dark:text-cream-400 mb-6">Understand what each condition means and how it affects your payout.</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {conditions.map(c => (
            <div key={c.label} className={`border-2 rounded-xl p-4 ${c.color}`}>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl">{c.emoji}</span>
                <div>
                  <p className={`font-display font-bold text-lg ${c.textColor}`}>{c.label}</p>
                  <p className="text-xs font-semibold text-forest-600 dark:text-cream-400">Payout: {c.payout}</p>
                </div>
              </div>
              <p className="text-sm text-forest-600 dark:text-cream-300 mb-3 leading-relaxed">{c.desc}</p>
              <ul className="space-y-1">
                {c.signs.map((s, i) => (
                  <li key={i} className="text-xs flex items-center gap-1.5 text-forest-600 dark:text-cream-400">
                    <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${c.textColor.replace('text-', 'bg-')}`} />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-forest-400 dark:text-cream-500 mt-6">
          💡 Final payout is confirmed after our quality check at pickup. We guarantee the quoted price.
        </p>
      </div>
    </div>
  );
}
