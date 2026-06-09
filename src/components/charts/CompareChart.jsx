import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts'

const CompareChart = ({ data }) => (
  <div className="card">
    <h3>Runner comparison</h3>
    <div className="chart">
      <ResponsiveContainer width="100%" height={280}>
        <RadarChart data={data}>
          <PolarGrid stroke="rgba(15,23,42,0.14)" />
          <PolarAngleAxis dataKey="metric" tick={{ fill: 'rgba(15,23,42,0.6)', fontSize: 12 }} />
          <PolarRadiusAxis tick={false} axisLine={{ stroke: 'rgba(15,23,42,0.14)' }} />
          <Radar name="You" dataKey="you" stroke="#0f766e" fill="#0f766e" fillOpacity={0.18} />
          <Radar name="Teammate" dataKey="mate" stroke="#2563eb" fill="#2563eb" fillOpacity={0.12} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  </div>
)

export default CompareChart
