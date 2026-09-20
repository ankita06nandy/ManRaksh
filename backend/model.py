import joblib
import pandas as pd
from pathlib import Path


# ==========================================
# PATH
# ==========================================

MODEL_PATH = Path(__file__).parent / "models" / "xgboost_model.pkl"


# ==========================================
# LOAD MODEL
# ==========================================

def load_model():
    if not MODEL_PATH.exists():
        raise FileNotFoundError(
            "XGBoost model has not been trained yet."
        )

    return joblib.load(MODEL_PATH)


# ==========================================
# RISK PREDICTION
# ==========================================

def predict_risk(data):
    """
    Predict personnel stress risk.

    data should be a dictionary containing
    the same feature names used during training.
    """

    model = load_model()

    input_data = pd.DataFrame([data])

    prediction = model.predict(input_data)[0]

    probabilities = model.predict_proba(input_data)[0]

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