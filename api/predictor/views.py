import joblib
import numpy as np
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from scipy import stats
from collections import Counter
import warnings
warnings.filterwarnings('ignore')
from django.shortcuts import render

def home(request):
    return render(request, 'predictor//index.html')



# Load models
svm_model = joblib.load("predictor//models//svm_model.pkl")
nb_model = joblib.load("predictor//models//nb_model.pkl")
rf_model = joblib.load("predictor//models//rf_model.pkl")

# Load the encoder and symptom index
encoder = joblib.load("predictor//models//encoder.pkl")
symptom_index = joblib.load("predictor//models//symptom_index.pkl")

# Helper function to predict disease

# Helper function to predict disease
def predict_disease(symptoms):
    symptoms = symptoms.split(",")
    input_data = [0] * len(symptom_index)

    for symptom in symptoms:
        index = symptom_index.get(symptom.strip())
        if index is not None:
            input_data[index] = 1

    input_data = np.array(input_data).reshape(1, -1)

    # Get predictions from all models
    rf_prediction = encoder.inverse_transform([rf_model.predict(input_data)[0]])
    nb_prediction = encoder.inverse_transform([nb_model.predict(input_data)[0]])
    svm_prediction = encoder.inverse_transform([svm_model.predict(input_data)[0]])

    # Use Counter to calculate the most common prediction
    predictions = [rf_prediction[0], nb_prediction[0], svm_prediction[0]]
    final_prediction = Counter(predictions).most_common(1)[0][0]  # Get the most common prediction

    result = {
        "rf_model_prediction": rf_prediction[0],
        "naive_bayes_prediction": nb_prediction[0],
        "svm_model_prediction": svm_prediction[0],
        "final_prediction": final_prediction
    }

    return result


# API View for disease prediction
@csrf_exempt
def predict(request):
    if request.method == 'POST':
        symptoms = request.POST.get("symptoms")
        if symptoms:
            predictions = predict_disease(symptoms)
            return JsonResponse(predictions)
        else:
            return JsonResponse({"error": "No symptoms provided."}, status=400)

