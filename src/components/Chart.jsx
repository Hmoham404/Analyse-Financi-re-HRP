import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

function Chart({ data, title }) {
  if (!data) return null;

  // Assuming data is correlation object, convert to array
  const chartData = Object.entries(data).map(([asset, values]) => ({
    asset,
    ...values
  }));

  return (
    <div className="rounded-2xl bg-slate-950/50 p-4">
      <h3 className="text-sm font-medium text-cyan-200 mb-2">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis dataKey="asset" stroke="#cbd5e1" />
          <YAxis stroke="#cbd5e1" />
          <Tooltip
            contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
            labelStyle={{ color: '#cbd5e1' }}
          />
          {Object.keys(chartData[0] || {}).filter(key => key !== 'asset').map((key, index) => (
            <Bar key={key} dataKey={key} fill={`hsl(${index * 60}, 70%, 50%)`} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default Chart;