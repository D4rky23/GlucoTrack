# GlucoTrack Application Startup Script
# This script starts both the backend API and frontend development servers

Write-Host "🔬 Starting GlucoTrack Application..." -ForegroundColor Green
Write-Host ""

# Check if Python is available
try {
    $pythonVersion = python --version 2>$null
    Write-Host "✅ Python found: $pythonVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Python not found. Please install Python." -ForegroundColor Red
    exit 1
}

# Check if Node.js is available
try {
    $nodeVersion = node --version 2>$null
    Write-Host "✅ Node.js found: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install Node.js." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🚀 Starting Backend API Server..." -ForegroundColor Cyan

# Start the backend API server in a new window
$backendJob = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; python run_api.py" -PassThru

Write-Host "✅ Backend API starting at http://localhost:8000" -ForegroundColor Green
Write-Host "📚 API Documentation: http://localhost:8000/docs" -ForegroundColor Yellow

# Wait a moment for the API to start
Start-Sleep -Seconds 3

Write-Host ""
Write-Host "🎨 Starting Frontend Development Server..." -ForegroundColor Cyan

# Check if node_modules exists in app directory
if (-not (Test-Path "app/node_modules")) {
    Write-Host "📦 Installing frontend dependencies..." -ForegroundColor Yellow
    cd app
    npm install --legacy-peer-deps
    cd ..
}

# Start the frontend development server in a new window
$frontendJob = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD/app'; npm run dev" -PassThru

Write-Host "✅ Frontend starting at http://localhost:5173" -ForegroundColor Green

Write-Host ""
Write-Host "🎉 GlucoTrack Application Started Successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "📋 Quick Access:" -ForegroundColor White
Write-Host "   🌐 Frontend:     http://localhost:5173" -ForegroundColor Cyan
Write-Host "   🔧 Backend API:  http://localhost:8000" -ForegroundColor Cyan
Write-Host "   📖 API Docs:     http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host ""
Write-Host "💡 Press Ctrl+C to stop this script (servers will continue running)" -ForegroundColor Yellow
Write-Host "💡 Close the individual PowerShell windows to stop the servers" -ForegroundColor Yellow

# Keep the script running
try {
    while ($true) {
        Start-Sleep -Seconds 5
        
        # Check if processes are still running
        if ($backendJob.HasExited) {
            Write-Host "⚠️  Backend process has stopped" -ForegroundColor Red
        }
        if ($frontendJob.HasExited) {
            Write-Host "⚠️  Frontend process has stopped" -ForegroundColor Red
        }
    }
} catch {
    Write-Host ""
    Write-Host "👋 Startup script stopped. Servers are still running in separate windows." -ForegroundColor Green
}
