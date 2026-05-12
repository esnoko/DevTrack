import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

const CommitChart = ({ data = [] }) => {
  return (
    <section className="card overflow-hidden min-w-0">
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
              dot={false}
              activeDot={{ r: 4, fill: '#0070f3', strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};

export default CommitChart;
