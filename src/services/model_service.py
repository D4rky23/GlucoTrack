from models.meta import ModelInfo, ModelMetrics, FeaturesResponse, FeatureInfo, ReloadResponse
from repositories.model_repository import ModelRepository
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

class ModelService:
    """Service for model metadata and management operations"""
    
    @staticmethod
    def get_model_info() -> ModelInfo:
        """Get model information"""
        info = ModelRepository.get_model_info()
        return ModelInfo(**info)
    
    @staticmethod
    def get_model_metrics() -> ModelMetrics:
        """Get model performance metrics"""
        metrics = ModelRepository.get_model_metrics()
        return ModelMetrics(**metrics)
    
    @staticmethod
    def get_feature_names() -> FeaturesResponse:
        """Get feature names and their specifications"""
        features = [
            FeatureInfo(
                name="gender",
                type="categorical",
                required=True,
                allowed_values=["Male", "Female"]
            ),
            FeatureInfo(
                name="age",
                type="numeric",
                required=True,
                min_value=0,
                max_value=120
            ),
            FeatureInfo(
                name="hypertension",
                type="binary",
                required=True,
                min_value=0,
                max_value=1
            ),
            FeatureInfo(
                name="heart_disease",
                type="binary",
                required=True,
                min_value=0,
                max_value=1
            ),
            FeatureInfo(
                name="smoking_history",
                type="categorical",
                required=True,
                allowed_values=["never", "No Info", "current", "former", "ever", "not current"]
            ),
            FeatureInfo(
                name="bmi",
                type="numeric",
                required=True,
                min_value=10,
                max_value=80
            ),
            FeatureInfo(
                name="HbA1c_level",
                type="numeric",
                required=True,
                min_value=3.5,
                max_value=15
            ),
            FeatureInfo(
                name="blood_glucose_level",
                type="numeric",
                required=True,
                min_value=50,
                max_value=400
            )
        ]
        
        return FeaturesResponse(features=features)
    
    @staticmethod
    def reload_model() -> ReloadResponse:
        """Reload model and scaler from disk"""
        try:
            success = ModelRepository.reload_model()
            if success:
                model_info = ModelRepository.get_model_info()
                return ReloadResponse(
                    success=True,
                    message="Model and scaler reloaded successfully",
                    model_version=model_info["version"]
                )
            else:
                return ReloadResponse(
                    success=False,
                    message="Failed to reload model or scaler"
                )
        except Exception as e:
            logger.error(f"Error reloading model: {e}")
            return ReloadResponse(
                success=False,
                message=f"Error reloading model: {str(e)}"
            )
