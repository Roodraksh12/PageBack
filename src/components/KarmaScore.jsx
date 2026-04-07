import { useApp } from '../context/AppContext';

export default function KarmaScore({ sold, large = false }) {
  const { getKarmaTier } = useApp();
  const tier = getKarmaTier(sold);

  if (large) {
    return (
      <div className="flex flex-col items-center text-center">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-forest-600 to-forest-400 flex flex-col items-center justify-center shadow-warm-lg mb-3 border-4 border-amber-400">
          <span className="text-3xl">{tier.emoji}</span>
          <span className="text-white font-bold text-xs mt-0.5">{sold} books</span>
        </div>
        <p className="font-display font-bold text-2xl text-forest-800 dark:text-cream-100">{tier.label}</p>
        <p className="text-sm text-forest-500 dark:text-cream-400 mt-1">Your Book Karma Tier</p>
        {sold < 50 && (
          <p className="text-xs text-amber-500 mt-2 font-medium">
            {sold < 5 ? `${5 - sold} more books to reach Reader 📚` :
             sold < 20 ? `${20 - sold} more books to reach Bibliophile 🌳` :
             sold < 50 ? `${50 - sold} more books to reach Legend 🏆` : ''}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2 bg-forest-700/10 dark:bg-forest-600/20 border border-forest-200 dark:border-forest-600 rounded-full px-3 py-1.5">
      <span className="text-lg">{tier.emoji}</span>
      <div>
        <p className="text-xs font-bold text-forest-700 dark:text-cream-200">{tier.label}</p>
        <p className="text-[10px] text-forest-400 dark:text-cream-500">{sold} books sold</p>
      </div>
    </div>
  );
}
