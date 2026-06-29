import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';
import { motion } from 'framer-motion';

const CommitChart = ({ data = [] }) => {
  return (
    <motion.section
      className="card overflow-hidden min-w-0"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -2 }}
    >
      <h2 className="text-base font-semibold tracking-tight text-primary">Commit Activity</h2>
      <p className="mt-0.5 text-xs text-muted">Weekly commits &mdash; last 12 weeks</p>

      <div className="mt-5 h-52 w-full sm:h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 4, right: 8, left: -16, bottom: 4 }}>
            <CartesianGrid stroke="#e4e7ec" strokeDasharray="4 4" />
            <XAxis dataKey="week" tick={{ fill: '#6b7280', fontSize: 11 }} tickLine={false} axisLine={false} />
            <YAxis allowDecimals={false} tick={{ fill: '#6b7280', fontSize: 11 }} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{ border: '1px solid #e4e7ec', borderRadius: '0.5rem', fontSize: '0.8125rem' }}
              cursor={{ stroke: '#e4e7ec' }}
            />
            <Line
              type="monotone"
              dataKey="commits"
              stroke="#0070f3"
              strokeWidth={2}
              isAnimationActive
              animationDuration={950}
              animationEasing="ease-out"
              dot={false}
              activeDot={{ r: 4, fill: '#0070f3', strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </motion.section>
  );
};

export default CommitChart;
