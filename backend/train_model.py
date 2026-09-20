import pandas as pd
import numpy as np
import joblib

from pathlib import Path

from sklearn.model_selection import train_test_split, StratifiedKFold, cross_val_score
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder
from sklearn.pipeline import Pipeline
from sklearn.metrics import (
    classification_report,
    confusion_matrix,
    accuracy_score,
    f1_score
)

from xgboost import XGBClassifier


# ==========================================
# PATHS
# ==========================================

BASE_DIR = Path(__file__).parent
DATA_PATH = BASE_DIR / "dataset" / "stress_data.xlsx"
MODEL_DIR = BASE_DIR / "models"
MODEL_PATH = MODEL_DIR / "xgboost_model.pkl"


# ==========================================
# LOAD DATA
# ==========================================

print("Loading dataset...")

df = pd.read_excel(DATA_PATH)

print(f"Dataset shape: {df.shape}")


# ==========================================
# CREATE STRESS RISK TARGET
# ==========================================

def classify_risk(score):
    if score <= 23:
        return 0       # Low Risk
    elif score <= 36:
        return 1       # Moderate Risk
    else:
        return 2       # High Risk


df["risk_level"] = df["PercStressTotatl"].apply(classify_risk)


print("\nRisk distribution:")
print(df["risk_level"].value_counts().sort_index())


# ==========================================
# SELECT FEATURES
# ==========================================

# We deliberately exclude PS1-PS10 because
# PercStressTotatl is calculated from them.
#
# We also exclude the calculated totals to
# reduce data leakage.

feature_columns = [
    "AvegDuratEcerc",
    "Intensity",
    "LivinPlace",
    "RelatshpStatus",

    "EAI1",
    "EAI2",
    "EAI3",
    "EAI4",
    "EAI5",
    "EAI6",

    "EDS1",
    "EDS2",
    "EDS3",
    "EDS4",
    "EDS5",
    "EDS6",
    "EDS7",
    "EDS8",
    "EDS9",
    "EDS10",
    "EDS11",
    "EDS12",
    "EDS13",
    "EDS14",
    "ESD15",
    "EDS16",
    "EDS17",
    "EDS18",
    "EDS19",
    "EDS20",
    "EDS21"
]


X = df[feature_columns]
y = df["risk_level"]


# ==========================================
# CATEGORICAL FEATURES
# ==========================================

categorical_features = [
    "LivinPlace",
    "RelatshpStatus"
]

numeric_features = [
    column for column in feature_columns
    if column not in categorical_features
]


# ==========================================
# PREPROCESSING
# ==========================================

preprocessor = ColumnTransformer(
    transformers=[
        (
            "categorical",
            OneHotEncoder(
                handle_unknown="ignore",
                sparse_output=False
            ),
            categorical_features
        ),
        (
            "numeric",
            "passthrough",
            numeric_features
        )
    ]
)


# ==========================================
# XGBOOST MODEL
# ==========================================

xgb_model = XGBClassifier(
    n_estimators=300,
    max_depth=5,
    learning_rate=0.05,
    subsample=0.8,
    colsample_bytree=0.8,

    objective="multi:softprob",
    num_class=3,

    eval_metric="mlogloss",

    random_state=42
)


# ==========================================
# COMPLETE ML PIPELINE
# ==========================================

pipeline = Pipeline(
    steps=[
        ("preprocessor", preprocessor),
        ("classifier", xgb_model)
    ]
)


# ==========================================
# TRAIN / TEST SPLIT
# ==========================================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    stratify=y,
    random_state=42
)


print("\nTraining model...")

pipeline.fit(X_train, y_train)


# ==========================================
# TEST SET EVALUATION
# ==========================================

y_pred = pipeline.predict(X_test)


accuracy = accuracy_score(y_test, y_pred)
macro_f1 = f1_score(
    y_test,
    y_pred,
    average="macro"
)


print("\n==========================================")
print("TEST SET RESULTS")
print("==========================================")

print(f"Accuracy : {accuracy:.4f}")
print(f"Macro F1 : {macro_f1:.4f}")

print("\nClassification Report:")
print(
    classification_report(
        y_test,
        y_pred,
        target_names=[
            "Low Risk",
            "Moderate Risk",
            "High Risk"
        ]
    )
)


print("\nConfusion Matrix:")
print(confusion_matrix(y_test, y_pred))


# ==========================================
# 5-FOLD CROSS VALIDATION
# ==========================================

print("\n==========================================")
print("5-FOLD CROSS VALIDATION")
print("==========================================")

cv = StratifiedKFold(
    n_splits=5,
    shuffle=True,
    random_state=42
)

cv_accuracy = cross_val_score(
    pipeline,
    X,
    y,
    cv=cv,
    scoring="accuracy"
)

cv_f1 = cross_val_score(
    pipeline,
    X,
    y,
    cv=cv,
    scoring="f1_macro"
)


print(
    f"Cross-validation Accuracy: "
    f"{cv_accuracy.mean():.4f} ± {cv_accuracy.std():.4f}"
)

print(
    f"Cross-validation Macro F1: "
    f"{cv_f1.mean():.4f} ± {cv_f1.std():.4f}"
)


# ==========================================
# SAVE MODEL
# ==========================================

MODEL_DIR.mkdir(
    parents=True,
    exist_ok=True
)

joblib.dump(
    pipeline,
    MODEL_PATH
)


print("\n==========================================")
print("MODEL SAVED")
print("==========================================")

print(f"Saved to: {MODEL_PATH}")