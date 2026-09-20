import pandas as pd
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

print("Loading updated dataset...")

df = pd.read_excel(DATA_PATH)

print(f"Dataset shape: {df.shape}")


# ==========================================
# TARGET
# ==========================================

# Groups is the existing 3-class grouping
# provided in the updated dataset.
#
# We do NOT rename these groups as Low /
# Moderate / High because the dataset does
# not provide an official mapping.

target_column = "Groups"

print("\nGroup distribution:")
print(df[target_column].value_counts().sort_index())


# ==========================================
# SELECT FEATURES
# ==========================================

feature_columns = [
    "Age",
    "Gender",
    "AvegWklyFreqWExerc",
    "AvegDuratEcerc",
    "Intensity",
    "LivinPlace",
    "RelatshpStatus",

    " Self Regulation",
    " Anxiety/Worry Control",
    "Relationship Stability",
    "Adaptibility to Environment",
    "Task Persistent",
    "Stress Recovery",

    "Unexpected Stress",
    "Lack of Control",
    "Anxiety",
    "Overwhelmed",
    "Irritability",
    "Confidence",
    "Efficiency",
    "Situation Mastery",
    "Operation Control",
    "Accumulated Pressure",

    "High BP",
    "Blood Sugar",
    "Hyperlipidimia",
    "Heart Disease",
    "Sleep Disorder",
    "Chronic Bronchitis",
    "Migraine",
    "High BMI",
    "Atherosclerosis",
    "Pneumonia"
]


X = df[feature_columns].copy()
y = df[target_column].copy()


# ==========================================
# CONVERT TARGET TO 0, 1, 2
# ==========================================

# XGBoost multiclass classification expects
# class labels starting from 0.

group_mapping = {
    1: 0,
    2: 1,
    3: 2
}

y = y.map(group_mapping)


if y.isna().any():
    raise ValueError("Unexpected value found in Groups column.")


# ==========================================
# CATEGORICAL FEATURES
# ==========================================

categorical_features = [
    "Gender",
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


print("\nTraining XGBoost model...")

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
            "Group 1",
            "Group 2",
            "Group 3"
        ]
    )
)


print("\nConfusion Matrix:")

print(
    confusion_matrix(
        y_test,
        y_pred
    )
)


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