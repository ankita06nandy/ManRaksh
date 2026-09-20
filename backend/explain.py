import joblib
import pandas as pd
import shap

from pathlib import Path


# ==========================================
# PATHS
# ==========================================

BASE_DIR = Path(__file__).parent
MODEL_PATH = BASE_DIR / "models" / "xgboost_model.pkl"


# ==========================================
# LOAD TRAINED PIPELINE
# ==========================================

pipeline = joblib.load(MODEL_PATH)

preprocessor = pipeline.named_steps["preprocessor"]
model = pipeline.named_steps["classifier"]


# ==========================================
# GET TRANSFORMED FEATURE NAMES
# ==========================================

feature_names = preprocessor.get_feature_names_out()


# ==========================================
# CREATE SHAP EXPLAINER
# ==========================================

explainer = shap.TreeExplainer(model)


# ==========================================
# EXPLAIN ONE PERSON
# ==========================================

def explain_prediction(data):
    """
    Explain the XGBoost prediction for one person.

    data must contain the same input columns
    used during model training.
    """

    input_df = pd.DataFrame([data])

    # Transform input using the same preprocessing
    # used during training.
    transformed_data = preprocessor.transform(input_df)

    # Generate SHAP values
    shap_values = explainer.shap_values(transformed_data)

    prediction = model.predict(transformed_data)[0]

    risk_labels = {
        0: "Low Risk",
        1: "Moderate Risk",
        2: "High Risk"
    }

    # XGBoost multiclass SHAP can return
    # different shapes depending on SHAP version.
    if isinstance(shap_values, list):
        class_values = shap_values[int(prediction)][0]
    else:
        shap_array = shap_values

        if len(shap_array.shape) == 3:
            class_values = shap_array[0, :, int(prediction)]
        else:
            class_values = shap_array[0]

    # Pair feature names with SHAP values
    contributions = list(
        zip(
            feature_names,
            class_values
        )
    )

    # Sort by absolute contribution
    contributions.sort(
        key=lambda x: abs(x[1]),
        reverse=True
    )

    top_contributors = []

    for feature, value in contributions[:10]:

        top_contributors.append({
            "feature": feature,
            "impact": float(value),
            "direction": (
                 "contributes toward predicted class"
                if value > 0
                else "contributes away from predicted class"
            )
        })

    return {
        "risk_level": risk_labels[int(prediction)],
        "prediction_class": int(prediction),
        "top_contributors": top_contributors
    }