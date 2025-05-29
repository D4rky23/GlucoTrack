from pydantic import BaseModel, Field
from typing import List, Optional, Literal
from datetime import datetime

class HealthStatus(BaseModel):
    status: str

class ReadinessStatus(BaseModel):
    ready: bool
    model_loaded: bool
    scaler_loaded: bool
    message: Optional[str] = None

class InputFeatures(BaseModel):
    gender: Literal["Male", "Female"] = Field(..., description="Patient gender")
    age: float = Field(..., ge=0, le=120, description="Patient age in years")
    hypertension: int = Field(..., ge=0, le=1, description="1 if patient has hypertension, 0 otherwise")
    heart_disease: int = Field(..., ge=0, le=1, description="1 if patient has heart disease, 0 otherwise") 
    smoking_history: Literal["never", "No Info", "current", "former", "ever", "not current"] = Field(..., description="Smoking history")
    bmi: float = Field(..., ge=10, le=80, description="Body Mass Index")
    HbA1c_level: float = Field(..., ge=3.5, le=15, description="Hemoglobin A1c level")
    blood_glucose_level: float = Field(..., ge=50, le=400, description="Blood glucose level")

class PredictionResult(BaseModel):
    risk: int = Field(..., description="Diabetes risk: 0 (low) or 1 (high)")
    probability: float = Field(..., ge=0, le=1, description="Probability of diabetes (0-1)")
    model_version: str = Field(..., description="Model version used for prediction")

class BatchPredictionRequest(BaseModel):
    data: List[InputFeatures] = Field(..., description="List of patient data for batch prediction")

class BatchPredictionResponse(BaseModel):
    results: List[PredictionResult] = Field(..., description="Prediction results for each patient")
    processed_count: int = Field(..., description="Number of patients processed")

class ModelInfo(BaseModel):
    algorithm: str = Field(..., description="ML algorithm used")
    trained_at: datetime = Field(..., description="Model training timestamp")
    roc_auc: float = Field(..., description="ROC AUC score")
    features: int = Field(..., description="Number of features")
    version: str = Field(..., description="Model version")

class ModelMetrics(BaseModel):
    accuracy: float
    precision: float
    recall: float
    f1_score: float
    roc_auc: float
    confusion_matrix: List[List[int]]

class FeatureInfo(BaseModel):
    name: str
    type: str
    required: bool
    min_value: Optional[float] = None
    max_value: Optional[float] = None
    allowed_values: Optional[List[str]] = None

class FeaturesResponse(BaseModel):
    features: List[FeatureInfo]

class ValidationResult(BaseModel):
    valid: bool
    errors: List[str] = []
    warnings: List[str] = []

class ErrorModel(BaseModel):
    detail: str
