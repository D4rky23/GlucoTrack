from fastapi import APIRouter
from models.health import HealthStatus
from services.health_service import HealthService

router = APIRouter()

@router.get("/health", response_model=HealthStatus)
def health_check():
    status = HealthService.get_health_status()
    return HealthStatus(status=status)
