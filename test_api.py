#!/usr/bin/env python3
"""
Test script for GlucoTrack API endpoints
"""
import requests
import json
import sys

# API base URL
BASE_URL = "http://localhost:8000/api/v1"

def test_health_endpoints():
    """Test health and readiness endpoints"""
    print("🔍 Testing Health Endpoints...")
    
    # Test health endpoint
    try:
        response = requests.get(f"{BASE_URL}/health")
        print(f"✅ Health: {response.status_code} - {response.json()}")
    except Exception as e:
        print(f"❌ Health check failed: {e}")
    
    # Test readiness endpoint
    try:
        response = requests.get(f"{BASE_URL}/ready")
        print(f"✅ Ready: {response.status_code} - {response.json()}")
    except Exception as e:
        print(f"❌ Readiness check failed: {e}")

def test_model_endpoints():
    """Test model information endpoints"""
    print("\n📊 Testing Model Endpoints...")
    
    # Test model info
    try:
        response = requests.get(f"{BASE_URL}/model/info")
        print(f"✅ Model Info: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"   Algorithm: {data.get('algorithm')}")
            print(f"   Version: {data.get('version')}")
            print(f"   ROC-AUC: {data.get('roc_auc')}")
    except Exception as e:
        print(f"❌ Model info failed: {e}")
    
    # Test feature names
    try:
        response = requests.get(f"{BASE_URL}/model/feature-names")
        print(f"✅ Feature Names: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"   Features count: {len(data.get('features', []))}")
    except Exception as e:
        print(f"❌ Feature names failed: {e}")
    
    # Test metrics
    try:
        response = requests.get(f"{BASE_URL}/model/metrics")
        print(f"✅ Model Metrics: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"   Accuracy: {data.get('accuracy')}")
            print(f"   Precision: {data.get('precision')}")
    except Exception as e:
        print(f"❌ Model metrics failed: {e}")

def test_prediction_endpoints():
    """Test prediction endpoints"""
    print("\n🔮 Testing Prediction Endpoints...")
    
    # Sample patient data
    sample_patient = {
        "gender": "Female",
        "age": 45.0,
        "hypertension": 0,
        "heart_disease": 0,
        "smoking_history": "never",
        "bmi": 28.5,
        "HbA1c_level": 6.2,
        "blood_glucose_level": 140.0
    }
    
    # Test single prediction
    try:
        response = requests.post(
            f"{BASE_URL}/predict",
            json=sample_patient,
            headers={"Content-Type": "application/json"}
        )
        print(f"✅ Single Prediction: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"   Risk: {data.get('risk')}")
            print(f"   Probability: {data.get('probability'):.3f}")
            print(f"   Model Version: {data.get('model_version')}")
        else:
            print(f"   Error: {response.text}")
    except Exception as e:
        print(f"❌ Single prediction failed: {e}")
    
    # Test batch prediction
    try:
        batch_request = {
            "data": [sample_patient, sample_patient]
        }
        response = requests.post(
            f"{BASE_URL}/batch-predict",
            json=batch_request,
            headers={"Content-Type": "application/json"}
        )
        print(f"✅ Batch Prediction: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"   Processed: {data.get('processed_count')}")
            print(f"   Failed: {data.get('failed_count')}")
            print(f"   Results: {len(data.get('results', []))}")
    except Exception as e:
        print(f"❌ Batch prediction failed: {e}")

def test_validation_endpoints():
    """Test validation endpoints"""
    print("\n✅ Testing Validation Endpoints...")
    
    # Sample patient data
    sample_patient = {
        "gender": "Female",
        "age": 45.0,
        "hypertension": 0,
        "heart_disease": 0,
        "smoking_history": "never",
        "bmi": 28.5,
        "HbA1c_level": 6.2,
        "blood_glucose_level": 140.0
    }
    
    # Test data validation
    try:
        response = requests.post(
            f"{BASE_URL}/data/validate",
            json=sample_patient,
            headers={"Content-Type": "application/json"}
        )
        print(f"✅ Data Validation: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"   Valid: {data.get('valid')}")
            print(f"   Errors: {len(data.get('errors', []))}")
            print(f"   Warnings: {len(data.get('warnings', []))}")
            if data.get('warnings'):
                for warning in data['warnings']:
                    print(f"     ⚠️  {warning}")
    except Exception as e:
        print(f"❌ Data validation failed: {e}")

def main():
    """Run all tests"""
    print("🧪 GlucoTrack API Test Suite")
    print("=" * 50)
    
    try:
        test_health_endpoints()
        test_model_endpoints()
        test_prediction_endpoints()
        test_validation_endpoints()
        
        print("\n🎉 Test suite completed!")
        print("💡 Check the API documentation at: http://localhost:8000/docs")
        
    except KeyboardInterrupt:
        print("\n🛑 Tests interrupted by user")
    except Exception as e:
        print(f"\n💥 Unexpected error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()
