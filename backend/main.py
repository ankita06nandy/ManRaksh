from fastapi import FastAPI

app = FastAPI(
    title="ManRaksha API",
    description="AI-Based Predictive Personnel Stress & Welfare Monitoring System",
    version="1.0.0"
)


@app.get("/")
def root():
    return {
        "message": "ManRaksha Backend is running!"
    }


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }