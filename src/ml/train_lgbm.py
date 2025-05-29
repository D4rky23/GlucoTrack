import pandas as pd
from lightgbm import LGBMClassifier
from sklearn.model_selection import GridSearchCV
from sklearn.metrics import roc_auc_score
import joblib
import os

os.makedirs('models', exist_ok=True)

X_train = pd.read_csv('data/processed/X_train_ml.csv')
X_test = pd.read_csv('data/processed/X_test_ml.csv')
y_train = pd.read_csv('data/processed/y_train_ml.csv').squeeze()
y_test = pd.read_csv('data/processed/y_test_ml.csv').squeeze()

scale_pos_weight = len(y_train[y_train == 0]) / len(y_train[y_train == 1])

params = {
    'num_leaves': [15, 31, 63],
    'max_depth': [3, 5, 7, -1],
    'learning_rate': [0.01, 0.05, 0.1],
    'n_estimators': [300, 500],
    'scale_pos_weight': [scale_pos_weight]
}

lgbm_gs = LGBMClassifier(random_state=42, n_jobs=-1)

grid = GridSearchCV(lgbm_gs, params, scoring='roc_auc', cv=3, verbose=1)
grid.fit(X_train, y_train)

print("Best params:", grid.best_params_)
print("Best ROC-AUC on CV:", grid.best_score_)

best_lgbm = grid.best_estimator_
y_pred_best = best_lgbm.predict(X_test)
y_proba_best = best_lgbm.predict_proba(X_test)[:, 1]
print("Test ROC-AUC:", roc_auc_score(y_test, y_proba_best))

joblib.dump(best_lgbm, 'models/lgbm_best_model.pkl')
print("LightGBM best model saved to models/lgbm_best_model.pkl")
c