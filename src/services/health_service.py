from repositories.health_repository import HealthRepository
from repositories.model_repository import ModelRepository
from models.health import ReadinessStatus

class HealthService:
    @staticmethod
    def get_health_status():
        return HealthRepository.get_status()
    
    @staticmethod
    def get_readiness_status() -> ReadinessStatus:
        """Check if the service is ready to handle predictions"""
        status = ModelRepository.get_readiness_status()
        return ReadinessStatus(**status)
