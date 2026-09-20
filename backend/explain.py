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
# HUMAN-READABLE FEATURE NAMES
# ==========================================

feature_name_map = {
    "numeric__Age": "Age",
    "numeric__AvegWklyFreqWExerc": "Weekly Exercise Frequency",
    "numeric__AvegDuratEcerc": "Average Exercise Duration",
    "numeric__Intensity": "Duty/Work Intensity",

    "numeric__ Self Regulation": "Self Regulation",
    "numeric__ Anxiety/Worry Control": "Anxiety/Worry Control",
    "numeric__Relationship Stability": "Relationship Stability",
    "numeric__Adaptibility to Environment": "Adaptibility to Environment",
    "numeric__Task Persistent": "Task Persistent",
    "numeric__Stress Recovery": "Stress Recovery",

    "numeric__Unexpected Stress": "Unexpected Stress",
    "numeric__Lack of Control": "Lack of Control",
    "numeric__Anxiety": "Anxiety",
    "numeric__Overwhelmed": "Overwhelmed",
    "numeric__Irritability": "Irritability",
    "numeric__Confidence": "Confidence",
    "numeric__Efficiency": "Efficiency",
    "numeric__Situation Mastery": "Situation Mastery",
    "numeric__Operation Control": "Operation Control",
    "numeric__Accumulated Pressure": "Accumulated Pressure",

    "numeric__High BP": "High BP",
    "numeric__Blood Sugar": "Blood Sugar",
    "numeric__Hyperlipidimia": "Hyperlipidimia",
    "numeric__Heart Disease": "Heart Disease",
    "numeric__Sleep Disorder": "Sleep Disorder",
    "numeric__Chronic Bronchitis": "Chronic Bronchitis",
    "numeric__Migraine": "Migraine",
    "numeric__High BMI": "High BMI",
    "numeric__Atherosclerosis": "Atherosclerosis",
    "numeric__Pneumonia": "Pneumonia",
    # One-hot encoded categorical features
    "categorical__Gender_1": "Gender",
    "categorical__RelatshpStatus_3": "Relationship Status",
}


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

    data must contain the same API input fields
    used by model.py.
    """

    # Convert API field names into the exact
    # dataset column names used by the model.

    input_data = {
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
        "Pneumonia": data["Pneumonia"],
    }

    input_df = pd.DataFrame([input_data])

    # Transform using the same preprocessing
    # used during model training.
    transformed_data = preprocessor.transform(input_df)

    # Generate SHAP values.
    shap_values = explainer.shap_values(transformed_data)

    prediction = model.predict(transformed_data)[0]

    group_labels = {
        0: "Group 1",
        1: "Group 2",
        2: "Group 3"
    }

    # ==========================================
    # HANDLE MULTICLASS SHAP OUTPUT
    # ==========================================

    if isinstance(shap_values, list):

        class_values = shap_values[int(prediction)][0]

    else:

        shap_array = shap_values

        if len(shap_array.shape) == 3:

            class_values = shap_array[0, :, int(prediction)]

        else:

            class_values = shap_array[0]


    # ==========================================
    # PAIR FEATURES WITH SHAP VALUES
    # ==========================================

    contributions = list(
        zip(
            feature_names,
            class_values
        )
    )


    # Sort by absolute contribution.
    contributions.sort(
        key=lambda x: abs(x[1]),
        reverse=True
    )


    # ==========================================
    # TOP CONTRIBUTORS
    # ==========================================

    top_contributors = []

    for feature, value in contributions[:10]:

        readable_feature = feature_name_map.get(
            feature,
            feature.replace("numeric__", "")
                  .replace("categorical__", "")
        )

        top_contributors.append({
            "feature": readable_feature,
            "impact": float(value),
            "direction": (
                "contributes toward predicted class"
                if value > 0
                else "contributes away from predicted class"
            )
        })


    # ==========================================
    # FINAL RESPONSE
    # ==========================================

    return {
        "group": group_labels[int(prediction)],
        "prediction_class": int(prediction),
        "top_contributors": top_contributors
    }