const Login = () => (
  <div className="page">
    <section className="hero">
      <div>
        <p className="eyebrow">StrideCircle</p>
        <h1>Connect your running history and read it with more clarity.</h1>
        <p className="lead">
          Sync Strava, compare runs, and see a calmer view of progress, pace, and consistency.
        </p>
        <div className="actions">
          <a className="button" href="/api/strava">
            Connect with Strava
          </a>
          <a className="button secondary" href="/dashboard">
            View dashboard
          </a>
        </div>
      </div>

      <div className="hero-card">
        <p className="eyebrow">Quick preview</p>
        <ul>
          <li>Weekly distance and pace</li>
          <li>Activity compare and AI score</li>
          <li>Profile totals and history</li>
        </ul>
      </div>
    </section>
  </div>
)

export default Login
