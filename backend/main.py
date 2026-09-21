from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from model import predict_risk
from explain import explain_prediction
from schemas import PersonnelData

from database import engine, Base
from models import User

from sqlalchemy.orm import Session
from database import get_db
from auth import hash_password, verify_password, create_access_token, verify_token, security
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


@app.post("/register")
def register(
    email: str,
    password: str,
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
        role="personnel"
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
        "token_type": "bearer"
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
    credentials=Depends(security)
):
    verify_token(credentials)

    personnel_data = data.model_dump()
    prediction = predict_risk(personnel_data)
    explanation = explain_prediction(personnel_data)

    return {
        "group": prediction["group"],
        "probabilities": prediction["probabilities"],
        "top_contributors": explanation["top_contributors"]
    }

    personnel_data = data.model_dump()

    prediction = predict_risk(personnel_data)

    explanation = explain_prediction(personnel_data)

    return {
        "group": prediction["group"],
        "probabilities": prediction["probabilities"],
        "top_contributors": explanation["top_contributors"]
    }