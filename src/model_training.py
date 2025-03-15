from sklearn.svm import SVC
from sklearn.naive_bayes import GaussianNB
from sklearn.ensemble import RandomForestClassifier

def train_models(X, y):
    svm_model = SVC(probability=True)
    nb_model = GaussianNB()
    rf_model = RandomForestClassifier(random_state=18)

    svm_model.fit(X, y)
    nb_model.fit(X, y)
    rf_model.fit(X, y)

    return svm_model, nb_model, rf_model
