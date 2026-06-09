import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts'
import { formatPace } from '../../lib/utils'

const mergeSeries = (paceSeries, hrSeries) => {
  const hrByT = new Map((hrSeries ?? []).map((point) => [point.t, point.hr]))
  return (paceSeries ?? []).map((point) => ({
    t: point.t,
    pace: point.pace,
    hr: hrByT.get(point.t) ?? null,
  }))
}

const RunDNAChart = ({ pace = [], hr = [] }) => {
  const data = mergeSeries(pace, hr)
  const tickColor = 'rgba(15,23,42,0.6)'
  const axisColor = 'rgba(15,23,42,0.14)'

  return (
    <div className="chart chart-tall">
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data}>
          <XAxis
            dataKey="t"
            tickFormatter={(value) => `${Math.round(value / 60)}m`}
            minTickGap={24}
            tick={{ fill: tickColor }}
            axisLine={{ stroke: axisColor }}
            tickLine={{ stroke: axisColor }}
          />
          <YAxis
            yAxisId="pace"
            domain={['auto', 'auto']}
            tickFormatter={(value) => formatPace(value).replace(' /km', '')}
            tick={{ fill: tickColor }}
            axisLine={{ stroke: axisColor }}
            tickLine={{ stroke: axisColor }}
          />
          <YAxis
            yAxisId="hr"
            orientation="right"
            domain={['auto', 'auto']}
            tick={{ fill: tickColor }}
            axisLine={{ stroke: axisColor }}
            tickLine={{ stroke: axisColor }}
          />
          <Tooltip
            formatter={(value, key) => {
              if (key === 'pace') return [formatPace(value), 'Pace']
              if (key === 'hr') return [`${value} bpm`, 'HR']
              return [value, key]
            }}
            labelFormatter={(value) => `t=${Math.round(value / 60)} min`}
            contentStyle={{
              background: 'rgba(255,255,255,0.98)',
              border: '1px solid rgba(15,23,42,0.12)',
              borderRadius: 0,
              color: 'rgba(15,23,42,0.92)',
            }}
          />
          <Line yAxisId="pace" type="monotone" dataKey="pace" stroke="#0f766e" strokeWidth={2} dot={false} />
          <Line yAxisId="hr" type="monotone" dataKey="hr" stroke="#2563eb" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default RunDNAChart
