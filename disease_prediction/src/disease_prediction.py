import numpy as np
import statistics

def predict_disease(symptoms, symptom_index, predictions_classes, models):
    symptoms = symptoms.split(",")
    
    # Creating input data for the models
    input_vector = [0] * len(symptom_index)
    
    for symptom in symptoms:
        symptom = symptom.strip().capitalize()  # Normalize capitalization
        if symptom in symptom_index:
            index = symptom_index[symptom]
            input_vector[index] = 1
        else:
            print(f"Warning: Symptom '{symptom}' not found in symptom_index!")

    input_vector = np.array(input_vector).reshape(1, -1)

    # Generating predictions
    rf_prediction = predictions_classes[models["rf"].predict(input_vector)[0]]
    nb_prediction = predictions_classes[models["nb"].predict(input_vector)[0]]
    svm_prediction = predictions_classes[models["svm"].predict(input_vector)[0]]

    # Making final prediction
    final_prediction = statistics.mode([rf_prediction, nb_prediction, svm_prediction])

    predictions = {
        "rf_model_prediction": rf_prediction,
        "naive_bayes_prediction": nb_prediction,
        "svm_model_prediction": svm_prediction,
        "final_prediction": final_prediction
    }

    return predictions
