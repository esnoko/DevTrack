import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

const ROLE_COLORS = {
  Frontend: '#0070f3',
  Backend: '#111827',
  Fullstack: '#6b7280'
};

const mapRoleFitToChartData = (roleFit = {}) => {
  return [
    { role: 'Frontend', score: roleFit.frontend ?? 0 },
    { role: 'Backend', score: roleFit.backend ?? 0 },
    { role: 'Fullstack', score: roleFit.fullstack ?? 0 }
  ];
};

const RoleFitChart = ({ roleFit }) => {
  const chartData = mapRoleFitToChartData(roleFit);

  return (
    <section className="card">
      <h2 className="text-base font-semibold tracking-tight text-primary">Role Fit</h2>
      <p className="mt-0.5 text-xs text-muted">Computed by backend &mdash; scores out of 100</p>

      <div className="mt-5 h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 4, right: 8, left: -16, bottom: 4 }}>
            <CartesianGrid stroke="#e4e7ec" strokeDasharray="4 4" vertical={false} />
            <XAxis dataKey="role" tick={{ fill: '#6b7280', fontSize: 11 }} tickLine={false} axisLine={false} />
            <YAxis domain={[0, 100]} tick={{ fill: '#6b7280', fontSize: 11 }} tickLine={false} axisLine={false} />
            <Tooltip
              contentStyle={{ border: '1px solid #e4e7ec', borderRadius: '0.5rem', fontSize: '0.8125rem' }}
              cursor={{ fill: 'rgba(0,0,0,0.04)' }}
            />
            <Bar dataKey="score" radius={[5, 5, 0, 0]} maxBarSize={56}>
              {chartData.map((entry) => (
                <Cell key={entry.role} fill={ROLE_COLORS[entry.role] ?? '#111827'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};

export default RoleFitChart;
