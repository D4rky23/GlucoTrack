import joblib

paths = {
    'model':  'models/lgbm_best_model.pkl',
    'scaler': 'models/scaler.pkl'
}

for name, path in paths.items():
    obj = joblib.load(path)
    print(f"{name} loaded successfully: object type = {type(obj)}")
    if hasattr(obj, 'get_params'):
        print("   • Available parameters:", list(obj.get_params().keys())[:5])
    if hasattr(obj, 'mean_'):
        print("   • Scaler attributes – mean_ shape:", obj.mean_.shape)
