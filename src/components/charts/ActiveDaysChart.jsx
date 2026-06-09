import {
  BarChart,
  Bar,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts'
import { formatPace } from '../../lib/utils'

const ActiveDaysChart = ({ data, variant = 'card' }) => {
  const tickColor = 'rgba(15,23,42,0.6)'
  const axisColor = 'rgba(15,23,42,0.14)'

  const chart = (
    <div className="chart">
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data}>
          <XAxis
            dataKey="label"
            tick={{ fill: tickColor }}
            axisLine={{ stroke: axisColor }}
            tickLine={{ stroke: axisColor }}
          />
          <YAxis tick={{ fill: tickColor }} axisLine={{ stroke: axisColor }} tickLine={{ stroke: axisColor }} />
          <Tooltip
            formatter={(value, key, props) => {
              if (key === 'distanceKm') return [`${value} km`, 'Distance']
              if (key === 'avgPaceMinPerKm') return [formatPace(props?.payload?.avgPaceMinPerKm), 'Avg pace']
              return [value, key]
            }}
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
      <h3>Active days</h3>
      <p className="muted">Only the days you actually ran.</p>
      {chart}
    </div>
  )
}

export default ActiveDaysChart
