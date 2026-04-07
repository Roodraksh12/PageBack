// Mock demand logic: genre + month-aware
const getDemand = (genre, demandLevel) => {
  const month = new Date().getMonth(); // 0-indexed

  if (demandLevel === 'high') {
    // Textbooks: peak demand May-August (exam season)
    if (genre === 'Textbook') {
      return month >= 4 && month <= 7
        ? { label: '🔥 Very High Demand', color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800' }
        : { label: '📈 High Demand',      color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800' };
    }
    return { label: '🔥 High Demand', color: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800' };
  }

  if (demandLevel === 'medium') {
    return { label: '📊 Steady Demand', color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800' };
  }

  return { label: '📉 Low Demand', color: 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700' };
};

export default function DemandMeter({ genre, demandLevel }) {
  const demand = getDemand(genre, demandLevel);
  return (
    <span className={`inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full border ${demand.color}`}>
      {demand.label}
    </span>
  );
}
