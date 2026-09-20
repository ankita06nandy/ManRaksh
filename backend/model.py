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
# PREDICTION
# ==========================================

def predict_risk(data):
    """
    Predict the personnel group using the
    trained XGBoost model.

    Group 1, Group 2 and Group 3 are the
    original groups present in the dataset.
    """

    model = load_model()

    # Convert API data into the exact column
    # names expected by the trained model.

    input_data = pd.DataFrame([{
        "Age": data["Age"],
        "Gender": data["Gender"],
        "AvegWklyFreqWExerc": data["AvegWklyFreqWExerc"],
        "AvegDuratEcerc": data["AvegDuratEcerc"],
        "Intensity": data["Intensity"],
        "LivinPlace": data["LivinPlace"],
        "RelatshpStatus": data["RelatshpStatus"],

        " Self Regulation": data["Self_Regulation"],
        " Anxiety/Worry Control": data["Anxiety_Worry_Control"],
        "Relationship Stability": data["Relationship_Stability"],
        "Adaptibility to Environment": data["Adaptibility_to_Environment"],
        "Task Persistent": data["Task_Persistent"],
        "Stress Recovery": data["Stress_Recovery"],

        "Unexpected Stress": data["Unexpected_Stress"],
        "Lack of Control": data["Lack_of_Control"],
        "Anxiety": data["Anxiety"],
        "Overwhelmed": data["Overwhelmed"],
        "Irritability": data["Irritability"],
        "Confidence": data["Confidence"],
        "Efficiency": data["Efficiency"],
        "Situation Mastery": data["Situation_Mastery"],
        "Operation Control": data["Operation_Control"],
        "Accumulated Pressure": data["Accumulated_Pressure"],

        "High BP": data["High_BP"],
        "Blood Sugar": data["Blood_Sugar"],
        "Hyperlipidimia": data["Hyperlipidimia"],
        "Heart Disease": data["Heart_Disease"],
        "Sleep Disorder": data["Sleep_Disorder"],
        "Chronic Bronchitis": data["Chronic_Bronchitis"],
        "Migraine": data["Migraine"],
        "High BMI": data["High_BMI"],
        "Atherosclerosis": data["Atherosclerosis"],
        "Pneumonia": data["Pneumonia"]
    }])

    prediction = model.predict(input_data)[0]

    probabilities = model.predict_proba(input_data)[0]

    group_labels = {
        0: "Group 1",
        1: "Group 2",
        2: "Group 3"
    }

    return {
        "group": group_labels[int(prediction)],
        "probabilities": {
            "group_1": float(probabilities[0]),
            "group_2": float(probabilities[1]),
            "group_3": float(probabilities[2])
        }
    }