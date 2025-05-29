from fastapi import APIRouter, HTTPException
from models.health import InputFeatures, ValidationResult
from services.validation_service import ValidationService
from typing import List
import logging

logger = logging.getLogger(__name__)
router = APIRouter()

@router.post("/data/validate", response_model=ValidationResult)
def validate_patient_data(features: InputFeatures):
    """
    Validate patient data without making predictions
    
    Useful for providing inline validation feedback in forms
    
    - **features**: Patient health data to validate
    - **returns**: Validation result with errors and warnings
    """
    try:
        return ValidationService.validate_features(features)
    except Exception as e:
        logger.error(f"Validation error: {e}")
        raise HTTPException(status_code=500, detail="Error during data validation")

@router.post("/data/validate-batch", response_model=List[ValidationResult])
def validate_batch_data(features_list: List[InputFeatures]):
    """
    Validate multiple patient records
    
    - **features_list**: List of patient health data to validate
    - **returns**: List of validation results
    """
    try:
        if not features_list:
            raise HTTPException(status_code=422, detail="Empty data list provided")
        
        if len(features_list) > 1000:  # Limit batch size
            raise HTTPException(
                status_code=422, 
                detail="Batch size too large - maximum 1000 patients per request"
            )
        
        return ValidationService.validate_batch(features_list)
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Batch validation error: {e}")
        raise HTTPException(status_code=500, detail="Error during batch validation")
