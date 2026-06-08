from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import joblib, os, numpy as np
from datetime import datetime

from auth import router as auth_router, get_current_user
from models import IrisInput, PredictionResponse, MetricsResponse
from pipeline import run_full_pipeline
from database import db

# ── Global model state ──────────────────────────────────────────────────────
ml_model = {}

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Load model globally at startup (low-latency inference)
    model_path = "iris_model.pkl"
    if os.path.exists(model_path):
        ml_model["clf"]     = joblib.load(model_path)
        ml_model["scaler"]  = joblib.load("iris_scaler.pkl")
        ml_model["encoder"] = joblib.load("iris_encoder.pkl")
        print("✅  Model loaded at startup")
    else:
        # Train and save if first run
        print("🔧  No model found — running pipeline to train…")
        result = run_full_pipeline()
        ml_model.update(result)
        print("✅  Pipeline complete — model ready")
    yield
    ml_model.clear()

app = FastAPI(title="NeuralGate API", version="1.0.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router)

# ── Inference endpoint (JWT protected) ──────────────────────────────────────
@app.post("/predict", response_model=PredictionResponse)
async def predict(data: IrisInput, user: dict = Depends(get_current_user)):
    if "clf" not in ml_model:
        raise HTTPException(status_code=503, detail="Model not loaded")

    X = np.array([[data.sepal_length, data.sepal_width,
                   data.petal_length, data.petal_width]])
    X_scaled = ml_model["scaler"].transform(X)
    pred_idx  = ml_model["clf"].predict(X_scaled)[0]
    proba     = ml_model["clf"].predict_proba(X_scaled)[0]
    species   = ml_model["encoder"].inverse_transform([pred_idx])[0]
    confidence = float(round(proba[pred_idx], 4))

    # Log to MongoDB
    db.predictions.insert_one({
        "user": user["sub"],
        "input": data.dict(),
        "prediction": species,
        "confidence": confidence,
        "timestamp": datetime.utcnow(),
    })

    return PredictionResponse(
        prediction=species,
        confidence=confidence,
        user=user["sub"],
    )

# ── Metrics endpoint (JWT protected) ────────────────────────────────────────
@app.get("/metrics", response_model=MetricsResponse)
async def get_metrics(user: dict = Depends(get_current_user)):
    doc = db.metrics.find_one(sort=[("timestamp", -1)])
    if not doc:
        raise HTTPException(status_code=404, detail="No metrics saved yet")
    return MetricsResponse(
        accuracy=doc["accuracy"],
        precision=doc["precision"],
        recall=doc["recall"],
        f1=doc["f1"],
        confusion_matrix=doc["confusion_matrix"],
        timestamp=str(doc["timestamp"]),
    )

@app.get("/health")
async def health():
    return {"status": "ok", "model_loaded": "clf" in ml_model}
