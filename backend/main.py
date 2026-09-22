from fastapi import FastAPI, Depends, Header, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

from model import predict_risk
from explain import explain_prediction
from schemas import PersonnelData

from database import engine, Base
from models import User, Assessment

from sqlalchemy.orm import Session
from database import get_db
from auth import hash_password, verify_password, create_access_token, verify_token, security
from datetime import datetime, timedelta
from collections import Counter
from functools import lru_cache
from pathlib import Path
import pandas as pd
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="ManRaksh API",
    description="AI-Based Predictive Personnel Stress & Welfare Monitoring System",
    version="2.0.0"
)

DATASET_PATH = Path(__file__).parent / "dataset" / "stress_data.xlsx"


@lru_cache(maxsize=1)
def load_dataset_summary():
    dataset = pd.read_excel(DATASET_PATH, usecols=["Groups"])
    groups = dataset["Groups"].value_counts().to_dict()
    return {
        "total": int(len(dataset)),
        "low": int(groups.get(1, 0)),
        "moderate": int(groups.get(2, 0)),
        "elevated": int(groups.get(3, 0)),
    }


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


@app.post("/register")
def register(
    email: str,
    password: str,
    role: str = Header("personnel", alias="X-Account-Role", pattern="^(personnel|welfare|admin)$"),
    db: Session = Depends(get_db)
):
    existing_user = db.query(User).filter(User.email == email).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email already registered"
        )

    hashed_password = hash_password(password)

    new_user = User(
        email=email,
        password_hash=hashed_password,
        role=role
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "User registered successfully",
        "user_id": new_user.id
    }
from auth import hash_password, verify_password, create_access_token

@app.post("/login")
def login(
    email: str,
    password: str,
    db: Session = Depends(get_db)
):
    user = db.query(User).filter(User.email == email).first()

    if not user or not verify_password(password, user.password_hash):
        raise HTTPException(
            status_code=401,
            detail="Invalid email or password"
        )

    access_token = create_access_token({
        "sub": str(user.id),
        "role": user.role
    })

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "role": user.role,
        },
    }

@app.get("/protected")
def protected_route(
    credentials = Depends(security)
):
    payload = verify_token(credentials)

    return {
        "message": "You are authenticated!",
        "user_id": payload.get("sub"),
        "role": payload.get("role")
    }

# ==========================================
# PERSONNEL PREDICTION
# ==========================================

@app.post("/predict")
def predict(
    data: PersonnelData,
    credentials=Depends(security),
    db: Session = Depends(get_db)
):
    payload = verify_token(credentials)

    personnel_data = data.model_dump()
    prediction = predict_risk(personnel_data)
    explanation = explain_prediction(personnel_data)

    probabilities = prediction["probabilities"]
    db.add(Assessment(
        user_id=int(payload["sub"]),
        group=prediction["group"],
        group_1_probability=probabilities["group_1"],
        group_2_probability=probabilities["group_2"],
        group_3_probability=probabilities["group_3"],
        top_contributors=explanation["top_contributors"],
    ))
    db.commit()

    return {
        "group": prediction["group"],
        "probabilities": prediction["probabilities"],
        "top_contributors": explanation["top_contributors"]
    }


@app.get("/personnel/latest-assessment")
def latest_assessment(credentials=Depends(security), db: Session = Depends(get_db)):
    payload = verify_token(credentials)
    assessment = (
        db.query(Assessment)
        .filter(Assessment.user_id == int(payload["sub"]))
        .order_by(Assessment.created_at.desc())
        .first()
    )

    if not assessment:
        raise HTTPException(status_code=404, detail="No assessment submitted yet")

    return {
        "group": assessment.group,
        "probabilities": {
            "group_1": assessment.group_1_probability,
            "group_2": assessment.group_2_probability,
            "group_3": assessment.group_3_probability,
        },
        "top_contributors": assessment.top_contributors,
        "created_at": assessment.created_at,
    }


@app.get("/dashboard/summary")
def dashboard_summary(credentials=Depends(security), db: Session = Depends(get_db)):
    payload = verify_token(credentials)
    if payload.get("role") not in {"welfare", "admin"}:
        raise HTTPException(status_code=403, detail="Dashboard access is restricted")

    dataset_summary = load_dataset_summary()
    welfare_officer_count = db.query(User).filter(User.role == "welfare").count()
    active_user_count = db.query(User).count()
    assessments = db.query(Assessment).order_by(Assessment.created_at.desc()).all()
    submitted_count = len(assessments)
    personnel_count = dataset_summary["total"] + submitted_count
    groups = Counter(assessment.group for assessment in assessments)

    cutoff = datetime.utcnow() - timedelta(days=30)
    recent_assessments = [
        assessment for assessment in assessments
        if assessment.created_at and assessment.created_at >= cutoff
    ]
    trend = []
    for day_offset in range(29, -1, -1):
        day = (datetime.utcnow() - timedelta(days=day_offset)).date()
        trend.append(sum(
            1 for assessment in recent_assessments
            if assessment.created_at.date() == day
        ))

    priority = [
        {
            "id": f"P{assessment.user_id:04d}",
            "risk": {
                "Group 1": "Low",
                "Group 2": "Moderate",
                "Group 3": "Elevated",
            }.get(assessment.group, assessment.group),
            "reason": "Latest wellbeing assessment",
        }
        for assessment in assessments[:4]
    ]
    factors = []
    for assessment in assessments:
        factors.extend(assessment.top_contributors or [])
    factor_counts = Counter(item.get("feature", "Assessment factor") for item in factors)

    return {
        "personnel_count": personnel_count,
        "welfare_officer_count": welfare_officer_count,
        "active_user_count": active_user_count,
        "total": dataset_summary["total"] + submitted_count,
        "low": dataset_summary["low"] + groups.get("Group 1", 0),
        "moderate": dataset_summary["moderate"] + groups.get("Group 2", 0),
        "elevated": dataset_summary["elevated"] + groups.get("Group 3", 0),
        "trend": trend,
        "priority": priority,
        "factors": [
            {"name": name, "impact": f"{count} assessment(s)"}
            for name, count in factor_counts.most_common(3)
        ],
    }