import joblib
import numpy as np
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from scipy import stats
from collections import Counter
import warnings
import os
import json
from django.shortcuts import render

warnings.filterwarnings('ignore')

# Load medicines
def load_medicines():
    medicine_file = os.path.join(os.path.dirname(__file__), 'data/medicines_data.json')
    with open(medicine_file, 'r') as file:
        medicines = json.load(file)
    return medicines

# Recommend medicines based on disease
def recommend_medicine(disease, medicines):
    recommendations = [med for med in medicines if med["Disease Name"] == disease]
    return recommendations

def home(request):
    return render(request, 'disease_prediction/index.html')


# Load models
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_DIR = os.path.join(BASE_DIR, 'disease_prediction', 'models')

svm_model = joblib.load(os.path.join(MODEL_DIR, 'svm_model.pkl'))
nb_model = joblib.load(os.path.join(MODEL_DIR, 'nb_model.pkl'))
rf_model = joblib.load(os.path.join(MODEL_DIR, 'rf_model.pkl'))

encoder = joblib.load(os.path.join(MODEL_DIR, 'encoder.pkl'))
symptom_index = joblib.load(os.path.join(MODEL_DIR, 'symptom_index.pkl'))

# Confidence threshold
CONFIDENCE_THRESHOLD = 0.75


# ✅ Helper function to format symptoms
def format_symptom(symptom):
    return symptom.strip().title()


# ✅ Function to calculate input priority
def calculate_priority(symptoms):
    """
    Ranks the symptoms based on their order of appearance in the model input.
    """
    symptom_priority = []
    symptoms = symptoms.split(",")

    for symptom in symptoms:
        formatted_symptom = format_symptom(symptom)
        if formatted_symptom in symptom_index:
            symptom_priority.append(formatted_symptom)

    return symptom_priority


# ✅ Helper function to predict disease with confidence validation
def predict_disease(symptoms):
    symptoms = symptoms.split(",")
    input_data = [0] * len(symptom_index)

    # Map symptoms to the model input
    for symptom in symptoms:
        formatted_symptom = format_symptom(symptom)
        index = symptom_index.get(formatted_symptom)
        if index is not None:
            input_data[index] = 1

    input_data = np.array(input_data).reshape(1, -1)

    # Model predictions and probabilities
    rf_probs = rf_model.predict_proba(input_data)[0]
    nb_probs = nb_model.predict_proba(input_data)[0]
    svm_probs = svm_model.predict_proba(input_data)[0]

    rf_pred = rf_model.predict(input_data)[0]
    nb_pred = nb_model.predict(input_data)[0]
    svm_pred = svm_model.predict(input_data)[0]

    rf_conf = np.max(rf_probs)
    nb_conf = np.max(nb_probs)
    svm_conf = np.max(svm_probs)

    # Decode predictions
    rf_prediction = encoder.inverse_transform([rf_pred])[0]
    nb_prediction = encoder.inverse_transform([nb_pred])[0]
    svm_prediction = encoder.inverse_transform([svm_pred])[0]

    # Symptom priority based on input order
    symptom_priority = calculate_priority(",".join(symptoms))

    # Check confidence
    if rf_conf < CONFIDENCE_THRESHOLD and nb_conf < CONFIDENCE_THRESHOLD and svm_conf < CONFIDENCE_THRESHOLD:
        return {
            "message": "No confident prediction available",
            "rf_model_confidence": f"{rf_conf:.2f}",
            "nb_model_confidence": f"{nb_conf:.2f}",
            "svm_model_confidence": f"{svm_conf:.2f}",
            "input_priority": symptom_priority
        }

    # Combine predictions
    predictions = [rf_prediction, nb_prediction, svm_prediction]
    final_prediction = Counter(predictions).most_common(1)[0][0]

    result = {
        "rf_model_prediction": rf_prediction,
        "rf_model_confidence": f"{rf_conf:.2f}",
        "naive_bayes_prediction": nb_prediction,
        "nb_model_confidence": f"{nb_conf:.2f}",
        "svm_model_prediction": svm_prediction,
        "svm_model_confidence": f"{svm_conf:.2f}",
        "final_prediction": final_prediction,
        "input_priority": symptom_priority
    }

    return result


# ✅ API View for disease prediction
@csrf_exempt
def predict(request):
    if request.method == 'POST':
        symptoms = request.POST.get("symptoms")
        if symptoms:
            predictions = predict_disease(symptoms)
            return JsonResponse(predictions)
        else:
            return JsonResponse({"error": "No symptoms provided."}, status=400)


# ✅ API for medicine recommendation
@csrf_exempt
def get_medicines(request):
    if request.method == "POST":
        data = json.loads(request.body)
        disease = data.get('disease')
        if disease:
            medicines = load_medicines()
            recommend_medicines = recommend_medicine(disease, medicines)
            return JsonResponse({'medicines': recommend_medicines})
        else:
            return JsonResponse({"Error": "No disease provided"}, status=400)
