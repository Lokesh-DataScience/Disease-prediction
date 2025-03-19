const API_BASE_URL =
    window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost"
        ? "http://127.0.0.1:8000/api/predict/"
        : "https://disease-detection-sipf.onrender.com/api/predict/";

const suggestions = [
    "Itching", "Skin rash", "Nodal skin eruptions", "Continuous sneezing", "Shivering", "Chills", "Joint pain",
    "Stomach pain", "Acidity", "Ulcers on tongue", "Muscle wasting", "Vomiting", "Burning micturition",
    "Spotting urination", "Fatigue", "Weight gain", "Anxiety", "Cold hands and feets", "Mood swings", "Weight loss",
    "Restlessness", "Lethargy", "Patches in throat", "Irregular sugar level", "Cough", "High fever", "Sunken eyes",
    "Breathlessness", "Sweating", "Dehydration", "Indigestion", "Headache", "Yellowish skin", "Dark urine", "Nausea",
    "Loss of appetite", "Pain behind the eyes", "Back pain", "Constipation", "Abdominal pain", "Diarrhoea", "Mild fever",
    "Yellow urine", "Yellowing of eyes", "Acute liver failure", "Fluid overload", "Swelling of stomach", "Swelled lymph nodes",
    "Malaise", "Blurred and distorted vision", "Phlegm", "Throat irritation", "Redness of eyes", "Sinus pressure", "Runny nose",
    "Congestion", "Chest pain", "Weakness in limbs", "Fast heart rate", "Pain during bowel movements", "Pain in anal region",
    "Bloody stool", "Irritation in anus", "Neck pain", "Dizziness", "Cramps", "Bruising", "Obesity", "Swollen legs",
    "Swollen blood vessels", "Puffy face and eyes", "Enlarged thyroid", "Brittle nails", "Swollen extremeties", "Excessive hunger",
    "Extra marital contacts", "Drying and tingling lips", "Slurred speech", "Knee pain", "Hip joint pain", "Muscle weakness",
    "Stiff neck", "Swelling joints", "Movement stiffness", "Spinning movements", "Loss of balance", "Unsteadiness",
    "Weakness of one body side", "Loss of smell", "Bladder discomfort", "Foul smell of urine", "Continuous feel of urine",
    "Passage of gases", "Internal itching", "Toxic look (typhos)", "Depression", "Irritability", "Muscle pain", "Altered sensorium",
    "Red spots over body", "Belly pain", "Abnormal menstruation", "Dischromic patches", "Watering from eyes", "Increased appetite",
    "Polyuria", "Family history", "Mucoid sputum", "Rusty sputum", "Lack of concentration", "Visual disturbances",
    "Receiving blood transfusion", "Receiving unsterile injections", "Coma", "Stomach bleeding", "Distention of abdomen",
    "History of alcohol consumption", "Fluid overload.1", "Blood in sputum", "Prominent veins on calf", "Palpitations",
    "Painful walking", "Pus filled pimples", "Blackheads", "Scurring", "Skin peeling", "Silver like dusting", "Small dents in nails",
    "Inflammatory nails", "Blister", "Red sore around nose", "Yellow crust ooze"
];

function showSuggestions(value) {
    const suggestionsBox = document.getElementById("suggestions");
    suggestionsBox.innerHTML = "";

    if (value) {
        // Split by commas and trim spaces
        const symptoms = value.split(',').map(s => s.trim());
        const lastSymptom = symptoms[symptoms.length - 1];  // Show suggestions only for the last symptom

        if (lastSymptom) {
            const filteredSuggestions = suggestions.filter(suggestion =>
                suggestion.toLowerCase().includes(lastSymptom.toLowerCase())
            );

            filteredSuggestions.forEach(suggestion => {
                const suggestionDiv = document.createElement("div");
                suggestionDiv.textContent = suggestion;
                suggestionDiv.onclick = () => selectSuggestion(suggestion);
                suggestionsBox.appendChild(suggestionDiv);
            });
        }
    }
}

function selectSuggestion(suggestion) {
    const symptomsInput = document.getElementById("symptoms");
    let symptoms = symptomsInput.value.trim();

    if (symptoms) {
        let symptomList = symptoms.split(',').map(s => s.trim());
        symptomList[symptomList.length - 1] = suggestion;  // Replace only the last symptom with the selected suggestion
        symptomsInput.value = symptomList.join(', ');
    } else {
        symptomsInput.value = suggestion;
    }

    document.getElementById("suggestions").innerHTML = "";
}

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
            <p><strong>You have got:</strong> <span style="color:#ff5757; font-weight:bold;">${data.final_prediction}</span></p>
        `;
    })
    .catch(error => console.error("Error:", error));
}

function getMedicines() {
    let disease = document.getElementById("result").querySelector("p span").innerText;
    if (!disease) {
        alert("Please get a disease prediction first!");
        return;
    }

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

function goBack() {
    let resultBox = document.getElementById("result");
    let medicinesDiv = document.getElementById("medicines");
    let backButton = document.getElementById("backButton");

    resultBox.style.display = "block";
    medicinesDiv.innerHTML = "";
    backButton.style.display = "none";
}
