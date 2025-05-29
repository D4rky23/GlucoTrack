# GlucoTrack Application Test Script
# This script tests both the backend API and verifies the setup

Write-Host "🧪 Testing GlucoTrack Application..." -ForegroundColor Green
Write-Host ""

# Test Backend API
Write-Host "🔍 Testing Backend API..." -ForegroundColor Cyan

try {
    # Test health endpoint
    $response = Invoke-RestMethod -Uri "http://localhost:8000/health" -Method GET -TimeoutSec 5
    Write-Host "✅ Health Check: $($response.status)" -ForegroundColor Green
    
    # Test model info endpoint
    $modelInfo = Invoke-RestMethod -Uri "http://localhost:8000/model/info" -Method GET -TimeoutSec 5
    Write-Host "✅ Model Info: $($modelInfo.model_type) v$($modelInfo.version)" -ForegroundColor Green
    
    # Test feature names endpoint
    $features = Invoke-RestMethod -Uri "http://localhost:8000/model/feature-names" -Method GET -TimeoutSec 5
    Write-Host "✅ Features: $($features.feature_names.Count) features loaded" -ForegroundColor Green
    
    # Test prediction endpoint with sample data
    $sampleData = @{
        glucose = 120
        bloodpressure = 80
        skinthickness = 20
        insulin = 80
        bmi = 25.5
        diabetespedigreefunction = 0.5
        age = 35
        pregnancies = 2
    }
    
    $predictionResponse = Invoke-RestMethod -Uri "http://localhost:8000/predict" -Method POST -Body ($sampleData | ConvertTo-Json) -ContentType "application/json" -TimeoutSec 5
    Write-Host "✅ Sample Prediction: Risk Level $($predictionResponse.prediction) (Probability: $([math]::Round($predictionResponse.probability * 100, 1))%)" -ForegroundColor Green
    
} catch {
    Write-Host "❌ Backend API Test Failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "💡 Make sure the backend server is running: python run_api.py" -ForegroundColor Yellow
}

Write-Host ""

# Test Frontend
Write-Host "🔍 Testing Frontend..." -ForegroundColor Cyan

try {
    # Test if frontend is accessible
    $frontendResponse = Invoke-WebRequest -Uri "http://localhost:5173" -Method GET -TimeoutSec 5 -UseBasicParsing
    if ($frontendResponse.StatusCode -eq 200) {
        Write-Host "✅ Frontend accessible at http://localhost:5173" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Frontend Test Failed: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "💡 Make sure the frontend server is running: cd app && npm run dev" -ForegroundColor Yellow
}

Write-Host ""

# Check file structure
Write-Host "🔍 Verifying File Structure..." -ForegroundColor Cyan

$requiredFiles = @(
    "requirements.txt",
    "run_api.py",
    "app/package.json",
    "app/src/main.jsx",
    "app/src/App.jsx",
    "models/lgbm_best_model.pkl"
)

foreach ($file in $requiredFiles) {
    if (Test-Path $file) {
        Write-Host "✅ Found: $file" -ForegroundColor Green
    } else {
        Write-Host "❌ Missing: $file" -ForegroundColor Red
    }
}

Write-Host ""

# Summary
Write-Host "📊 Test Summary:" -ForegroundColor White
Write-Host "   🔧 Backend API:  Check endpoints above" -ForegroundColor Cyan
Write-Host "   🎨 Frontend:     Check accessibility above" -ForegroundColor Cyan
Write-Host "   📁 Files:        Check required files above" -ForegroundColor Cyan
Write-Host ""
Write-Host "🚀 To start the application:" -ForegroundColor Green
Write-Host "   .\start_app.ps1" -ForegroundColor Cyan
Write-Host ""
Write-Host "📖 For detailed setup instructions, see:" -ForegroundColor Green
Write-Host "   FINAL_SETUP_GUIDE.md" -ForegroundColor Cyan
