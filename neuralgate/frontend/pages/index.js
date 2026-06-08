// SSG: getStaticProps — public landing page, no auth needed
import Link from 'next/link'

export default function Landing({ buildTime }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Nav */}
      <nav style={{ background: '#fff', borderBottom: '1px solid #e2e6ea', padding: '0 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>
        <span style={{ fontWeight: 600, fontSize: 18 }}>◈ NeuralGate</span>
        <div style={{ display: 'flex', gap: 12 }}>
          <Link href="/docs" style={{ color: '#6b7280', fontSize: 14 }}>Model docs</Link>
          <Link href="/login">
            <button className="btn-primary" style={{ padding: '6px 16px' }}>Sign in</button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 2rem', textAlign: 'center' }}>
        <div className="badge badge-info" style={{ marginBottom: '1rem' }}>SSG — built at {buildTime}</div>
        <h1 style={{ fontSize: 42, fontWeight: 700, letterSpacing: -1, marginBottom: '1rem', lineHeight: 1.2 }}>
          Enterprise AI Platform<br />
          <span style={{ color: '#3b82f6' }}>Full-stack ML in production</span>
        </h1>
        <p style={{ color: '#6b7280', maxWidth: 520, marginBottom: '2rem', fontSize: 17 }}>
          FastAPI + Next.js + MongoDB. End-to-end ML pipeline with JWT auth, real-time inference, and live model metrics.
        </p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link href="/login">
            <button className="btn-primary" style={{ padding: '12px 28px', fontSize: 15 }}>Get started →</button>
          </Link>
          <Link href="/docs">
            <button className="btn-outline" style={{ padding: '12px 28px', fontSize: 15 }}>Model accuracy docs</button>
          </Link>
        </div>
      </main>

      {/* Feature grid */}
      <section style={{ padding: '3rem 2rem', maxWidth: 900, margin: '0 auto', width: '100%' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
          {[
            { icon: '🔐', title: 'JWT + Argon2 auth', desc: 'OAuth2 /token endpoint, short-lived JWTs, Argon2 password hashing' },
            { icon: '🤖', title: '5-stage ML pipeline', desc: 'Gather → Clean → Feature eng. → Train → Metrics, persisted to MongoDB' },
            { icon: '⚡', title: 'Low-latency inference', desc: 'Model loaded at FastAPI startup. ~38ms average response time' },
            { icon: '📊', title: 'Live model metrics', desc: 'Accuracy, F1, confusion matrix visualised in the dashboard' },
          ].map(f => (
            <div key={f.title} className="card">
              <div style={{ fontSize: 28, marginBottom: 8 }}>{f.icon}</div>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>{f.title}</div>
              <div style={{ color: '#6b7280', fontSize: 13 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <footer style={{ textAlign: 'center', padding: '1.5rem', color: '#9ca3af', fontSize: 13, borderTop: '1px solid #e2e6ea' }}>
        NeuralGate — Next.js {process.env.NEXT_PUBLIC_VERSION || '14'} + FastAPI
      </footer>
    </div>
  )
}

// SSG — runs at build time, not per-request
export async function getStaticProps() {
  return {
    props: {
      buildTime: new Date().toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' }),
    },
  }
}
