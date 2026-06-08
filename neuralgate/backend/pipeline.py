"""
End-to-end ML Pipeline — 5 Stages (Tier B)
  1. Data Gathering
  2. Data Cleaning
  3. Feature Engineering
  4. Model Training & Persistence
  5. Metrics Computation & MongoDB storage
"""

import numpy as np
import pandas as pd
import joblib
from scipy import stats
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import MinMaxScaler, LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score, precision_score, recall_score,
    f1_score, confusion_matrix,
)
from datetime import datetime
from database import db


# ── Stage 1: Data Gathering ──────────────────────────────────────────────────
def gather_data() -> pd.DataFrame:
    """Load Iris dataset (UCI via sklearn). Validate with Pydantic-compatible dtypes."""
    iris = load_iris(as_frame=True)
    df = iris.frame.copy()
    df.columns = [
        "sepal_length", "sepal_width",
        "petal_length", "petal_width", "target",
    ]
    # Map numeric target → species name
    df["species"] = df["target"].map(dict(enumerate(iris.target_names)))
    df.drop(columns=["target"], inplace=True)
    print(f"[Stage 1] Gathered {len(df)} records")
    return df


# ── Stage 2: Data Cleaning ───────────────────────────────────────────────────
def clean_data(df: pd.DataFrame) -> pd.DataFrame:
    NUM_COLS = ["sepal_length", "sepal_width", "petal_length", "petal_width"]
    before = len(df)
    df = df.dropna()
    df = df.drop_duplicates()
    z  = np.abs(stats.zscore(df[NUM_COLS]))
    df = df[(z < 3).all(axis=1)]
    df["species"] = df["species"].str.strip().str.lower()
    print(f"[Stage 2] Cleaned: {before} → {len(df)} records")
    return df.reset_index(drop=True)


# ── Stage 3: Feature Engineering ────────────────────────────────────────────
def engineer_features(df: pd.DataFrame):
    NUM_COLS = ["sepal_length", "sepal_width", "petal_length", "petal_width"]

    # Derived feature
    df["petal_ratio"] = (df["petal_length"] / df["petal_width"]).round(4)

    scaler  = MinMaxScaler()
    encoder = LabelEncoder()

    feature_cols = NUM_COLS + ["petal_ratio"]
    X = scaler.fit_transform(df[feature_cols])
    y = encoder.fit_transform(df["species"])

    print(f"[Stage 3] Features: {feature_cols}")
    return X, y, scaler, encoder


# ── Stage 4: Model Training ──────────────────────────────────────────────────
def train_model(X, y):
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    clf = RandomForestClassifier(n_estimators=100, random_state=42)
    clf.fit(X_train, y_train)
    print("[Stage 4] Model trained — saving .pkl files")
    return clf, X_test, y_test


# ── Stage 5: Metrics & Persistence ──────────────────────────────────────────
def evaluate_and_persist(clf, X_test, y_test, encoder):
    y_pred = clf.predict(X_test)
    cm     = confusion_matrix(y_test, y_pred).tolist()
    metrics = {
        "accuracy":         round(float(accuracy_score(y_test, y_pred)), 4),
        "precision":        round(float(precision_score(y_test, y_pred, average="macro", zero_division=0)), 4),
        "recall":           round(float(recall_score(y_test, y_pred, average="macro", zero_division=0)), 4),
        "f1":               round(float(f1_score(y_test, y_pred, average="macro", zero_division=0)), 4),
        "confusion_matrix": cm,
        "timestamp":        datetime.utcnow(),
    }
    db.metrics.insert_one(dict(metrics))
    print(f"[Stage 5] Metrics saved → accuracy={metrics['accuracy']}, f1={metrics['f1']}")
    return metrics


# ── Full pipeline runner ─────────────────────────────────────────────────────
def run_full_pipeline() -> dict:
    df              = gather_data()
    df              = clean_data(df)
    X, y, scaler, encoder = engineer_features(df)
    clf, X_test, y_test   = train_model(X, y)

    joblib.dump(clf,     "iris_model.pkl")
    joblib.dump(scaler,  "iris_scaler.pkl")
    joblib.dump(encoder, "iris_encoder.pkl")

    evaluate_and_persist(clf, X_test, y_test, encoder)
    return {"clf": clf, "scaler": scaler, "encoder": encoder}
