#!/usr/bin/env python3
"""
Startup script for GlucoTrack API
"""
import sys
import os

# Add the src directory to Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), 'src'))

if __name__ == "__main__":
    import uvicorn
    from src.main import app
    
    print("🚀 Starting GlucoTrack API...")
    print("📊 Diabetes risk prediction service")
    print("📖 API Documentation: http://localhost:8000/docs")
    print("🔍 Health Check: http://localhost:8000/api/v1/health")
    print("⚡ Ready Check: http://localhost:8000/api/v1/ready")
    
    uvicorn.run(
        "src.main:app", 
        host="0.0.0.0", 
        port=8000,
        reload=True,
        log_level="info"
    )
