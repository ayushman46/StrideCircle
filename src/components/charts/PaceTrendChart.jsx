import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts'
import { formatPace } from '../../lib/utils'

const PaceTrendChart = ({ data, variant = 'card' }) => {
  const chart = (
    <div className="chart">
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={data}>
          <XAxis
            dataKey="label"
            tick={{ fill: 'rgba(15,23,42,0.6)' }}
            axisLine={{ stroke: 'rgba(15,23,42,0.14)' }}
            tickLine={{ stroke: 'rgba(15,23,42,0.14)' }}
          />
          <YAxis
            tickFormatter={(value) => (Number.isFinite(value) ? formatPace(value).replace(' /km', '') : 'Not available')}
            tick={{ fill: 'rgba(15,23,42,0.6)' }}
            axisLine={{ stroke: 'rgba(15,23,42,0.14)' }}
            tickLine={{ stroke: 'rgba(15,23,42,0.14)' }}
          />
          <Tooltip
            formatter={(value) => (Number.isFinite(value) ? formatPace(value) : 'Not available')}
            labelFormatter={(label) => `Week of ${label}`}
            contentStyle={{
              background: 'rgba(255,255,255,0.98)',
              border: '1px solid rgba(15,23,42,0.12)',
              borderRadius: 0,
              color: 'rgba(15,23,42,0.92)',
            }}
          />
          <Line type="monotone" dataKey="avgPaceMinPerKm" stroke="#0f766e" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )

  if (variant === 'plain') return chart

  return (
    <div className="card">
      <h3>Pace trend</h3>
      <p className="muted">Distance-weighted avg pace by week.</p>
      {chart}
    </div>
  )
}

export default PaceTrendChart
