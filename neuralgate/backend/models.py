from pydantic import BaseModel
from typing import List, Optional

# ── Input validation (Tier B - Stage 1 Pydantic schema) ─────────────────────
class IrisInput(BaseModel):
    sepal_length: float
    sepal_width:  float
    petal_length: float
    petal_width:  float

class PredictionResponse(BaseModel):
    prediction: str
    confidence: float
    user: str

class MetricsResponse(BaseModel):
    accuracy:         float
    precision:        float
    recall:           float
    f1:               float
    confusion_matrix: List[List[int]]
    timestamp:        str
