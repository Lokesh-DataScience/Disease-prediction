function predictDisease() {
    let symptoms = document.getElementById("symptoms").value.trim();
    if (symptoms === "") {
        alert("Please enter symptoms!");
        return;
    }

    fetch("https://disease-detection-sipf.onrender.com/api/predict/", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: `symptoms=${encodeURIComponent(symptoms)}`
    })
    .then(response => response.json())
    .then(data => {
        let resultBox = document.getElementById("result");
        resultBox.style.display = "block";
        resultBox.innerHTML = `
            <p><strong>Random Forest:</strong> ${data.rf_model_prediction}</p>
            <p><strong>Naive Bayes:</strong> ${data.naive_bayes_prediction}</p>
            <p><strong>SVM:</strong> ${data.svm_model_prediction}</p>
            <p><strong>Final Prediction:</strong> <span style="color:#ff5757; font-weight:bold;">${data.final_prediction}</span></p>
        `;
    })
    .catch(error => console.error("Error:", error));
}
