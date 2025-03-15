# Disease Prediction using Machine Learning

This project aims to predict diseases based on symptoms using machine learning models. The project utilizes multiple classifiers and combines their predictions to improve accuracy.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Models](#models)
- [Evaluation](#evaluation)
- [Contributing](#contributing)
- [License](#license)

## Installation

### Clone the repository:

```bash
git clone https://github.com/Lokesh-DataScience/Disease-prediction.git
cd Disease_prediction
```

### Create a virtual environment and activate it:

```bash
python -m venv venv
./venv/Scripts/activate  # On Windows
# On Linux/macOS: source venv/bin/activate
```

### Install the required packages:

```bash
pip install -r requirements.txt
```

## Usage

### Data Preprocessing:

Load and clean the dataset using `\load_and_clean_data\` function from `\src/data_preprocessing.py\`.

### Model Training:

Train the models using `\train_models\` function from `\src/model_training.py\`.

### Model Evaluation:

Evaluate the models using `\evaluate_model\` function from `\src/model_evaluation.py\`.

### Disease Prediction:

Predict diseases based on symptoms using `\predict_disease\` function from `\src/disease_prediction.py\`.

### Run the Main Script:

```bash
python main.py
```

Execute the main script to train models, evaluate them, and make predictions.

## Project Structure

```
Disease_prediction/
├── dataset/
│   ├── Training.csv
│   ├── Testing.csv
├── models/
│   ├── svm_model.pkl
│   ├── nb_model.pkl
│   ├── rf_model.pkl
├── notebooks/
│   ├── Disease_prediction.ipynb
├── src/
│   ├── data_preprocessing.py
│   ├── model_training.py
│   ├── model_evaluation.py
│   ├── model_inference.py
│   ├── disease_prediction.py
│   ├── utils.py
├── .gitignore
├── README.md
├── requirements.txt
├── main.py
```

## Models

The project uses the following machine learning models:

- Support Vector Machine (SVM)
- Naive Bayes (GaussianNB)
- Random Forest

## Evaluation

The models are evaluated using accuracy and confusion matrix. The evaluation results are displayed using seaborn heatmaps.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request.

## License"

This project is licensed under the MIT License. See the `\LICENSE\` file for details.
