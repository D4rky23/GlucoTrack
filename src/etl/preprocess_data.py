import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
import joblib
import os

os.makedirs('data/processed', exist_ok=True)
os.makedirs('models', exist_ok=True)

df = pd.read_csv('data/processed/diabetes_prediction_clean.csv')

X = df.drop('diabetes', axis=1)
y = df['diabetes']

categorical_cols = ['gender', 'smoking_history']
X = pd.get_dummies(X, columns=categorical_cols, drop_first=True)

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, stratify=y, random_state=42
)

X_test = X_test.reindex(columns=X_train.columns, fill_value=0)

numeric_cols = ['age', 'bmi', 'HbA1c_level', 'blood_glucose_level']
scaler = StandardScaler()
X_train[numeric_cols] = scaler.fit_transform(X_train[numeric_cols])
X_test[numeric_cols] = scaler.transform(X_test[numeric_cols])

X_train.to_csv('data/processed/X_train_ml.csv', index=False)
X_test.to_csv('data/processed/X_test_ml.csv', index=False)
y_train.to_csv('data/processed/y_train_ml.csv', index=False)
y_test.to_csv('data/processed/y_test_ml.csv', index=False)
joblib.dump(scaler, 'models/scaler.pkl')

print("Preprocessed data & scaler saved!")
