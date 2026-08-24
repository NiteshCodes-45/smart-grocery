import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export function AreaTrendChart({
  data,
  xAxisKey,
  dataKey,
  color = '#38bdf8',
  gradientColor = '#34d399',
  height = 320,
}) {
  const gradientId = `area-gradient-${dataKey}`;

  return (
    <ResponsiveContainer height={height} width="100%">
      <AreaChart data={data} margin={{ bottom: 0, left: 0, right: 12, top: 16 }}>
        <defs>
          <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.5} />
            <stop offset="95%" stopColor={gradientColor} stopOpacity={0.05} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="rgba(148, 163, 184, 0.16)" strokeDasharray="4 4" />
        <XAxis axisLine={false} dataKey={xAxisKey} tickLine={false} />
        <YAxis axisLine={false} tickLine={false} width={36} />
        <Tooltip
          contentStyle={{
            background: '#111827',
            border: '1px solid rgba(148, 163, 184, 0.24)',
            borderRadius: 8,
          }}
        />
        <Area
          dataKey={dataKey}
          fill={`url(#${gradientId})`}
          stroke={color}
          strokeWidth={3}
          type="monotone"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
