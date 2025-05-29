# 🩺 GlucoTrack API v1.0

A comprehensive diabetes risk prediction API built with FastAPI and machine learning. This API provides endpoints for predicting diabetes risk based on patient health data using a trained LightGBM model.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Start the API Server
```bash
python run_api.py
```

The API will be available at:
- **API Base**: http://localhost:8000
- **Interactive Docs**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

### 3. Test the API
```bash
python test_api.py
```

## 📋 API Endpoints Overview

| Method | Endpoint | Description | Purpose |
|--------|----------|-------------|---------|
| GET | `/api/v1/health` | Basic health check | Service liveness |
| GET | `/api/v1/ready` | Readiness check | Model & scaler loaded |
| POST | `/api/v1/predict` | Single prediction | Main prediction endpoint |
| POST | `/api/v1/batch-predict` | Batch predictions | Multiple patients |
| GET | `/api/v1/model/info` | Model metadata | Algorithm, version, metrics |
| GET | `/api/v1/model/feature-names` | Feature specifications | Input requirements |
| GET | `/api/v1/model/metrics` | Performance metrics | Accuracy, precision, etc. |
| POST | `/api/v1/model/reload` | Reload model | Admin operation |
| POST | `/api/v1/data/validate` | Validate input | Data quality check |

## 🔍 Detailed Endpoint Documentation

### Health Endpoints

#### `GET /api/v1/health`
Basic liveness check to ensure the service is running.

**Response:**
```json
{
  "status": "ok"
}
```

#### `GET /api/v1/ready`
Readiness check to ensure model and scaler are loaded.

**Response:**
```json
{
  "ready": true,
  "model_loaded": true,
  "scaler_loaded": true,
  "message": "All systems ready"
}
```

### Prediction Endpoints

#### `POST /api/v1/predict`
Predict diabetes risk for a single patient.

**Request Body:**
```json
{
  "gender": "Female",
  "age": 45.0,
  "hypertension": 0,
  "heart_disease": 0,
  "smoking_history": "never",
  "bmi": 28.5,
  "HbA1c_level": 6.2,
  "blood_glucose_level": 140.0
}
```

**Response:**
```json
{
  "risk": 1,
  "probability": 0.87,
  "model_version": "lgbm_v1.2"
}
```

#### `POST /api/v1/batch-predict`
Predict diabetes risk for multiple patients.

**Request Body:**
```json
{
  "data": [
    {
      "gender": "Female",
      "age": 45.0,
      "hypertension": 0,
      "heart_disease": 0,
      "smoking_history": "never",
      "bmi": 28.5,
      "HbA1c_level": 6.2,
      "blood_glucose_level": 140.0
    }
  ]
}
```

**Response:**
```json
{
  "results": [
    {
      "risk": 1,
      "probability": 0.87,
      "model_version": "lgbm_v1.2"
    }
  ],
  "processed_count": 1,
  "failed_count": 0
}
```

### Model Information Endpoints

#### `GET /api/v1/model/info`
Get model metadata and information.

**Response:**
```json
{
  "algorithm": "LightGBM",
  "trained_at": "2025-05-28T18:02:00Z",
  "roc_auc": 0.982,
  "features": 8,
  "version": "lgbm_v1.2"
}
```

#### `GET /api/v1/model/feature-names`
Get feature specifications and requirements.

**Response:**
```json
{
  "features": [
    {
      "name": "gender",
      "type": "categorical",
      "required": true,
      "allowed_values": ["Male", "Female"]
    },
    {
      "name": "age",
      "type": "numeric",
      "required": true,
      "min_value": 0,
      "max_value": 120
    }
  ]
}
```

### Validation Endpoints

#### `POST /api/v1/data/validate`
Validate patient data without making predictions.

**Request Body:** Same as `/predict` endpoint

**Response:**
```json
{
  "valid": true,
  "errors": [],
  "warnings": ["BMI is very high (> 50) - verify measurement"]
}
```

## 🏗️ Architecture

The API follows a clean architecture pattern with clear separation of concerns:

```
src/
├── api/v1/          # FastAPI routers (controllers)
├── services/        # Business logic layer
├── repositories/    # Data access layer
├── models/          # Pydantic models (DTOs)
└── main.py         # Application entry point
```

### Layer Responsibilities

- **API Layer**: Request/response handling, HTTP concerns
- **Service Layer**: Business logic, orchestration
- **Repository Layer**: Data access, model loading
- **Models Layer**: Data validation, serialization

## 🔧 Configuration

### Environment Variables

- `MODEL_PATH`: Path to the trained model file (default: `models/lgbm_best_model.pkl`)
- `SCALER_PATH`: Path to the scaler file (default: `models/scaler.pkl`)
- `LOG_LEVEL`: Logging level (default: `INFO`)

### Model Requirements

The API expects:
1. A trained LightGBM model saved as `models/lgbm_best_model.pkl`
2. A fitted scaler saved as `models/scaler.pkl`
3. Models trained on features: gender, age, hypertension, heart_disease, smoking_history, bmi, HbA1c_level, blood_glucose_level

## 🧪 Testing

### Unit Tests
```bash
python -m pytest tests/
```

### API Integration Tests
```bash
python test_api.py
```

### Manual Testing
Visit http://localhost:8000/docs for interactive API documentation.

## 🚦 Error Handling

The API returns standard HTTP status codes:

- `200`: Success
- `422`: Validation Error (invalid input data)
- `503`: Service Unavailable (model not loaded)
- `500`: Internal Server Error

Error responses include detailed messages:
```json
{
  "detail": "BMI must be between 10 and 80"
}
```

## 📊 Frontend Integration

### React Example
```javascript
const predictDiabetes = async (patientData) => {
  const response = await fetch('/api/v1/predict', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patientData)
  });
  
  if (!response.ok) {
    throw new Error('Prediction failed');
  }
  
  return await response.json();
};
```

### Form Validation
Use the `/data/validate` endpoint for real-time form validation:

```javascript
const validateForm = async (formData) => {
  const response = await fetch('/api/v1/data/validate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  });
  
  const result = await response.json();
  return result; // { valid: boolean, errors: [], warnings: [] }
};
```

## 🔄 Versioning

The API uses URL versioning (`/api/v1/`). Breaking changes will increment the major version.

## 📈 Monitoring

### Health Checks
- Use `/health` for basic liveness probes
- Use `/ready` for readiness probes in Kubernetes

### Metrics
Access model performance metrics via `/model/metrics` endpoint.

## 🛠️ Development

### Adding New Features
1. Create/update Pydantic models in `models/`
2. Implement business logic in `services/`
3. Add data access methods in `repositories/`
4. Create API endpoints in `api/v1/`
5. Update tests and documentation

### Code Style
- Follow PEP 8
- Use type hints
- Add docstrings to public methods
- Maintain test coverage > 80%

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

---

**🩺 GlucoTrack API** - Empowering healthcare with AI-driven diabetes risk prediction.
