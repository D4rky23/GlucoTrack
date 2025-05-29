import pandas as pd
import numpy as np
from typing import List, Dict, Any
from models.health import InputFeatures, PredictionResult
from models.batch import BatchPredictionRequest, BatchPredictionResponse
from repositories.model_repository import ModelRepository
import logging

logger = logging.getLogger(__name__)

class PredictionService:
    """Service for handling diabetes predictions"""
    
    @staticmethod
    def preprocess_features(features: InputFeatures) -> pd.DataFrame:
        """Convert input features to DataFrame and preprocess for model"""
        # Convert to dictionary first
        data = features.model_dump()
        
        # Handle categorical encoding
        gender_encoded = 1 if data['gender'] == 'Male' else 0
        
        # Smoking history encoding (simplified - you might need more sophisticated encoding)
        smoking_map = {
            'never': 0,
            'No Info': 1, 
            'former': 2,
            'current': 3,
            'ever': 4,
            'not current': 5
        }
        smoking_encoded = smoking_map.get(data['smoking_history'], 1)
        
        # Create processed data
        processed_data = {
            'gender': gender_encoded,
            'age': data['age'],
            'hypertension': data['hypertension'],
            'heart_disease': data['heart_disease'],
            'smoking_history': smoking_encoded,
            'bmi': data['bmi'],
            'HbA1c_level': data['HbA1c_level'],
            'blood_glucose_level': data['blood_glucose_level']
        }
        
        # Convert to DataFrame with correct column order
        df = pd.DataFrame([processed_data])
        
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
            
            # Scale features
            scaled_features = scaler.transform(df)
            
            # Make prediction
            prediction = model.predict(scaled_features)[0]
            probability = model.predict_proba(scaled_features)[0][1]  # Probability of positive class
            
            # Get model info for version
            model_info = ModelRepository.get_model_info()
            
            return PredictionResult(
                risk=int(prediction),
                probability=float(probability),
                model_version=model_info["version"]
            )
            
        except Exception as e:
            logger.error(f"Error in prediction: {e}")
            raise e
    
    @staticmethod
    def predict_batch(request: BatchPredictionRequest) -> BatchPredictionResponse:
        """Make predictions for multiple patients"""
        results = []
        failed_count = 0
        
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
        
        return BatchPredictionResponse(
            results=results,
            processed_count=len(request.data),
            failed_count=failed_count
        )
    
    @staticmethod
    def is_ready() -> bool:
        """Check if prediction service is ready"""
        return ModelRepository.is_ready()
