import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export function FeatureUsageBarChart({ data, height = 320 }) {
  return (
    <ResponsiveContainer height={height} width="100%">
      <BarChart data={data} margin={{ bottom: 0, left: 0, right: 12, top: 16 }}>
        <CartesianGrid stroke="rgba(148, 163, 184, 0.16)" strokeDasharray="4 4" />
        <XAxis axisLine={false} dataKey="feature" tickLine={false} />
        <YAxis axisLine={false} tickLine={false} width={36} />
        <Tooltip
          contentStyle={{
            background: '#111827',
            border: '1px solid rgba(148, 163, 184, 0.24)',
            borderRadius: 8,
          }}
        />
        <Bar dataKey="usage" fill="#34d399" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
