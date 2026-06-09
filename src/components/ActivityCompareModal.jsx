import { formatDate, formatPace, metersToKm, secondsToHms } from '../lib/utils'
import ActivityCompareRadar from './charts/ActivityCompareRadar'

const MetricRow = ({ label, values, unit = '', highlight = false }) => (
  <div className={`compare-row${highlight ? ' compare-row-highlight' : ''}`}>
    <div className="compare-metric">{label}</div>
    {values.map((value, index) => (
      <div key={`${label}-${index}`} className="compare-value">
        {value}
        {unit && value !== 'Not available' ? ` ${unit}` : ''}
      </div>
    ))}
  </div>
)

const getWinner = (values, { lowerIsBetter = false } = {}) => {
  const nums = values.map((value) => (typeof value === 'number' && Number.isFinite(value) ? value : null))
  const valid = nums.filter((value) => value !== null)
  if (valid.length < 2) return null
  const best = lowerIsBetter ? Math.min(...valid) : Math.max(...valid)
  return nums.indexOf(best)
}

const humanizeKey = (key) =>
  key
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase())

const formatValue = (key, value) => {
  if (value === null || value === undefined || value === '') return 'Not available'
  if (typeof value === 'boolean') return value ? 'Yes' : 'No'

  if (typeof value === 'number' && Number.isFinite(value)) {
    if (/distance_m$/i.test(key)) return `${metersToKm(value)} km`
    if (/pace$/i.test(key)) return formatPace(value)
    if (/time_sec$/i.test(key) || /_time$/i.test(key)) return secondsToHms(value) ?? 'Not available'
    if (/elevation/i.test(key)) return `${Math.round(value)} m`
    if (/speed/i.test(key)) return `${(value * 3.6).toFixed(1)} km/h`
    if (/heartrate/i.test(key) || /heart_rate/i.test(key)) return `${Math.round(value)} bpm`
    if (/points/i.test(key) || /kudos/i.test(key) || /achievement/i.test(key) || /count$/i.test(key)) {
      return `${Math.round(value)}`
    }
    if (/calorie/i.test(key)) return `${Math.round(value)} kcal`
    if (/weight/i.test(key)) return `${value} kg`
    return Number.isInteger(value) ? value.toString() : value.toFixed(2)
  }

  if (typeof value === 'string') {
    if (/date|created|updated|started|start_/i.test(key)) {
      const parsed = new Date(value)
      if (!Number.isNaN(parsed.getTime())) return formatDate(value)
    }
    return value
  }

  return String(value)
}

const collectFieldKeys = (activities) => {
  const keys = new Set()
  activities.forEach((activity) => {
    Object.entries(activity || {}).forEach(([key, value]) => {
      if (value === null || value === undefined) return
      if (typeof value === 'object') return
      keys.add(key)
    })
  })
  return Array.from(keys).sort((left, right) => left.localeCompare(right))
}

const computeAIScore = (activities) => {
  const scores = activities.map(() => ({ positives: [], score: 0 }))
  const checks = [
    {
      key: 'distance_m',
      label: 'Longer distance',
      lowerIsBetter: false,
      format: (value) => `${metersToKm(value)} km`,
    },
    {
      key: 'pace',
      label: 'Faster pace',
      lowerIsBetter: true,
      format: (value) => formatPace(value),
    },
    {
      key: 'total_elevation_gain',
      label: 'More elevation gain',
      lowerIsBetter: false,
      format: (value) => `${Math.round(value)} m`,
    },
    {
      key: 'total_points',
      label: 'Higher points scored',
      lowerIsBetter: false,
      format: (value) => `${Math.round(value)} pts`,
    },
    {
      key: 'elapsed_time_sec',
      label: 'Longer elapsed duration',
      lowerIsBetter: false,
      format: (value) => secondsToHms(value),
    },
    {
      key: 'kudos_count',
      label: 'More kudos received',
      lowerIsBetter: false,
      format: (value) => `${value} kudos`,
    },
    {
      key: 'achievement_count',
      label: 'More achievements unlocked',
      lowerIsBetter: false,
      format: (value) => `${value} achievements`,
    },
    {
      key: 'average_heartrate',
      label: 'Better cardiac efficiency',
      lowerIsBetter: true,
      format: (value) => `${Math.round(value)} bpm`,
    },
  ]

  for (const check of checks) {
    const values = activities.map((activity) => {
      let value = activity?.[check.key]
      if (check.key === 'elapsed_time_sec' && !value) value = activity?.moving_time_sec
      return typeof value === 'number' && Number.isFinite(value) ? value : null
    })
    const winner = getWinner(values, { lowerIsBetter: check.lowerIsBetter })
    if (winner !== null) {
      scores[winner].positives.push({
        label: check.label,
        value: check.format(values[winner]),
      })
      scores[winner].score += 1
    }
  }

  const efficiencies = activities.map((activity) => {
    const distance = Number(activity?.distance_m)
    const time = Number(activity?.moving_time_sec)
    return Number.isFinite(distance) && Number.isFinite(time) && time > 0 ? distance / time : null
  })
  const efficiencyWinner = getWinner(efficiencies)
  if (efficiencyWinner !== null) {
    scores[efficiencyWinner].positives.push({
      label: 'Higher running efficiency',
      value: `${efficiencies[efficiencyWinner].toFixed(2)} m/s`,
    })
    scores[efficiencyWinner].score += 1
  }

  const paceMultipliers = activities.map((activity) => {
    const pace = activity?.pace
    if (!Number.isFinite(pace)) return null
    if (pace < 4.5) return 1.6
    if (pace < 5) return 1.4
    if (pace < 6) return 1.25
    if (pace < 7) return 1.1
    return 1
  })
  const paceWinner = getWinner(paceMultipliers)
  if (paceWinner !== null) {
    scores[paceWinner].positives.push({
      label: 'Better pace multiplier',
      value: `${paceMultipliers[paceWinner]}x`,
    })
    scores[paceWinner].score += 1
  }

  const totalChecks = checks.length + 2
  return scores.map((score) => ({
    ...score,
    percentage: Math.round((score.score / totalChecks) * 100),
  }))
}

const buildSummary = (scores, columns) => {
  const winnerIndex = scores.reduce((bestIndex, score, index) => {
    if (bestIndex === -1) return index
    return score.percentage > scores[bestIndex].percentage ? index : bestIndex
  }, -1)

  if (winnerIndex === -1) return 'No clear winner yet.'

  const winner = scores[winnerIndex]
  const highlights = winner.positives.slice(0, 2).map((item) => item.label.toLowerCase())
  const name = columns[winnerIndex]?.name || columns[winnerIndex]?.title || `Run ${winnerIndex + 1}`

  if (!highlights.length) return `${name} leads the comparison.`
  return `${name} leads on ${highlights.join(' and ')}.`
}

const ActivityCompareModal = ({ activities, onClose, onOpenRunDNA }) => {
  if (!activities?.length) return null

  const safe = activities.slice(0, 3)
  const columns = safe.map((activity, index) => ({
    key: activity.id,
    title: `Run ${index + 1}`,
    subtitle: `${formatDate(activity.start_date)}, ${metersToKm(activity.distance_m)} km`,
    name: activity.name || 'Run',
  }))

  const aiScores = computeAIScore(safe)
  const summary = buildSummary(aiScores, columns)
  const colors = ['#0f766e', '#0b5f59', '#2563eb']
  const allFieldKeys = collectFieldKeys(safe)

  const keyMetricRows = [
    { label: 'Name', values: safe.map((activity) => activity.name || 'Run') },
    { label: 'Date', values: safe.map((activity) => formatDate(activity.start_date)) },
    {
      label: 'Distance',
      values: safe.map((activity) => `${metersToKm(activity.distance_m)} km`),
      highlight: true,
    },
    { label: 'Moving time', values: safe.map((activity) => secondsToHms(activity.moving_time_sec) ?? 'Not available') },
    {
      label: 'Elapsed time',
      values: safe.map((activity) => secondsToHms(activity.elapsed_time_sec || activity.moving_time_sec) ?? 'Not available'),
    },
    { label: 'Pace', values: safe.map((activity) => formatPace(activity.pace)), highlight: true },
    {
      label: 'Average speed',
      values: safe.map((activity) =>
        Number.isFinite(activity.average_speed) ? `${(activity.average_speed * 3.6).toFixed(1)} km/h` : 'Not available',
      ),
    },
    {
      label: 'Max speed',
      values: safe.map((activity) =>
        Number.isFinite(activity.max_speed) ? `${(activity.max_speed * 3.6).toFixed(1)} km/h` : 'Not available',
      ),
    },
    {
      label: 'Elevation gain',
      values: safe.map((activity) => `${Math.round(activity.total_elevation_gain ?? 0)} m`),
    },
    {
      label: 'Average heart rate',
      values: safe.map((activity) => (activity.average_heartrate ? `${Math.round(activity.average_heartrate)} bpm` : 'Not available')),
      highlight: true,
    },
    {
      label: 'Max heart rate',
      values: safe.map((activity) => (activity.max_heartrate ? `${Math.round(activity.max_heartrate)} bpm` : 'Not available')),
    },
    { label: 'Calories', values: safe.map((activity) => (activity.calories ? `${Math.round(activity.calories)} kcal` : 'Not available')) },
    { label: 'Points', values: safe.map((activity) => Math.round(activity.total_points ?? 0)), highlight: true },
    {
      label: 'Efficiency',
      values: safe.map((activity) => {
        const distance = Number(activity.distance_m)
        const time = Number(activity.moving_time_sec)
        return Number.isFinite(distance) && Number.isFinite(time) && time > 0 ? `${(distance / time).toFixed(2)} m/s` : 'Not available'
      }),
    },
    { label: 'Kudos', values: safe.map((activity) => activity.kudos_count ?? 0) },
    { label: 'Achievements', values: safe.map((activity) => activity.achievement_count ?? 0) },
    { label: 'Type', values: safe.map((activity) => activity.type || 'Run') },
  ]

  return (
    <div className="modal-overlay" role="dialog" aria-label="Compare runs" onMouseDown={onClose}>
      <div className="modal" onMouseDown={(event) => event.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h3 style={{ margin: 0 }}>Compare runs</h3>
            <p className="muted" style={{ margin: '6px 0 0' }}>
              Side by side analysis of your selected activities.
            </p>
          </div>
          <button type="button" className="icon-button" onClick={onClose} aria-label="Close modal">
            Close
          </button>
        </div>

        <div className="card">
          <div className="section-head">
            <div>
              <h3>AI score</h3>
              <p className="muted">{summary}</p>
            </div>
          </div>
          <div className="ai-score-grid">
            {aiScores.map((score, index) => (
              <div key={columns[index].key} className="ai-score-card">
                <div className="ai-score-header">
                  <span className="ai-score-label">{columns[index].title}</span>
                  <span className="ai-score-name">{columns[index].name}</span>
                </div>
                <div className="ai-score-ring">
                  <svg viewBox="0 0 100 100" className="ai-ring-svg">
                    <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(15,23,42,0.08)" strokeWidth="6" />
                    <circle
                      cx="50"
                      cy="50"
                      r="42"
                      fill="none"
                      stroke={colors[index]}
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray={`${score.percentage * 2.64} 264`}
                      transform="rotate(-90 50 50)"
                      style={{ transition: 'stroke-dasharray 600ms ease' }}
                    />
                  </svg>
                  <span className="ai-ring-value">{score.percentage}%</span>
                </div>
                <div className="ai-positives">
                  {score.positives.length === 0 ? (
                    <span className="muted" style={{ fontSize: 12 }}>
                      No winning metrics
                    </span>
                  ) : (
                    score.positives.map((item) => (
                      <div key={item.label} className="ai-positive-item">
                        <span className="ai-positive-label">{item.label}</span>
                        <span className="ai-positive-value">{item.value}</span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="panel-title">
            <h3>Fingerprint</h3>
            <span className="badge">Normalized</span>
          </div>
          <ActivityCompareRadar activities={safe} />
        </div>

        <div className="card">
          <div className="section-head">
            <div>
              <h3>Key metrics</h3>
              <p className="muted">A quick read on the strongest differences.</p>
            </div>
          </div>
          <div className="compare-grid" style={{ '--compare-cols': safe.length }}>
            <div className="compare-row compare-head">
              <div />
              {columns.map((column) => (
                <div key={column.key} className="compare-colhead">
                  <div className="compare-title">{column.title}</div>
                  <div className="compare-name-sub">{column.name}</div>
                  <div className="muted">{column.subtitle}</div>
                  <button type="button" className="chip-button" onClick={() => onOpenRunDNA?.(column.key)}>
                    RunDNA
                  </button>
                </div>
              ))}
            </div>
            {keyMetricRows.map((row) => (
              <MetricRow key={row.label} label={row.label} values={row.values} highlight={row.highlight} />
            ))}
          </div>
        </div>

        <div className="card">
          <div className="section-head">
            <div>
              <h3>All extracted data</h3>
              <p className="muted">Every primitive field from each activity appears here.</p>
            </div>
          </div>
          <div className="compare-grid" style={{ '--compare-cols': safe.length }}>
            <div className="compare-row compare-head">
              <div />
              {columns.map((column) => (
                <div key={column.key} className="compare-colhead">
                  <div className="compare-title">{column.title}</div>
                  <div className="compare-name-sub">{column.name}</div>
                  <div className="muted">{column.subtitle}</div>
                  <button type="button" className="chip-button" onClick={() => onOpenRunDNA?.(column.key)}>
                    RunDNA
                  </button>
                </div>
              ))}
            </div>
            {allFieldKeys.map((key) => (
              <div key={key} className="compare-row">
                <div className="compare-metric">{humanizeKey(key)}</div>
                {safe.map((activity) => (
                  <div key={`${key}-${activity.id}`} className="compare-value">
                    {formatValue(key, activity[key])}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {safe.length >= 3 ? (
          <div className="card">
            <div className="panel-title">
              <h3>Fingerprint radar</h3>
            </div>
            <ActivityCompareRadar activities={safe.slice(0, 5)} />
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default ActivityCompareModal
