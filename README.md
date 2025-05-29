# GlucoTrack

![Project Status](https://img.shields.io/badge/status-in%20development-yellow)

**GlucoTrack** is a local data science project integrating a full ETL pipeline, data analysis, and Machine Learning for diabetes risk prediction, with a modern user interface (React + Tailwind CSS).

## Project Structure

- **data/**
  - **raw/** – raw data files (CSV)
  - **processed/** – cleaned and preprocessed data (splits, ready for ML)
- **models/** – saved ML models and scalers (ignored by git)
- **notebooks/** – Jupyter notebooks for EDA, preprocessing, modeling, prediction
- **src/**
  - **etl/** – ETL scripts (cleaning, preprocessing)
  - **ml/** – Machine Learning scripts (training, tuning, inference)
  - **utils/** – utility/helper functions
  - **api/** – (to be developed) FastAPI endpoints
  - **models/** – Pydantic schemas (not ML models)
  - **repositories/** – (optional) data access logic
  - **services/** – (optional) business logic/services
- **app/** – React frontend (Vite + Tailwind CSS)
- **requirements.txt** – required Python packages
- **README.md** – project description, setup instructions

## Quick Setup

1. Install Python dependencies:
    ```
    pip install -r requirements.txt
    ```

2. Install frontend dependencies:
    ```
    cd app
    npm install
    ```

3. (Optional) Launch Jupyter Notebook:
    ```
    jupyter notebook
    ```

## Full Data & ML Pipeline (Reproducibility)

Reproduce the full pipeline (ETL, preprocessing, training) with three commands from project root:

```
python src/etl/clean_data.py
python src/etl/preprocess_data.py
python src/ml/train_lgbm.py
```

**Outputs:**
- Cleaned dataset: `data/processed/diabetes_prediction_clean.csv`
- Preprocessed train/test splits: `data/processed/`
- Trained scaler: `models/scaler.pkl`
- Trained LightGBM model: `models/lgbm_best_model.pkl`
- Console output: best hyperparameters and ROC-AUC scores

## Example: Predicting Diabetes on New Data

Load the trained model and scaler, then predict diabetes for new patients (see `04_prediction.ipynb`):

```python
import joblib, pandas as pd
model = joblib.load('models/lgbm_best_model.pkl')
scaler = joblib.load('models/scaler.pkl')
X_new = pd.DataFrame([{...}])  # new patient data, with same columns as at train time

# Align and scale features as in training...

y_pred = model.predict(X_new)
y_proba = model.predict_proba(X_new)[:, 1]
```

## TODO

- [x] Download & prepare dataset (Kaggle or NHANES)
- [x] Data cleaning & outlier removal (age, bmi)
- [x] Encoding & scaling (one-hot, standardization)
- [x] Train/test split with stratify
- [x] ML pipeline (Logistic Regression, RandomForest, XGBoost, LightGBM)
- [x] Hyperparameter tuning (GridSearchCV)
- [x] Save trained model & scaler
- [x] Predict on new data (04_prediction.ipynb)
- [ ] Expose ML pipeline as API (FastAPI)
- [ ] Develop frontend (React)
- [ ] Integrate backend and frontend

---

**Project status:** In development (pipeline complete, preparing API & frontend)

For EDA, model comparison, and full reproducibility, see Jupyter notebooks and Python scripts in `src/`.
