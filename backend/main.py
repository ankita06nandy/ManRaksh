from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from model import predict_risk
from explain import explain_prediction
from schemas import PersonnelData

from database import engine, Base
from models import User

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="ManRaksh API",
    description="AI-Based Predictive Personnel Stress & Welfare Monitoring System",
    version="2.0.0"
)


# ==========================================
# CORS
# ==========================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://manraksh.vercel.app"
    ],
    allow_origin_regex=r"http://(localhost|127\.0\.0\.1):\d+",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==========================================
# ROOT
# ==========================================

@app.get("/")
def root():
    return {
        "message": "ManRaksh Backend is running!"
    }


# ==========================================
# HEALTH CHECK
# ==========================================

@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }


# ==========================================
# PERSONNEL PREDICTION
# ==========================================

@app.post("/predict")
def predict(data: PersonnelData):

    personnel_data = data.model_dump()

    prediction = predict_risk(personnel_data)

    explanation = explain_prediction(personnel_data)

    return {
        "group": prediction["group"],
        "probabilities": prediction["probabilities"],
        "top_contributors": explanation["top_contributors"]
    }