import DistanceChart from '../components/charts/DistanceChart'
import PaceTrendChart from '../components/charts/PaceTrendChart'

const landingTrend = [
  { label: 'Mar 3', distanceKm: 18.2, avgPaceMinPerKm: 5.9 },
  { label: 'Mar 10', distanceKm: 22.5, avgPaceMinPerKm: 5.7 },
  { label: 'Mar 17', distanceKm: 26.4, avgPaceMinPerKm: 5.55 },
  { label: 'Mar 24', distanceKm: 30.2, avgPaceMinPerKm: 5.38 },
  { label: 'Mar 31', distanceKm: 34.1, avgPaceMinPerKm: 5.3 },
  { label: 'Apr 7', distanceKm: 28.9, avgPaceMinPerKm: 5.25 },
]

const landingStats = [
  { label: 'RunDNA analysis', value: 'Per run pacing and drift' },
  { label: 'FairPlay leaderboard', value: 'Improvement over raw volume' },
  { label: 'Run compare', value: 'Two or three runs at once' },
]

const Landing = () => (
  <div className="page landing-page">
    <section className="landing-hero">
      <div className="hero-grid">
        <div className="hero-copy">
          <p className="eyebrow">StrideCircle</p>
          <h1>
            A cleaner way to read your running.
          </h1>
          <p className="lead">
            StrideCircle turns Strava history into a calm weekly view with meaningful pace analysis,
            smarter comparisons, and coaching that is easy to trust.
          </p>
          <div className="actions">
            <a className="button" href="/api/strava">
              Connect with Strava
            </a>
            <a className="button secondary" href="/dashboard">
              Open dashboard
            </a>
          </div>
          <div className="hero-badges" aria-label="Highlights">
            {landingStats.map((item) => (
              <div key={item.label}>
                <div className="pill">{item.label}</div>
                <div className="muted" style={{ marginTop: 4 }}>
                  {item.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="hero-panels">
          <div className="card">
            <div className="panel-title">
              <h3>Distance over time</h3>
              <span className="badge">Recent weeks</span>
            </div>
            <DistanceChart data={landingTrend} variant="plain" />
          </div>
          <div className="card">
            <div className="panel-title">
              <h3>Pace trend</h3>
              <span className="badge">Weighted pace</span>
            </div>
            <PaceTrendChart data={landingTrend} variant="plain" />
          </div>
        </div>
      </div>
    </section>

    <section className="section">
      <div className="section-head">
        <div>
          <h2>Why it feels different</h2>
          <p className="muted">Less noise. More signal. A faster read on how training is actually going.</p>
        </div>
      </div>

      <div className="grid three-col">
        <div className="feature-card">
          <h3>Weekly rhythm</h3>
          <p className="muted">
            Pick an active day, see only the week that matters, and read the pattern without empty space.
          </p>
        </div>
        <div className="feature-card">
          <h3>Run compare</h3>
          <p className="muted">
            Compare every useful field side by side, then let the AI score explain what each run did well.
          </p>
        </div>
        <div className="feature-card">
          <h3>Runner profile</h3>
          <p className="muted">
            Your cumulative totals, photo, and history live in one calm place that feels built for athletes.
          </p>
        </div>
      </div>
    </section>

    <footer className="section footer">
      <div className="footer-inner">
        <p className="muted">© {new Date().getFullYear()} StrideCircle</p>
        <div className="footer-links">
          <a href="/dashboard">Dashboard</a>
          <a href="/profile">Profile</a>
        </div>
      </div>
    </footer>
  </div>
)

export default Landing
