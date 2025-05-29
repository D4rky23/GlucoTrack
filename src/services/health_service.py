from repositories.health_repository import HealthRepository

class HealthService:
    @staticmethod
    def get_health_status():
        return HealthRepository.get_status()
