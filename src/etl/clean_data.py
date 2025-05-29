import pandas as pd
import os

os.makedirs('data/processed', exist_ok=True)

df = pd.read_csv('data/raw/diabetes_prediction_dataset.csv')

df_clean = df[(df['age'] >= 1) & (df['bmi'] <= 80)]

df_clean.to_csv('data/processed/diabetes_prediction_clean.csv', index=False)
print("Cleaned data saved to data/processed/diabetes_prediction_clean.csv")
