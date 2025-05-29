from models.health import InputFeatures, ValidationResult
from typing import List
import logging

logger = logging.getLogger(__name__)

class ValidationService:
    """Service for validating input data without making predictions"""
    
    @staticmethod
    def validate_features(features: InputFeatures) -> ValidationResult:
        """Validate input features against schema and business rules"""
        errors = []
        warnings = []
        
        try:
            # Basic Pydantic validation already happened if we got here
            # Add additional business rule validations
            
            # Age validation
            if features.age < 18:
                warnings.append("Patient is under 18 years old")
            elif features.age > 100:
                warnings.append("Patient is over 100 years old - verify data accuracy")
            
            # BMI validation
            if features.bmi < 15:
                warnings.append("BMI is very low (< 15) - check measurement accuracy")
            elif features.bmi > 50:
                warnings.append("BMI is very high (> 50) - verify measurement")
            
            # Blood glucose validation
            if features.blood_glucose_level < 70:
                warnings.append("Blood glucose level is low - patient might be hypoglycemic")
            elif features.blood_glucose_level > 300:
                warnings.append("Blood glucose level is very high - immediate medical attention may be needed")
            
            # HbA1c validation
            if features.HbA1c_level > 10:
                warnings.append("HbA1c level is very high - indicates poor glucose control")
            
            # Logical consistency checks
            if features.age < 30 and features.heart_disease == 1:
                warnings.append("Heart disease in patient under 30 is uncommon - verify data")
            
            if features.age < 25 and features.hypertension == 1:
                warnings.append("Hypertension in patient under 25 is uncommon - verify data")
            
            return ValidationResult(
                valid=len(errors) == 0,
                errors=errors,
                warnings=warnings
            )
            
        except Exception as e:
            logger.error(f"Error during validation: {e}")
            errors.append(f"Validation error: {str(e)}")
            return ValidationResult(
                valid=False,
                errors=errors,
                warnings=warnings
            )
    
    @staticmethod
    def validate_batch(features_list: List[InputFeatures]) -> List[ValidationResult]:
        """Validate a batch of input features"""
        results = []
        for features in features_list:
            result = ValidationService.validate_features(features)
            results.append(result)
        return results
