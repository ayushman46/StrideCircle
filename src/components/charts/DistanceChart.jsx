import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts'

const DistanceChart = ({ data, variant = 'card' }) => {
  const chart = (
    <div className="chart">
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data}>
          <XAxis
            dataKey="label"
            tick={{ fill: 'rgba(15,23,42,0.6)' }}
            axisLine={{ stroke: 'rgba(15,23,42,0.14)' }}
            tickLine={{ stroke: 'rgba(15,23,42,0.14)' }}
          />
          <YAxis
            tick={{ fill: 'rgba(15,23,42,0.6)' }}
            axisLine={{ stroke: 'rgba(15,23,42,0.14)' }}
            tickLine={{ stroke: 'rgba(15,23,42,0.14)' }}
          />
          <Tooltip
            contentStyle={{
              background: 'rgba(255,255,255,0.98)',
              border: '1px solid rgba(15,23,42,0.12)',
              borderRadius: 0,
              color: 'rgba(15,23,42,0.92)',
            }}
          />
          <Bar dataKey="distanceKm" fill="#0f766e" radius={[0, 0, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )

  if (variant === 'plain') return chart

  return (
    <div className="card">
      <h3>Weekly distance</h3>
      <p className="muted">Total distance by week.</p>
      {chart}
    </div>
  )
}

export default DistanceChart
