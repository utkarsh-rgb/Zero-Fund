interface QuickStatsProps {
  stats: any;
  statsLoading: boolean;
}

export default function QuickStats({ stats, statsLoading }: QuickStatsProps) {
  return (
    <div className="mt-6 bg-white rounded-lg shadow-sm p-4">
      <h3 className="text-sm font-semibold text-gray-800 mb-3">Quick Stats</h3>

      {statsLoading ? (
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-5 bg-gray-200 rounded" />
          ))}
        </div>
      ) : stats ? (
        <div className="space-y-3">
          {[
            {
              label: "Pending Proposals",
              value: stats.proposals?.pending ?? 0,
              color: "text-orange-600",
            },
            {
              label: "Active Ideas",
              value: stats.ideas?.active ?? 0,
              color: "text-green-600",
            },
            {
              label: "Total Views",
              value: stats.activity?.totalViews ?? 0,
              color: "text-purple-600",
            },
            {
              label: "Review Rate",
              value: `${stats.performance?.reviewRate ?? 0}%`,
              color: "text-skyblue",
            },
            {
              label: "Equity Offered",
              value: `${stats.equity?.totalOffered ?? 0}%`,
              color: "text-blue-600",
            },
            {
              label: "Hiring Rate",
              value: `${stats.performance?.hiringRate ?? 0}%`,
              color: "text-green-600",
            },
          ].map(({ label, value, color }) => (
            <div key={label} className="flex justify-between">
              <span className="text-sm text-gray-600">{label}</span>
              <span className={`text-sm font-semibold ${color}`}>{value}</span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-sm text-gray-500">No stats available</div>
      )}
    </div>
  );
}
