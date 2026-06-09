import { useMemo, useState } from 'react'

const weekdayLabels = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
const monthLabels = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const toLocalIso = (date) => {
  const copy = new Date(date)
  const offset = copy.getTimezoneOffset() * 60000
  return new Date(copy.getTime() - offset).toISOString().split('T')[0]
}

const MonthCalendar = ({ activities = [], onSelectDate, selectedEndIso }) => {
  const [viewDate, setViewDate] = useState(() => new Date(selectedEndIso || new Date()))
  const currentDate = viewDate

  const activeDates = useMemo(() => {
    const dates = new Set()
    activities.forEach((activity) => {
      if (activity?.start_date) dates.add(toLocalIso(activity.start_date))
    })
    return dates
  }, [activities])

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const firstDayOfMonth = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const selectedRange = useMemo(() => {
    if (!selectedEndIso) return null
    const end = new Date(selectedEndIso)
    end.setHours(23, 59, 59, 999)
    const start = new Date(end)
    start.setDate(end.getDate() - 6)
    start.setHours(0, 0, 0, 0)
    return { start: start.getTime(), end: end.getTime() }
  }, [selectedEndIso])

  const goPrev = () => setViewDate(new Date(year, month - 1, 1))
  const goNext = () => setViewDate(new Date(year, month + 1, 1))

  const days = []
  for (let index = 0; index < firstDayOfMonth; index += 1) {
    days.push(<div key={`empty-${index}`} className="calendar-day empty" aria-hidden="true" />)
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = new Date(year, month, day)
    const isoDate = toLocalIso(date)
    const hasActivity = activeDates.has(isoDate)
    const isToday = toLocalIso(new Date()) === isoDate
    const isSelected = selectedRange && date.getTime() >= selectedRange.start && date.getTime() <= selectedRange.end

    days.push(
      <button
        key={day}
        type="button"
        className={`calendar-day${hasActivity ? ' active-day' : ''}${isToday ? ' today' : ''}${isSelected ? ' selected-week' : ''}`}
        onClick={() => onSelectDate?.(date)}
        aria-label={`${monthLabels[month]} ${day}${hasActivity ? ', activity' : ''}`}
      >
        {day}
      </button>,
    )
  }

  return (
    <div className="calendar-widget">
      <div className="calendar-header">
        <button type="button" className="calendar-nav" onClick={goPrev}>
          Prev month
        </button>
        <div className="calendar-title">
          {monthLabels[month]} {year}
        </div>
        <button type="button" className="calendar-nav" onClick={goNext}>
          Next month
        </button>
      </div>

      <div className="calendar-grid">
        {weekdayLabels.map((weekday) => (
          <div key={weekday} className="calendar-weekday">
            {weekday}
          </div>
        ))}
        {days}
      </div>

      {selectedEndIso ? (
        <div className="calendar-footer">
          <span>Selected week ends on {new Date(selectedEndIso).toLocaleDateString()}</span>
          <button type="button" className="chip-button" onClick={() => onSelectDate?.(new Date())}>
            Reset
          </button>
        </div>
      ) : null}
    </div>
  )
}

export default MonthCalendar
