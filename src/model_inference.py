import statistics
from scipy import stats

def combine_predictions(svm_preds, nb_preds, rf_preds, predictions_classes):
    final_preds = [stats.mode([i, j, k])[0][0] for i, j, k in zip(svm_preds, nb_preds, rf_preds)]
    final_predictions = [predictions_classes[pred] for pred in final_preds]
    return final_predictions