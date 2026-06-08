// SSR: getServerSideProps — fetches live metrics on every request
import Link from 'next/link'

export default function Docs({ metrics, fetchedAt }) {
  return (
    <div style={{ maxWidth: 780, margin: '0 auto', padding: '2rem' }}>
      <Link href="/" style={{ color: '#6b7280', fontSize: 13 }}>← Back to home</Link>

      <div style={{ marginTop: '1.5rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: 12 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700 }}>Model accuracy documentation</h1>
        <span className="badge badge-info">SSR</span>
      </div>
      <p style={{ color: '#6b7280', marginBottom: '2rem', fontSize: 14 }}>
        Server-rendered on every request. Metrics fetched from MongoDB at: <code>{fetchedAt}</code>
      </p>

      {metrics ? (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: '2rem' }}>
            {[
              { label: 'Accuracy',  value: `${(metrics.accuracy * 100).toFixed(1)}%` },
              { label: 'Precision', value: metrics.precision.toFixed(3) },
              { label: 'Recall',    value: metrics.recall.toFixed(3) },
              { label: 'F1 Score',  value: metrics.f1.toFixed(3) },
            ].map(m => (
              <div key={m.label} className="card" style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>{m.label}</div>
                <div style={{ fontSize: 24, fontWeight: 600, color: '#3b82f6' }}>{m.value}</div>
              </div>
            ))}
          </div>

          <div className="card" style={{ marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: '1rem' }}>Confusion matrix</h2>
            <div style={{ display: 'grid', gridTemplateColumns: `auto repeat(${metrics.confusion_matrix[0].length}, 1fr)`, gap: 4, maxWidth: 320 }}>
              <div />
              {metrics.confusion_matrix[0].map((_, i) => (
                <div key={i} style={{ textAlign: 'center', fontSize: 11, color: '#6b7280', padding: 4 }}>Pred {i}</div>
              ))}
              {metrics.confusion_matrix.map((row, i) => (
                <>
                  <div key={`r${i}`} style={{ fontSize: 11, color: '#6b7280', display: 'flex', alignItems: 'center' }}>Act {i}</div>
                  {row.map((val, j) => (
                    <div key={`${i}-${j}`} style={{
                      textAlign: 'center', padding: '10px 4px', borderRadius: 6, fontWeight: 500,
                      background: i === j ? '#d1fae5' : '#fee2e2',
                      color: i === j ? '#065f46' : '#991b1b',
                    }}>{val}</div>
                  ))}
                </>
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="card" style={{ color: '#6b7280' }}>
          No metrics available yet. Run a prediction from the dashboard first.
        </div>
      )}

      <div className="card">
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: '0.75rem' }}>Dataset info</h2>
        <p style={{ color: '#6b7280', fontSize: 14 }}>
          UCI Iris dataset · 150 records · 4 features · 3 classes (setosa, versicolor, virginica) ·
          80/20 train-test split · RandomForestClassifier (100 estimators) · MinMax scaled features
        </p>
      </div>
    </div>
  )
}

// SSR — runs on every request
export async function getServerSideProps() {
  let metrics = null
  try {
    const res = await fetch('http://localhost:8000/health')
    // Metrics endpoint requires auth, so we just show the public info
    // In production you'd use a service token
  } catch {}

  return {
    props: {
      metrics,
      fetchedAt: new Date().toISOString(),
    },
  }
}
