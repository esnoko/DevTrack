import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from 'recharts';

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
      <h2 className="text-lg font-semibold text-primary">Role Fit</h2>
      <p className="mt-2 text-sm text-muted">Scores supplied directly by backend insights.</p>

      <div className="mt-4 h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 8, right: 10, left: -12, bottom: 6 }}>
            <CartesianGrid stroke="#e3e6ea" strokeDasharray="3 3" />
            <XAxis dataKey="role" tick={{ fill: '#5d6877', fontSize: 12 }} />
            <YAxis domain={[0, 100]} tick={{ fill: '#5d6877', fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="score" fill="#18202b" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
};

export default RoleFitChart;
