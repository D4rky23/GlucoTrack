from fastapi import APIRouter
from models.health import HealthStatus, ReadinessStatus
from services.health_service import HealthService

router = APIRouter()

@router.get("/health", response_model=HealthStatus)
def health_check():
    """Basic health check - returns OK if service is running"""
    status = HealthService.get_health_status()
    return HealthStatus(status=status)

@router.get("/ready", response_model=ReadinessStatus)
def readiness_check():
    """Readiness check - returns status of model and scaler loading"""
    return HealthService.get_readiness_status()
