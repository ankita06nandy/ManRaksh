from sqlalchemy import Column, Integer, String, DateTime, Float, JSON
from datetime import datetime

from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    role = Column(String, default="personnel", nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class Assessment(Base):
    __tablename__ = "assessments"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, nullable=False, index=True)
    group = Column(String, nullable=False, index=True)
    group_1_probability = Column(Float, nullable=False)
    group_2_probability = Column(Float, nullable=False)
    group_3_probability = Column(Float, nullable=False)
    top_contributors = Column(JSON, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, index=True)