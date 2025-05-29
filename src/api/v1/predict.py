from fastapi import APIRouter, HTTPException, Depends
from models.health import InputFeatures, PredictionResult
from models.batch import BatchPredictionRequest, BatchPredictionResponse
from services.prediction_service import PredictionService
from repositories.model_repository import ModelRepository
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

def get_model_ready():
    """Dependency to ensure model is ready before predictions"""
    if not ModelRepository.is_ready():
        raise HTTPException(
            status_code=503, 
            detail="Model or scaler not loaded - service not ready"
        )
    return True

@router.post("/predict", response_model=PredictionResult)
def predict_diabetes(
    features: InputFeatures,
    _: bool = Depends(get_model_ready)
):
    """
    Predict diabetes risk for a single patient
    
    - **features**: Patient health data including age, BMI, glucose levels, etc.
    - **returns**: Risk score (0 or 1) and probability (0-1)
    """
    try:
        result = PredictionService.predict_single(features)
        return result
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        logger.error(f"Prediction error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error during prediction")

@router.post("/batch-predict", response_model=BatchPredictionResponse)
def batch_predict_diabetes(
    request: BatchPredictionRequest,
    _: bool = Depends(get_model_ready)
):
    """
    Predict diabetes risk for multiple patients
    
    - **request**: List of patient health data
    - **returns**: List of predictions with processing statistics
    """
    try:
        if not request.data:
            raise HTTPException(status_code=422, detail="Empty data list provided")
        
        if len(request.data) > 1000:  # Limit batch size
            raise HTTPException(
                status_code=422, 
                detail="Batch size too large - maximum 1000 patients per request"
            )
        
        result = PredictionService.predict_batch(request)
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Batch prediction error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error during batch prediction")
