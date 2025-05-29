# GlucoTrack API Startup Script
# PowerShell script to start the diabetes prediction API

Write-Host "🩺 GlucoTrack API Startup Script" -ForegroundColor Green
Write-Host "=================================" -ForegroundColor Green

# Check if Python is installed
if (-not (Get-Command python -ErrorAction SilentlyContinue)) {
    Write-Host "❌ Python is not installed or not in PATH" -ForegroundColor Red
    exit 1
}

# Check if we're in the right directory
if (-not (Test-Path "src\main.py")) {
    Write-Host "❌ Please run this script from the GlucoTrack root directory" -ForegroundColor Red
    exit 1
}

# Check if virtual environment exists
if (Test-Path "venv\Scripts\activate.ps1") {
    Write-Host "🔧 Activating virtual environment..." -ForegroundColor Yellow
    & "venv\Scripts\activate.ps1"
} else {
    Write-Host "💡 No virtual environment found. Consider creating one with: python -m venv venv" -ForegroundColor Yellow
}

# Install dependencies if requirements.txt exists
if (Test-Path "requirements.txt") {
    Write-Host "📦 Installing/updating dependencies..." -ForegroundColor Yellow
    pip install -r requirements.txt
}

# Start the API server
Write-Host "🚀 Starting GlucoTrack API server..." -ForegroundColor Green
Write-Host "📖 API Documentation: http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host "🔍 Health Check: http://localhost:8000/api/v1/health" -ForegroundColor Cyan
Write-Host "⚡ Ready Check: http://localhost:8000/api/v1/ready" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

# Start the server
python run_api.py
