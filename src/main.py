from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.v1.health import router as health_router
from api.v1.predict import router as predict_router
from api.v1.model import router as model_router
from api.v1.validate import router as validate_router
import logging

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="GlucoTrack API",
    description="Diabetes risk prediction API using machine learning",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # React dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers with v1 prefix
app.include_router(health_router, prefix="/api/v1", tags=["Health"])
app.include_router(predict_router, prefix="/api/v1", tags=["Predictions"])
app.include_router(model_router, prefix="/api/v1", tags=["Model"])
app.include_router(validate_router, prefix="/api/v1", tags=["Validation"])

@app.get("/")
def read_root():
    """Root endpoint with API information"""
    return {
        "message": "GlucoTrack API v1.0",
        "description": "Diabetes risk prediction using machine learning",
        "docs": "/docs",
        "health": "/api/v1/health",
        "ready": "/api/v1/ready"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
