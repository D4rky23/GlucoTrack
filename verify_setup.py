#!/usr/bin/env python3
"""
GlucoTrack Setup Verification Script
This script verifies that all components are properly configured
"""
import os
import sys
import json
from pathlib import Path

def check_file_exists(file_path, description):
    """Check if a file exists and report status"""
    if Path(file_path).exists():
        print(f"✅ {description}: {file_path}")
        return True
    else:
        print(f"❌ Missing {description}: {file_path}")
        return False

def check_directory_structure():
    """Verify the project directory structure"""
    print("🔍 Checking Project Structure...")
    
    required_files = [
        ("requirements.txt", "Python requirements"),
        ("run_api.py", "API startup script"),
        ("models/lgbm_best_model.pkl", "ML model file"),
        ("models/scaler.pkl", "Data scaler"),
        ("data/processed/diabetes_prediction_clean.csv", "Processed dataset"),
        ("app/package.json", "Frontend package config"),
        ("app/src/main.jsx", "React app entry point"),
        ("app/src/App.jsx", "Main React component"),
        ("app/src/router/index.jsx", "React router config"),
        ("src/main.py", "FastAPI main app"),
        ("src/api/v1/health.py", "Health endpoints"),
        ("src/api/v1/predict.py", "Prediction endpoints"),
        ("src/api/v1/model.py", "Model endpoints")
    ]
    
    all_good = True
    for file_path, description in required_files:
        if not check_file_exists(file_path, description):
            all_good = False
    
    return all_good

def check_python_imports():
    """Check if Python dependencies can be imported"""
    print("\n🔍 Checking Python Dependencies...")
    
    required_modules = [
        'fastapi',
        'uvicorn',
        'pandas',
        'numpy',
        'sklearn',  # Changed from 'scikit-learn'
        'lightgbm',
        'joblib'
    ]
    
    all_good = True
    for module in required_modules:
        try:
            __import__(module)
            print(f"✅ {module}")
        except ImportError:
            print(f"❌ Missing: {module}")
            all_good = False
    
    return all_good

def check_fastapi_app():
    """Check if FastAPI app can be imported"""
    print("\n🔍 Checking FastAPI Application...")
    
    try:
        sys.path.insert(0, 'src')
        from src.main import app
        print("✅ FastAPI app imports successfully")
        print(f"✅ App title: {app.title}")
        print(f"✅ App version: {app.version}")
        return True
    except Exception as e:
        print(f"❌ FastAPI app import failed: {e}")
        return False

def check_model_files():
    """Check if ML model files are valid"""
    print("\n🔍 Checking Model Files...")
    
    try:
        import joblib
        model = joblib.load('models/lgbm_best_model.pkl')
        scaler = joblib.load('models/scaler.pkl')
        print("✅ Model files load successfully")
        print(f"✅ Model type: {type(model).__name__}")
        print(f"✅ Scaler type: {type(scaler).__name__}")
        return True
    except Exception as e:
        print(f"❌ Model loading failed: {e}")
        return False

def check_frontend_config():
    """Check frontend configuration"""
    print("\n🔍 Checking Frontend Configuration...")
    
    try:
        # Check package.json
        with open('app/package.json', 'r') as f:
            package_json = json.load(f)
        
        print(f"✅ Package name: {package_json['name']}")
        print(f"✅ Dependencies: {len(package_json['dependencies'])} packages")
        
        # Check if node_modules exists
        if Path('app/node_modules').exists():
            print("✅ Node modules installed")
        else:
            print("⚠️  Node modules not installed - run 'npm install' in app directory")
        
        # Check .env file
        if Path('app/.env').exists():
            print("✅ Environment file exists")
        else:
            print("❌ Missing .env file")
        
        return True
    except Exception as e:
        print(f"❌ Frontend config check failed: {e}")
        return False

def main():
    """Run all verification checks"""
    print("🧪 GlucoTrack Setup Verification")
    print("=" * 50)
    
    checks = [
        ("Directory Structure", check_directory_structure),
        ("Python Dependencies", check_python_imports),
        ("FastAPI Application", check_fastapi_app),
        ("Model Files", check_model_files),
        ("Frontend Configuration", check_frontend_config)
    ]
    
    results = []
    for check_name, check_func in checks:
        try:
            result = check_func()
            results.append((check_name, result))
        except Exception as e:
            print(f"❌ {check_name} check failed with error: {e}")
            results.append((check_name, False))
    
    print("\n📊 VERIFICATION SUMMARY")
    print("=" * 50)
    
    all_passed = True
    for check_name, passed in results:
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"{status:8} {check_name}")
        if not passed:
            all_passed = False
    
    print("\n🚀 NEXT STEPS:")
    if all_passed:
        print("✅ All checks passed! Ready to start the application.")
        print("\nTo start the application:")
        print("1. Backend:  python run_api.py")
        print("2. Frontend: cd app && npm run dev")
        print("\nOr use the automated script:")
        print("   .\\start_app.ps1")
    else:
        print("❌ Some checks failed. Please resolve the issues above.")
        print("\nCommon fixes:")
        print("- Install Python dependencies: pip install -r requirements.txt")
        print("- Install Node dependencies: cd app && npm install")
        print("- Check file paths and permissions")

if __name__ == "__main__":
    main()
