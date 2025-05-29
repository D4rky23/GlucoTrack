# GlucoTrack - Complete Diabetes Risk Prediction Application

## Overview

GlucoTrack is a comprehensive diabetes risk prediction system with a FastAPI backend and React frontend. The application provides both single and batch prediction capabilities with a modern, responsive UI.

## Project Structure

```
GlucoTrack/
├── Backend (FastAPI)
│   ├── src/                    # 4-layer architecture
│   │   ├── api/v1/            # API routes
│   │   ├── services/          # Business logic
│   │   ├── repositories/      # Data access
│   │   └── models/            # Pydantic models
│   ├── models/                # ML models
│   ├── data/                  # Training data
│   └── requirements.txt       # Python dependencies
│
└── Frontend (React + Vite)
    ├── app/src/
    │   ├── components/        # Reusable UI components
    │   ├── pages/             # Page components
    │   ├── hooks/             # Custom React hooks
    │   ├── api/               # API integration
    │   └── router/            # React Router config
    └── package.json           # Node.js dependencies
```

## Features Implemented

### Backend API (✅ Complete)
- **Health Endpoints**: `/health`, `/ready`
- **Prediction Endpoints**: `/predict`, `/batch-predict`
- **Model Management**: `/model/info`, `/model/feature-names`, `/model/metrics`, `/model/reload`
- **Data Validation**: `/data/validate`
- **4-Layer Architecture**: API → Services → Repositories → Models
- **ML Model Integration**: LightGBM with proper singleton pattern
- **CORS Support**: For frontend integration
- **Comprehensive Error Handling**: With proper HTTP status codes
- **API Documentation**: Auto-generated with FastAPI

### Frontend React App (✅ Complete)
- **Modern UI**: Tailwind CSS with dark mode support
- **Responsive Design**: Mobile-first approach
- **Component Library**: Reusable components (Card, Loader, InputField, etc.)
- **State Management**: Custom hooks for API interactions
- **File Upload**: Drag-and-drop CSV upload with validation
- **Form Handling**: React Hook Form with validation
- **Routing**: React Router with nested routes
- **API Integration**: Axios with proxy configuration

### Pages Implemented
1. **Dashboard** - Overview with quick actions and model status
2. **Single Prediction** - Form-based individual patient prediction
3. **Batch Prediction** - CSV upload for multiple predictions
4. **Model Information** - Model details, metrics, and features

## API Endpoints

### Health
- `GET /health` - Basic health check
- `GET /ready` - Readiness check with dependencies

### Predictions
- `POST /predict` - Single patient prediction
- `POST /batch-predict` - Multiple patients prediction

### Model Management
- `GET /model/info` - Model metadata
- `GET /model/feature-names` - Required input features
- `GET /model/metrics` - Performance metrics
- `POST /model/reload` - Reload model from disk

### Data Validation
- `POST /data/validate` - Validate input data structure

## Setup Instructions

### Backend Setup

1. **Install Python Dependencies**
   ```powershell
   pip install -r requirements.txt
   ```

2. **Start the API Server**
   ```powershell
   python run_api.py
   ```
   
   The API will be available at: `http://localhost:8000`
   
   API Documentation: `http://localhost:8000/docs`

### Frontend Setup

1. **Navigate to Frontend Directory**
   ```powershell
   cd app
   ```

2. **Install Node.js Dependencies**
   ```powershell
   npm install --legacy-peer-deps
   ```

3. **Start Development Server**
   ```powershell
   npm run dev
   ```
   
   The frontend will be available at: `http://localhost:5173`

## Usage

### Single Prediction
1. Navigate to the "Single Prediction" page
2. Fill in the patient health data form:
   - Glucose Level
   - Blood Pressure
   - Skin Thickness
   - Insulin Level
   - BMI
   - Diabetes Pedigree Function
   - Age
   - Number of Pregnancies
3. Click "Predict Risk"
4. View the risk classification and probability

### Batch Prediction
1. Navigate to the "Batch Prediction" page
2. Upload a CSV file with the required columns
3. Review the file validation results
4. Click "Predict All" to process
5. Download the results CSV with predictions

### Required CSV Format
```csv
glucose,bloodpressure,skinthickness,insulin,bmi,diabetespedigreefunction,age,pregnancies
120,80,20,80,25.5,0.5,35,2
140,90,25,100,30.0,0.8,45,3
```

## Technology Stack

### Backend
- **FastAPI**: Modern, fast web framework
- **Pydantic**: Data validation and serialization
- **LightGBM**: Machine learning model
- **scikit-learn**: ML utilities
- **Uvicorn**: ASGI server

### Frontend
- **React 19**: Latest React with hooks
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **React Router**: Client-side routing
- **React Hook Form**: Form management
- **Axios**: HTTP client
- **PapaParse**: CSV parsing
- **React Dropzone**: File upload component

## Development Features

### Code Quality
- **Type Safety**: Pydantic models for backend validation
- **Error Handling**: Comprehensive error boundaries
- **Loading States**: User feedback for async operations
- **Form Validation**: Client and server-side validation
- **Responsive Design**: Mobile-first UI components

### API Integration
- **Proxy Configuration**: Vite proxy for development
- **CORS Setup**: Cross-origin resource sharing
- **Custom Hooks**: Reusable API state management
- **Error Recovery**: Automatic retry and error handling

## Testing

### Backend Testing
```powershell
python test_api.py
```

### Frontend Testing
The frontend includes:
- Form validation testing
- API integration testing
- Component error boundaries
- File upload validation

## Deployment Ready

Both frontend and backend are production-ready:

- **Backend**: Can be deployed with Docker/cloud platforms
- **Frontend**: Can be built with `npm run build` for static deployment
- **Environment Variables**: Configured for different environments
- **API Documentation**: Auto-generated and always up-to-date

## Next Steps

1. **Start Backend**: `python run_api.py`
2. **Start Frontend**: `cd app && npm run dev`
3. **Test Integration**: Upload sample CSV and test predictions
4. **Explore API Docs**: Visit `http://localhost:8000/docs`

The application is now fully functional with a complete diabetes risk prediction system featuring both single and batch prediction capabilities through a modern web interface.
