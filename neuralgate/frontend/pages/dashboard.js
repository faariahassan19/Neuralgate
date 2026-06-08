// CSR — Client Side Rendered. All data fetched on client after JWT auth.
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Cookies from 'js-cookie'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis,
} from 'recharts'

const API = 'http://localhost:8000'

function authHeaders() {
  return { Authorization: `Bearer ${Cookies.get('token')}`, 'Content-Type': 'application/json' }
}

// ── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({ page, setPage, email, onLogout }) {
  const nav = [
    { id: 'overview',  icon: '⬛', label: 'Overview' },
    { id: 'inference', icon: '🤖', label: 'AI Inference' },
    { id: 'metrics',   icon: '📊', label: 'Model Metrics' },
    { id: 'pipeline',  icon: '🔧', label: 'ML Pipeline' },
    { id: 'security',  icon: '🔐', label: 'Security' },
  ]
  return (
    <aside style={{ width: 220, background: '#fff', borderRight: '1px solid #e2e6ea', display: 'flex', flexDirection: 'column', minHeight: '100vh', flexShrink: 0 }}>
      <div style={{ padding: '1.25rem 1rem', borderBottom: '1px solid #e2e6ea', fontWeight: 700, fontSize: 16 }}>◈ NeuralGate</div>
      <nav style={{ flex: 1, padding: '0.5rem 0' }}>
        {nav.map(n => (
          <button key={n.id} onClick={() => setPage(n.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: 10, width: '100%',
              padding: '9px 1rem', borderRadius: 0, background: page === n.id ? '#eff6ff' : 'transparent',
              color: page === n.id ? '#3b82f6' : '#374151', fontWeight: page === n.id ? 500 : 400,
              fontSize: 14, textAlign: 'left',
            }}>
            <span style={{ fontSize: 16 }}>{n.icon}</span> {n.label}
          </button>
        ))}
      </nav>
      <div style={{ padding: '1rem', borderTop: '1px solid #e2e6ea' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#dbeafe', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 600, color: '#1e40af' }}>
            {email.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 500 }}>{email.split('@')[0]}</div>
            <div style={{ fontSize: 11, color: '#9ca3af' }}>ML Engineer</div>
          </div>
        </div>
        <button onClick={onLogout} style={{ fontSize: 12, color: '#6b7280', background: 'transparent', padding: '4px 0', width: '100%', textAlign: 'left' }}>
          Sign out →
        </button>
      </div>
    </aside>
  )
}

// ── Overview ─────────────────────────────────────────────────────────────────
function Overview({ metrics }) {
  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: '0.25rem' }}>Overview</h2>
      <p style={{ color: '#6b7280', fontSize: 13, marginBottom: '1.5rem' }}>CSR dashboard — loaded client-side after JWT validation</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: '1.5rem' }}>
        {[
          { label: 'Accuracy',  value: metrics ? `${(metrics.accuracy * 100).toFixed(1)}%` : '–' },
          { label: 'F1 Score',  value: metrics?.f1.toFixed(3) || '–' },
          { label: 'Precision', value: metrics?.precision.toFixed(3) || '–' },
          { label: 'Recall',    value: metrics?.recall.toFixed(3) || '–' },
        ].map(m => (
          <div key={m.label} style={{ background: '#f3f4f6', borderRadius: 8, padding: '0.875rem 1rem' }}>
            <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>{m.label}</div>
            <div style={{ fontSize: 24, fontWeight: 600 }}>{m.value}</div>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginBottom: '1rem' }}>
        <div style={{ fontWeight: 600, fontSize: 14, marginBottom: '0.75rem' }}>ML pipeline stages</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
          {['1. Data gather', '2. Cleaning', '3. Features', '4. Train model', '5. Metrics'].map((s, i) => (
            <>
              <span key={s} style={{ padding: '4px 10px', borderRadius: 20, fontSize: 12, background: '#d1fae5', color: '#065f46', fontWeight: 500 }}>✓ {s}</span>
              {i < 4 && <span key={`a${i}`} style={{ color: '#9ca3af', fontSize: 12 }}>→</span>}
            </>
          ))}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="card">
          <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 8 }}>Rendering strategy</div>
          <div style={{ fontSize: 13, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <div style={{ padding: '6px 10px', background: '#dbeafe', borderRadius: 8, color: '#1e40af' }}><strong>SSG:</strong> /index (landing)</div>
            <div style={{ padding: '6px 10px', background: '#dbeafe', borderRadius: 8, color: '#1e40af' }}><strong>SSR:</strong> /docs (live metrics)</div>
            <div style={{ padding: '6px 10px', background: '#d1fae5', borderRadius: 8, color: '#065f46' }}><strong>CSR:</strong> /dashboard ← you are here</div>
          </div>
        </div>
        <div className="card">
          <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 8 }}>Tech stack</div>
          <div style={{ fontSize: 12, color: '#6b7280', lineHeight: 2 }}>
            Next.js 14 · React 18 · FastAPI · MongoDB<br />
            Scikit-learn · Argon2/pwdlib · JWT/python-jose<br />
            Recharts · Pydantic v2
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Inference ────────────────────────────────────────────────────────────────
function Inference() {
  const [form, setForm] = useState({ sepal_length: 5.1, sepal_width: 3.5, petal_length: 1.4, petal_width: 0.2 })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function predict() {
    setLoading(true); setError(''); setResult(null)
    try {
      const res = await fetch(`${API}/predict`, {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.detail || 'Prediction failed'); setLoading(false); return }
      setResult(data)
    } catch { setError('Cannot reach backend') }
    setLoading(false)
  }

  const speciesColor = { setosa: '#10b981', versicolor: '#f59e0b', virginica: '#3b82f6' }

  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: '0.25rem' }}>AI inference</h2>
      <p style={{ color: '#6b7280', fontSize: 13, marginBottom: '1.5rem' }}>POST /predict — JWT protected via <code>Depends(get_current_user)</code></p>

      <div className="card" style={{ marginBottom: '1rem' }}>
        <div style={{ fontWeight: 600, fontSize: 14, marginBottom: '1rem' }}>Iris sample input</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: '1rem' }}>
          {Object.entries(form).map(([k, v]) => (
            <div key={k}>
              <label style={{ fontSize: 12, color: '#6b7280', display: 'block', marginBottom: 4 }}>
                {k.replace('_', ' ')} (cm)
              </label>
              <input type="number" step="0.1" min="0" value={v}
                onChange={e => setForm(f => ({ ...f, [k]: parseFloat(e.target.value) }))} />
            </div>
          ))}
        </div>
        <button className="btn-primary" onClick={predict} disabled={loading} style={{ padding: '10px 20px' }}>
          {loading ? '⏳ Running…' : '▶ Run inference'}
        </button>
      </div>

      {error && <div className="card" style={{ color: '#ef4444', fontSize: 14 }}>{error}</div>}

      {result && (
        <div className="card">
          <div style={{ fontWeight: 600, fontSize: 14, marginBottom: '0.75rem' }}>FastAPI response</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: '0.75rem' }}>
            <span style={{ fontSize: 28, fontWeight: 700, color: speciesColor[result.prediction] || '#111' }}>
              {result.prediction}
            </span>
            <span className="badge badge-success">{(result.confidence * 100).toFixed(1)}% confidence</span>
          </div>
          <pre>{JSON.stringify(result, null, 2)}</pre>
          <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 8, fontFamily: 'monospace' }}>
            Authorization: Bearer {Cookies.get('token')?.slice(0, 40)}…
          </div>
        </div>
      )}
    </div>
  )
}

// ── Metrics ──────────────────────────────────────────────────────────────────
function Metrics({ metrics }) {
  if (!metrics) return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: '0.25rem' }}>Model metrics</h2>
      <div className="card" style={{ color: '#6b7280' }}>No metrics yet — run a prediction first.</div>
    </div>
  )

  const barData = [
    { name: 'Accuracy',  value: parseFloat((metrics.accuracy * 100).toFixed(1)) },
    { name: 'Precision', value: parseFloat((metrics.precision * 100).toFixed(1)) },
    { name: 'Recall',    value: parseFloat((metrics.recall * 100).toFixed(1)) },
    { name: 'F1',        value: parseFloat((metrics.f1 * 100).toFixed(1)) },
  ]
  const cm = metrics.confusion_matrix
  const labels = ['setosa', 'versicolor', 'virginica']

  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: '0.25rem' }}>Model metrics</h2>
      <p style={{ color: '#6b7280', fontSize: 13, marginBottom: '1.5rem' }}>
        GET /metrics · fetched from MongoDB · <code>{metrics.timestamp}</code>
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: '1.5rem' }}>
        {barData.map(m => (
          <div key={m.name} style={{ background: '#f3f4f6', borderRadius: 8, padding: '0.875rem', textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>{m.name}</div>
            <div style={{ fontSize: 22, fontWeight: 600, color: '#3b82f6' }}>{m.value}%</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="card">
          <div style={{ fontWeight: 600, fontSize: 14, marginBottom: '1rem' }}>Performance bar chart</div>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={barData} margin={{ top: 0, right: 0, bottom: 0, left: -20 }}>
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis domain={[80, 100]} tick={{ fontSize: 11 }} />
              <Tooltip formatter={v => `${v}%`} />
              <Bar dataKey="value" fill="#3b82f6" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <div style={{ fontWeight: 600, fontSize: 14, marginBottom: '1rem' }}>Confusion matrix</div>
          {cm && (
            <div style={{ display: 'grid', gridTemplateColumns: `40px repeat(${cm[0].length},1fr)`, gap: 3 }}>
              <div />
              {labels.slice(0, cm[0].length).map(l => (
                <div key={l} style={{ fontSize: 10, color: '#6b7280', textAlign: 'center', padding: 3 }}>{l.slice(0,5)}</div>
              ))}
              {cm.map((row, i) => (
                <>
                  <div key={`r${i}`} style={{ fontSize: 10, color: '#6b7280', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 4 }}>{labels[i]?.slice(0,5)}</div>
                  {row.map((v, j) => (
                    <div key={`${i}${j}`} style={{
                      textAlign: 'center', padding: '8px 4px', borderRadius: 6, fontSize: 14, fontWeight: 600,
                      background: i === j ? '#d1fae5' : '#fee2e2',
                      color: i === j ? '#065f46' : '#991b1b',
                    }}>{v}</div>
                  ))}
                </>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Pipeline ─────────────────────────────────────────────────────────────────
function Pipeline() {
  const [active, setActive] = useState(0)
  const stages = [
    {
      title: '1. Data gathering',
      code: `# Pydantic validates raw dataset structure
class IrisRecord(BaseModel):
    sepal_length: float
    sepal_width:  float
    petal_length: float
    petal_width:  float
    species:      str

def gather_data() -> list[IrisRecord]:
    iris = load_iris(as_frame=True)
    # UCI dataset loaded via sklearn
    # Also supports: Kaggle CSV, web API, scraping
    return iris.frame`,
    },
    {
      title: '2. Data cleaning',
      code: `def clean_data(df: pd.DataFrame):
    df = df.dropna()           # remove nulls
    df = df.drop_duplicates()  # remove dupes
    z  = np.abs(stats.zscore(df[NUM_COLS]))
    df = df[(z < 3).all(axis=1)]  # z-score outliers
    df["species"] = df["species"].str.strip().str.lower()
    return df`,
    },
    {
      title: '3. Feature engineering',
      code: `def engineer_features(df):
    scaler  = MinMaxScaler()
    encoder = LabelEncoder()

    # Derived feature: petal ratio
    df["petal_ratio"] = df.petal_length / df.petal_width

    X = scaler.fit_transform(df[FEATURE_COLS])  # MinMax scale
    y = encoder.fit_transform(df["species"])     # encode labels
    return X, y, scaler, encoder`,
    },
    {
      title: '4. Model (loaded at startup)',
      code: `# Loaded globally at FastAPI startup — low latency
@app.on_event("startup")
async def load_model():
    global ml_model
    ml_model["clf"]     = joblib.load("iris_model.pkl")
    ml_model["scaler"]  = joblib.load("iris_scaler.pkl")
    ml_model["encoder"] = joblib.load("iris_encoder.pkl")

@app.post("/predict")
async def predict(data: IrisInput,
                  user = Depends(get_current_user)):
    X = ml_model["scaler"].transform([[...]])
    return ml_model["clf"].predict(X)`,
    },
    {
      title: '5. Metrics → MongoDB',
      code: `from sklearn.metrics import (
    accuracy_score, precision_score,
    recall_score, f1_score, confusion_matrix
)

def evaluate_and_persist(y_true, y_pred, db):
    metrics = {
        "accuracy":  accuracy_score(y_true, y_pred),
        "precision": precision_score(..., average="macro"),
        "recall":    recall_score(..., average="macro"),
        "f1":        f1_score(..., average="macro"),
        "confusion_matrix": confusion_matrix(...).tolist(),
        "timestamp": datetime.utcnow(),
    }
    db.metrics.insert_one(metrics)  # persisted to MongoDB
    return metrics`,
    },
  ]

  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: '0.25rem' }}>ML pipeline</h2>
      <p style={{ color: '#6b7280', fontSize: 13, marginBottom: '1.5rem' }}>5 stages of the AI lifecycle — FastAPI + Python backend</p>

      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: '1rem' }}>
        {stages.map((s, i) => (
          <button key={i} onClick={() => setActive(i)}
            style={{ padding: '6px 12px', fontSize: 12, borderRadius: 8,
              background: active === i ? '#3b82f6' : '#f3f4f6',
              color: active === i ? 'white' : '#374151', fontWeight: active === i ? 500 : 400,
              border: 'none',
            }}>
            Stage {i + 1}
          </button>
        ))}
      </div>

      <div className="card">
        <div style={{ fontWeight: 600, fontSize: 14, marginBottom: '0.75rem' }}>
          {stages[active].title} <span className="badge badge-success" style={{ marginLeft: 8 }}>complete</span>
        </div>
        <pre>{stages[active].code}</pre>
      </div>
    </div>
  )
}

// ── Security ─────────────────────────────────────────────────────────────────
function Security() {
  const token = Cookies.get('token') || ''
  return (
    <div>
      <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: '0.25rem' }}>Security — Tier C</h2>
      <p style={{ color: '#6b7280', fontSize: 13, marginBottom: '1.5rem' }}>OAuth2 + JWT + Argon2 password hashing</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: '1.5rem' }}>
        {[
          { label: 'Hash algo',    value: 'Argon2id' },
          { label: 'Token TTL',    value: '30 min' },
          { label: 'Token type',   value: 'Bearer' },
          { label: 'Standard',     value: 'OAuth2' },
        ].map(m => (
          <div key={m.label} style={{ background: '#f3f4f6', borderRadius: 8, padding: '0.875rem', textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 4 }}>{m.label}</div>
            <div style={{ fontSize: 16, fontWeight: 600 }}>{m.value}</div>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginBottom: '1rem' }}>
        <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 8 }}>Your active JWT</div>
        <div style={{ fontFamily: 'monospace', fontSize: 11, color: '#6b7280', wordBreak: 'break-all', background: '#f3f4f6', borderRadius: 8, padding: '0.75rem' }}>
          {token || 'No token found'}
        </div>
      </div>

      <div className="card">
        <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 8 }}>auth.py — key patterns</div>
        <pre>{`from pwdlib import PasswordHash
from jose import jwt

pwd = PasswordHash.recommended()  # Argon2id

# /register — hash before storing
hashed = pwd.hash(user.password)
db.users.insert_one({"email": ..., "password": hashed})

# /token — verify and issue JWT
if not pwd.verify(form.password, user["password"]):
    raise HTTPException(401, "Incorrect password")
token = jwt.encode({"sub": email, "exp": ...}, SECRET_KEY)

# Protected routes — Depends injection
@app.post("/predict")
async def predict(data: IrisInput,
                  user = Depends(get_current_user)):
    ...  # only reached if JWT is valid`}</pre>
      </div>
    </div>
  )
}

// ── Main Dashboard ────────────────────────────────────────────────────────────
export default function Dashboard() {
  const router = useRouter()
  const [page, setPage]       = useState('overview')
  const [metrics, setMetrics] = useState(null)
  const [email, setEmail]     = useState('')

  useEffect(() => {
    const token = Cookies.get('token')
    const user  = Cookies.get('user_email')
    if (!token) { router.push('/login'); return }
    setEmail(user || 'user')
    fetch(`${API}/metrics`, { headers: authHeaders() })
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d) setMetrics(d) })
      .catch(() => {})
  }, [])

  function logout() {
    Cookies.remove('token'); Cookies.remove('user_email')
    router.push('/login')
  }

  const pages = { overview: <Overview metrics={metrics} />, inference: <Inference />, metrics: <Metrics metrics={metrics} />, pipeline: <Pipeline />, security: <Security /> }

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar page={page} setPage={setPage} email={email} onLogout={logout} />
      <main style={{ flex: 1, padding: '2rem', overflowY: 'auto', maxWidth: 900 }}>
        {pages[page]}
      </main>
    </div>
  )
}
