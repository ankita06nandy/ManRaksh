import os
import joblib
import pandas as pd

from xgboost import XGBClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report


# -----------------------------
# 1. Load Dataset
# -----------------------------

DATA_PATH = "dataset/stress_data.csv"

data = pd.read_csv(DATA_PATH)

print("Dataset loaded successfully!")
print("Dataset shape:", data.shape)


# -----------------------------
# 2. Separate Features & Target
# -----------------------------

X = data.drop("risk_level", axis=1)
y = data["risk_level"]


# -----------------------------
# 3. Split Dataset
# -----------------------------

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.2,
    random_state=42,
    stratify=y
)


# -----------------------------
# 4. Create XGBoost Model
# -----------------------------

model = XGBClassifier(
    n_estimators=200,
    max_depth=5,
    learning_rate=0.05,
    subsample=0.8,
    colsample_bytree=0.8,
    objective="multi:softprob",
    num_class=3,
    eval_metric="mlogloss",
    random_state=42
)


# -----------------------------
# 5. Train Model
# -----------------------------

print("\nTraining XGBoost model...")

model.fit(X_train, y_train)

print("Model training completed!")


# -----------------------------
# 6. Evaluate Model
# -----------------------------

predictions = model.predict(X_test)

accuracy = accuracy_score(y_test, predictions)

print("\nModel Accuracy:", round(accuracy * 100, 2), "%")

print("\nClassification Report:")
print(
    classification_report(
        y_test,
        predictions,
        target_names=[
            "Low Risk",
            "Moderate Risk",
            "High Risk"
        ]
    )
)


# -----------------------------
# 7. Save Trained Model
# -----------------------------

os.makedirs("models", exist_ok=True)

MODEL_PATH = "models/xgboost_model.pkl"

joblib.dump(model, MODEL_PATH)

print("\nModel saved successfully!")
print("Saved at:", MODEL_PATH)