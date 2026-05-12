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
    <section className="card">
      <h2 className="text-lg font-semibold text-primary">Commit Activity</h2>
      <p className="mt-2 text-sm text-muted">Last 12 weeks from backend analytics.</p>

      <div className="mt-4 h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 8, right: 10, left: -12, bottom: 6 }}>
            <CartesianGrid stroke="#e3e6ea" strokeDasharray="3 3" />
            <XAxis dataKey="week" tick={{ fill: '#5d6877', fontSize: 12 }} />
            <YAxis allowDecimals={false} tick={{ fill: '#5d6877', fontSize: 12 }} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="commits"
              stroke="#18202b"
              strokeWidth={2}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};

export default CommitChart;
