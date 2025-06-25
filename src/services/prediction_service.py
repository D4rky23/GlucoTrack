import pandas as pd
import numpy as np
from typing import List, Dict, Any
from models.health import InputFeatures, PredictionResult
from models.batch import BatchPredictionRequest, BatchPredictionResponse
from repositories.model_repository import ModelRepository
import logging
import time
import uuid

logger = logging.getLogger(__name__)

class PredictionService:
    """Service for handling diabetes predictions"""
    
    @staticmethod
    def preprocess_features(features: InputFeatures) -> pd.DataFrame:
        """Convert input features to DataFrame and preprocess for model"""
        # Convert input to DataFrame
        data = features.model_dump()
        df = pd.DataFrame([data])

        # One-hot encoding pentru gender și smoking_history
        df = pd.get_dummies(df, columns=['gender', 'smoking_history'])

        # Asigură-te că ai toate coloanele ca la antrenare
        model, _ = ModelRepository.get_model_and_scaler()
        expected_cols = model.feature_name_
        df = df.reindex(columns=expected_cols, fill_value=0)

        return df
    
    @staticmethod
    def predict_single(features: InputFeatures) -> PredictionResult:
        """Make a prediction for a single patient"""
        try:
            # Get model and scaler
            model, scaler = ModelRepository.get_model_and_scaler()
            
            if model is None or scaler is None:
                raise ValueError("Model or scaler not loaded")
            
            # Preprocess features
            df = PredictionService.preprocess_features(features)
            
            # Scale only numeric columns
            numeric_cols = ['age', 'bmi', 'HbA1c_level', 'blood_glucose_level']
            df[numeric_cols] = scaler.transform(df[numeric_cols])
            
            # Make prediction
            prediction = model.predict(df)[0]
            probability = model.predict_proba(df)[0][1]  # Probability of positive class
            
            # Get model info for version
            model_info = ModelRepository.get_model_info()
            
            return PredictionResult(
                risk=int(prediction),
                probability=float(probability),
                model_version=model_info["version"]
            )
        except Exception as e:
            import traceback
            logger.error(f"Error in prediction: {e}\n{traceback.format_exc()}")
            raise e
    
    @staticmethod
    def predict_batch(request: BatchPredictionRequest) -> BatchPredictionResponse:
        """Make predictions for multiple patients"""
        # Record start time for processing
        start_time = time.time()
        results = []
        failed_count = 0
        # Predict for each patient
        for patient_data in request.data:
            try:
                result = PredictionService.predict_single(patient_data)
                results.append(result)
            except Exception as e:
                logger.error(f"Failed to predict for patient: {e}")
                failed_count += 1
                # Add a default result for failed predictions
                model_info = ModelRepository.get_model_info()
                results.append(PredictionResult(
                    risk=0,
                    probability=0.0,
                    model_version=model_info["version"]
                ))
        # Compute processing time and assign batch ID
        processing_time_seconds = time.time() - start_time
        batch_id = str(uuid.uuid4())
        return BatchPredictionResponse(
            predictions=results,
            processing_time_seconds=processing_time_seconds,
            batch_id=batch_id,
            processed_count=len(request.data),
            failed_count=failed_count
        )
    
    @staticmethod
    def is_ready() -> bool:
        """Check if prediction service is ready"""
        return ModelRepository.is_ready()
