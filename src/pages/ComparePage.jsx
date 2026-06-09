import { useState } from 'react'
import ActivityTable from '../components/ActivityTable'
import ActivityCompareModal from '../components/ActivityCompareModal'
import RunDNAModal from '../components/RunDNAModal'
import { useActivities } from '../hooks/useActivities'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorState from '../components/ErrorState'

const ComparePage = () => {
  const { data, isLoading, isError } = useActivities({ limit: 200 })
  const [compareIds, setCompareIds] = useState([])
  const [compareOpen, setCompareOpen] = useState(false)
  const [runDnaActivityId, setRunDnaActivityId] = useState(null)

  if (isLoading) return <LoadingSpinner />
  if (isError) return <ErrorState message="Could not load your activities." />

  const allActivities = data?.activities || []
  const selectedActivities = compareIds
    .map((id) => allActivities.find((activity) => activity.id === id))
    .filter(Boolean)

  const toggleCompare = (id, checked) => {
    setCompareIds((prev) => {
      if (checked && !prev.includes(id)) return [...prev, id]
      if (!checked) return prev.filter((value) => value !== id)
      return prev
    })
  }

  return (
    <div className="page">
      <RunDNAModal activityId={runDnaActivityId} onClose={() => setRunDnaActivityId(null)} />
      {compareOpen && selectedActivities.length >= 2 ? (
        <ActivityCompareModal
          activities={selectedActivities}
          onClose={() => setCompareOpen(false)}
          onOpenRunDNA={(id) => {
            setCompareOpen(false)
            setRunDnaActivityId(id)
          }}
        />
      ) : null}

      <section className="section">
        <div className="section-header">
          <div>
            <h2>Compare runs</h2>
            <p className="muted">Select two or three runs, then open the comparison view.</p>
          </div>
        </div>

        <div className="card">
          <ActivityTable
            activities={allActivities}
            onOpenRunDNA={setRunDnaActivityId}
            selectedIds={compareIds}
            onToggleSelect={toggleCompare}
          />
        </div>

        <div className="compare-bar">
          <div className="muted">
            Selected <strong>{compareIds.length}</strong> of 3
          </div>
          <div className="compare-actions">
            <button type="button" className="button secondary" onClick={() => setCompareIds([])} disabled={!compareIds.length}>
              Clear selection
            </button>
            <button
              type="button"
              className="button"
              onClick={() => setCompareOpen(true)}
              disabled={selectedActivities.length < 2}
            >
              Compare selected runs
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ComparePage
