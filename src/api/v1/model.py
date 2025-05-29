from fastapi import APIRouter, HTTPException, Depends
from models.meta import ModelInfo, ModelMetrics, FeaturesResponse, ReloadResponse
from services.model_service import ModelService
from repositories.model_repository import ModelRepository
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

def get_model_loaded():
    """Dependency to ensure model is loaded for info endpoints"""
    ModelRepository.load_model()  # Attempt to load if not already loaded
    return True

@router.get("/model/info", response_model=ModelInfo)
def get_model_info(_: bool = Depends(get_model_loaded)):
    """
    Get model metadata and information
    
    - **returns**: Model algorithm, training date, performance metrics, version
    """
    try:
        return ModelService.get_model_info()
    except Exception as e:
        logger.error(f"Error getting model info: {e}")
        raise HTTPException(status_code=500, detail="Error retrieving model information")

@router.get("/model/feature-names", response_model=FeaturesResponse)
def get_feature_names():
    """
    Get feature names and their specifications
    
    - **returns**: List of features with types, constraints, and allowed values
    """
    try:
        return ModelService.get_feature_names()
    except Exception as e:
        logger.error(f"Error getting feature names: {e}")
        raise HTTPException(status_code=500, detail="Error retrieving feature information")

@router.get("/model/metrics", response_model=ModelMetrics)
def get_model_metrics(_: bool = Depends(get_model_loaded)):
    """
    Get detailed model performance metrics
    
    - **returns**: Accuracy, precision, recall, F1-score, ROC-AUC, confusion matrix
    """
    try:
        return ModelService.get_model_metrics()
    except Exception as e:
        logger.error(f"Error getting model metrics: {e}")
        raise HTTPException(status_code=500, detail="Error retrieving model metrics")

@router.post("/model/reload", response_model=ReloadResponse)
def reload_model():
    """
    Force reload of model and scaler from disk (Admin endpoint)
    
    - **returns**: Success status and new model version
    """
    try:
        return ModelService.reload_model()
    except Exception as e:
        logger.error(f"Error reloading model: {e}")
        raise HTTPException(status_code=500, detail="Error reloading model")
