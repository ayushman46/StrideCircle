import { formatDate, formatPace, secondsToHms } from '../lib/utils'
import StatCard from '../components/StatCard'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorState from '../components/ErrorState'
import { useProfile } from '../hooks/useProfile'

const formatValue = (value) => {
  if (value === null || value === undefined || value === '') return 'Not set'
  if (typeof value === 'number' && Number.isFinite(value)) return value.toString()
  return value
}

const ProfilePage = () => {
  const query = useProfile()

  if (query.isLoading) return <LoadingSpinner />
  if (query.isError) return <ErrorState message="Could not load your profile." />

  const { profile, stats } = query.data
  const current = stats?.current
  const allTime = stats?.allTime

  const profileFields = [
    { label: 'Username', value: profile?.username },
    { label: 'Athlete ID', value: profile?.strava_athlete_id },
    { label: 'City', value: profile?.city },
    { label: 'Country', value: profile?.country },
    { label: 'Sex', value: profile?.sex },
    { label: 'Weight', value: profile?.weight_kg != null ? `${profile.weight_kg} kg` : null },
    { label: 'Created', value: profile?.created_at ? formatDate(profile.created_at) : null },
    { label: 'Updated', value: profile?.updated_at ? formatDate(profile.updated_at) : null },
  ]

  return (
    <div className="page">
      <section className="section">
        <div className="profile-hero">
          {profile?.avatar_url ? (
            <img
              src={profile.avatar_url}
              alt={profile.full_name || 'Profile photo'}
              className="profile-photo"
            />
          ) : (
            <div
              className="profile-photo"
              style={{
                display: 'grid',
                placeItems: 'center',
                color: 'var(--accent-strong)',
                fontSize: 22,
                fontWeight: 700,
              }}
            >
              {(profile?.full_name || profile?.username || 'R').charAt(0).toUpperCase()}
            </div>
          )}

          <div className="profile-meta">
            <p className="eyebrow">Profile</p>
            <h2>{profile?.full_name || profile?.username || 'Runner'}</h2>
            <p className="muted">
              A full view of your Strava identity, cumulative training, and recent rhythm.
            </p>
          </div>
        </div>

        <div className="card">
          <div className="section-head">
            <div>
              <h3>Profile details</h3>
              <p className="muted">Every extracted detail we have available from Strava.</p>
            </div>
          </div>
          <div className="profile-field-grid">
            {profileFields.map((field) => (
              <div key={field.label} className="profile-field">
                <div className="profile-field-label">{field.label}</div>
                <div className="profile-field-value">{formatValue(field.value)}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="section-head">
            <div>
              <h3>Last 30 days</h3>
              <p className="muted">The most recent snapshot of your running shape.</p>
            </div>
          </div>
          <div className="profile-stat-grid">
            <StatCard label="Distance" value={`${current?.totalDistanceKm ?? 0} km`} />
            <StatCard label="Runs" value={current?.totalRuns ?? 0} />
            <StatCard label="Average pace" value={formatPace(current?.avgPaceMinPerKm)} />
            <StatCard label="Elapsed time" value={secondsToHms(current?.totalElapsedTimeSec) ?? '0m'} />
          </div>
        </div>

        <div className="card">
          <div className="section-head">
            <div>
              <h3>Cumulative totals</h3>
              <p className="muted">Everything we have synced across your history.</p>
            </div>
          </div>
          <div className="profile-stat-grid">
            <StatCard label="Distance" value={`${allTime?.totalDistanceKm ?? 0} km`} />
            <StatCard label="Runs" value={allTime?.totalRuns ?? 0} />
            <StatCard label="Average pace" value={formatPace(allTime?.avgPaceMinPerKm)} />
            <StatCard label="Fastest pace" value={formatPace(allTime?.fastestPaceMinPerKm)} />
            <StatCard label="Longest run" value={`${allTime?.longestRunKm ?? 0} km`} />
            <StatCard label="Elevation" value={`${Math.round(allTime?.totalElevationGainM ?? 0)} m`} />
            <StatCard label="Points" value={Math.round(allTime?.totalPoints ?? 0)} />
            <StatCard label="Kudos" value={Math.round(allTime?.totalKudos ?? 0)} />
          </div>
        </div>
      </section>
    </div>
  )
}

export default ProfilePage
