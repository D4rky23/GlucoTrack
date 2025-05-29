import pandas as pd
import os
from typing import Optional
import logging

logger = logging.getLogger(__name__)

class DataRepository:
    """Repository for handling data file operations"""
    
    DATA_PATH = "data/processed/diabetes_prediction_clean.csv"
    
    @classmethod
    def load_training_data(cls) -> Optional[pd.DataFrame]:
        """Load the training dataset"""
        try:
            if os.path.exists(cls.DATA_PATH):
                df = pd.read_csv(cls.DATA_PATH)
                logger.info(f"Training data loaded: {len(df)} records")
                return df
            else:
                logger.error(f"Training data file not found: {cls.DATA_PATH}")
                return None
        except Exception as e:
            logger.error(f"Error loading training data: {e}")
            return None
    
    @classmethod
    def get_data_summary(cls) -> dict:
        """Get summary statistics of the training data"""
        df = cls.load_training_data()
        if df is not None:
            return {
                "total_records": len(df),
                "features": list(df.columns),
                "diabetes_cases": int(df['diabetes'].sum()) if 'diabetes' in df.columns else 0,
                "healthy_cases": int((df['diabetes'] == 0).sum()) if 'diabetes' in df.columns else 0
            }
        return {}
    
    @classmethod
    def save_temp_file(cls, data: pd.DataFrame, filename: str) -> str:
        """Save temporary data file"""
        temp_path = f"data/temp/{filename}"
        os.makedirs(os.path.dirname(temp_path), exist_ok=True)
        data.to_csv(temp_path, index=False)
        return temp_path
