import joblib
import numpy as np
from pathlib import Path


MODEL_PATH = Path(__file__).parent / "models" / "xgboost_model.pkl"


def load_model():
    if not MODEL_PATH.exists():
        raise FileNotFoundError(
            "XGBoost model has not been trained yet."
        )

    return joblib.load(MODEL_PATH)


def predict_risk(features):
    model = load_model()

    data = np.array(features).reshape(1, -1)

    prediction = model.predict(data)[0]
    probabilities = model.predict_proba(data)[0]

    risk_labels = {
        0: "Low Risk",
        1: "Moderate Risk",
        2: "High Risk"
    }

    return {
        "risk_level": risk_labels[int(prediction)],
        "probabilities": {
            "low": float(probabilities[0]),
            "moderate": float(probabilities[1]),
            "high": float(probabilities[2])
        }
    }