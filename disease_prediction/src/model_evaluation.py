from sklearn.metrics import accuracy_score, confusion_matrix
import seaborn as sns
import matplotlib.pyplot as plt

def evaluate_model(model, X_test, y_test, model_name):
    preds = model.predict(X_test)
    accuracy = accuracy_score(y_test, preds)
    print(f"{model_name} Accuracy: {accuracy * 100:.2f}%")
    
    cm = confusion_matrix(y_test, preds)
    sns.heatmap(cm, annot=True, cmap="Blues")
    plt.title(f"{model_name} Confusion Matrix")
    plt.show()