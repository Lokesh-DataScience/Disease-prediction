import pandas as pd
from sklearn.preprocessing import LabelEncoder

def load_and_clean_data(filepath):
    data = pd.read_csv(filepath).dropna(axis=1)

    encoder = LabelEncoder()
    data["prognosis"] = encoder.fit_transform(data["prognosis"])

    return data, encoder
