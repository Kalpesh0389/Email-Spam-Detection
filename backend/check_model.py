from pickle import load
import sklearn

try:
    with open("model.pkl", "rb") as f:
        model = load(f)
    print(f"Model type: {type(model)}")
    if hasattr(model, "predict_proba"):
        print("Model supports predict_proba")
    else:
        print("Model DOES NOT support predict_proba")
except Exception as e:
    print(f"Error: {e}")
