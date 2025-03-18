const API_BASE_URL =
    window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost"
        ? "http://127.0.0.1:8000/api/predict/"
        : "https://disease-detection-sipf.onrender.com/api/predict/";

function predictDisease() {
    let symptoms = document.getElementById("symptoms").value.trim();
    if (symptoms === "") {
        alert("Please enter symptoms!");
        return;
    }

    fetch(API_BASE_URL, {
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

// Fix the fetch URL
function getMedicines() {
    let disease = document.getElementById("result").querySelector("p span").innerText;
    if (!disease) {
        alert("Please get a disease prediction first!");
        return;
    }

    // Use the correct endpoint URL
    const MEDICINE_API_URL = window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost"
        ? "http://127.0.0.1:8000/api/medicines/"
        : "https://disease-detection-sipf.onrender.com/api/medicines/";

    fetch(MEDICINE_API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ disease: disease })
    })
    .then(response => response.json())
    .then(data => {
        let medicinesDiv = document.getElementById("medicines");
        if (data.medicines && data.medicines.length > 0) {
            let medicineHTML = `<h3>Recommended Medicines:</h3>`;
            data.medicines.forEach(med => {
                medicineHTML += `
                    <div class="medicine">
                        <h4>${med["Medicine Name"]}</h4>
                        <p>Rating: ${med.Rating}</p>
                        <p class="description">${med.Description.slice(0, 100)}... 
                            <button class="more" onclick="showMore('${med.Description}')">More</button>
                        </p>
                        <a href="${med.URL}" target="_blank">More Info</a>
                    </div>
                    <hr>
                `;
            });
            medicinesDiv.innerHTML = medicineHTML;
        } else {
            medicinesDiv.innerHTML = `<p>No medicines found for this disease.</p>`;
        }
    })
    .catch(error => console.error("Error:", error));
}
