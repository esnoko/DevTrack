import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip
} from 'recharts';
import { motion } from 'framer-motion';

// Color palette for language visualization
const COLORS = [
  '#0070f3',
  '#ff0080',
  '#50e3c2',
  '#f5a623',
  '#bd10e0',
  '#417505',
  '#9013fe',
  '#4a90e2',
  '#f59e0b',
  '#d0021b',
  '#06b6d4',
  '#84cc16',
];

const MAX_DISPLAY = 8;

const LanguageChart = ({ languageBreakdown = [] }) => {
  if (!languageBreakdown || languageBreakdown.length === 0) {
    return (
      <motion.section
        className="card"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
        whileHover={{ y: -2 }}
      >
        <h2 className="text-base font-semibold tracking-tight text-primary">Top Languages</h2>
        <p className="mt-4 text-sm text-muted">No language data available.</p>
      </motion.section>
    );
  }

  const displayed = languageBreakdown.slice(0, MAX_DISPLAY);
  const remaining = languageBreakdown.length - MAX_DISPLAY;

  const chartData = displayed.map((lang) => ({
    name: lang.language,
    value: lang.repositoryCount,
    percentage: lang.percentage
  }));

  const renderTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="rounded-lg border border-gray-200 bg-white p-2.5 text-sm shadow-md">
          <p className="font-semibold text-gray-900">{data.name}</p>
          <p className="text-gray-600">
            {data.value} repo{data.value !== 1 ? 's' : ''} · {data.percentage}%
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <motion.section
      className="card overflow-hidden min-w-0"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -2 }}
    >
      <h2 className="text-base font-semibold tracking-tight text-primary">Top Languages</h2>
      <p className="mt-0.5 text-xs text-muted">Repository language distribution</p>

      {/* Pie chart — no inline labels, no built-in legend (both cause overlap) */}
      <div className="mt-4 h-44 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              outerRadius={72}
              paddingAngle={2}
              dataKey="value"
              isAnimationActive
              animationBegin={120}
              animationDuration={950}
              animationEasing="ease-out"
            >
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={renderTooltip} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Custom legend — never overlaps, truncates long names */}
      <div className="mt-3 space-y-1.5">
        {displayed.map((lang, index) => (
          <motion.div
            key={lang.language}
            className="flex items-center justify-between gap-2 text-sm"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 + index * 0.05, duration: 0.25 }}
          >
            <div className="flex min-w-0 items-center gap-2">
              <div
                className="h-2.5 w-2.5 flex-shrink-0 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="truncate text-primary">{lang.language}</span>
            </div>
            <span className="flex-shrink-0 text-xs text-muted">
              {lang.repositoryCount} · {lang.percentage}%
            </span>
          </motion.div>
        ))}
        {remaining > 0 && (
          <p className="pt-1 text-xs text-muted">+{remaining} more</p>
        )}
      </div>
    </motion.section>
  );
};

export default LanguageChart;
