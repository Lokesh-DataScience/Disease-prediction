from src.data_preprocessing import load_and_clean_data
from src.model_training import train_models
from src.model_evaluation import evaluate_model
from src.disease_prediction import predict_disease
from src.utils import save_model, load_model
import os
import numpy as np
import warnings
warnings.filterwarnings("ignore")

# Load and clean the dataset
data, encoder = load_and_clean_data("dataset/Training.csv")
X = data.iloc[:, :-1]
y = data.iloc[:, -1]

# Train models on full dataset
svm_model, nb_model, rf_model = train_models(X, y)

# Remove old models if they exist
if not os.path.exists("models"):
    os.makedirs("models")

for model_file in ["svm_model.pkl", "nb_model.pkl", "rf_model.pkl"]:
    model_path = os.path.join("models", model_file)
    if os.path.exists(model_path):
        os.remove(model_path)

# Save models
save_model(svm_model, "models/svm_model.pkl")
save_model(nb_model, "models/nb_model.pkl")
save_model(rf_model, "models/rf_model.pkl")
save_model(encoder, "models/encoder.pkl")

# Evaluate models
evaluate_model(svm_model, X, y, "SVM")
evaluate_model(nb_model, X, y, "Naive Bayes")
evaluate_model(rf_model, X, y, "Random Forest")

# Load trained models
svm_model = load_model("models/svm_model.pkl")
nb_model = load_model("models/nb_model.pkl")
rf_model = load_model("models/rf_model.pkl")

# Create model dictionary
models = {
    "svm": svm_model,
    "nb": nb_model,
    "rf": rf_model
}

# Create a symptom-to-index mapping
symptom_index = {col.strip().replace("_", " ").capitalize(): idx for idx, col in enumerate(X.columns)}
predictions_classes = dict(enumerate(encoder.classes_))

# Ensure symptoms are properly formatted
symptoms = "Itching, Skin Rash, Nodal Skin Eruptions"
symptoms = ",".join([s.strip().capitalize() for s in symptoms.split(",")])  # Normalize input

# Make predictions
prediction_results = predict_disease(symptoms, symptom_index, predictions_classes, models)

# save symptom index 
save_model(symptom_index, "models/symptom_index.pkl")

# Output results
print("\nPrediction Results:")
print(f"SVM Prediction: {prediction_results['svm_model_prediction']}")
print(f"Naive Bayes Prediction: {prediction_results['naive_bayes_prediction']}")
print(f"Random Forest Prediction: {prediction_results['rf_model_prediction']}")
print(f"Final Prediction (Majority Vote): {prediction_results['final_prediction']}")
