import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip
} from 'recharts';

// Color palette for language visualization
const COLORS = [
  '#0070f3', // Blue
  '#ff0080', // Pink
  '#50e3c2', // Teal
  '#f5a623', // Orange
  '#bd10e0', // Purple
  '#417505', // Green
  '#9013fe', // Violet
  '#4a90e2', // Light Blue
  '#f8e71c', // Yellow
  '#d0021b', // Red
];

const LanguageChart = ({ languageBreakdown = [] }) => {
  if (!languageBreakdown || languageBreakdown.length === 0) {
    return (
      <section className="card">
        <h2 className="text-base font-semibold tracking-tight text-primary">Top Languages</h2>
        <p className="mt-4 text-sm text-muted">No language data available.</p>
      </section>
    );
  }

  // Prepare data for pie chart
  const chartData = languageBreakdown.map((lang) => ({
    name: lang.language,
    value: lang.repositoryCount,
    percentage: lang.percentage
  }));

  // Custom label for pie slices
  const renderCustomLabel = ({ percentage }) => {
    if (percentage > 5) {
      return `${percentage}%`;
    }
    return null;
  };

  // Custom tooltip
  const renderTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="rounded-lg border border-gray-200 bg-white p-2.5 text-sm shadow-md">
          <p className="font-semibold text-gray-900">{data.name}</p>
          <p className="text-gray-600">
            {data.value} repo{data.value !== 1 ? 's' : ''} ({data.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <section className="card overflow-hidden min-w-0">
      <h2 className="text-base font-semibold tracking-tight text-primary">Top Languages</h2>
      <p className="mt-0.5 text-xs text-muted">Repository language distribution</p>

      <div className="mt-5 h-52 w-full sm:h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={renderTooltip} />
            <Legend
              verticalAlign="bottom"
              height={36}
              formatter={(value, entry) => `${entry.payload.name} (${entry.payload.value})`}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Language list below chart */}
      <div className="mt-5 space-y-2">
        <h3 className="text-xs font-semibold uppercase tracking-widest text-primary">Breakdown</h3>
        <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
          {chartData.map((lang, index) => (
            <div key={lang.name} className="flex items-center gap-2 text-sm">
              <div
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              ></div>
              <span className="text-primary">{lang.name}</span>
              <span className="text-muted">
                {lang.value} ({lang.percentage}%)
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LanguageChart;
