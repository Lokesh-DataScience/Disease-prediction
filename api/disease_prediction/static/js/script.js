const API_BASE_URL =
    window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost"
        ? "http://127.0.0.1:8000/api/predict/"
        : "https://disease-detection-sipf.onrender.com/api/predict/";

const MEDICINE_API_URL = 
    window.location.hostname === "127.0.0.1" || window.location.hostname === "localhost"
        ? "http://127.0.0.1:8000/api/medicines/"
        : "https://disease-detection-sipf.onrender.com/api/medicines/";

// ✅ Disease-symptom mapping from your file
const diseaseSymptoms = [
    ["Itching", "Nodal skin eruptions", "Skin rash"],
    ["Chills", "Continuous sneezing", "Shivering"],
    ["Acidity", "Cough", "Stomach pain", "Ulcers on tongue", "Vomiting"],
    ["Abdominal pain", "Itching", "Loss of appetite", "Nausea", "Vomiting", "Yellowish skin"],
    ["Burning micturition", "Itching", "Skin rash", "Stomach pain"],
    ["Abdominal pain", "Indigestion", "Loss of appetite", "Passage of gases", "Vomiting"],
    ["High fever", "Muscle wasting", "Patches in throat"],
    ["Blurred and distorted vision", "Excessive hunger", "Fatigue", "Increased appetite", "Irregular sugar level", "Lethargy", "Obesity", "Restlessness", "Weight loss"],
    ["Dehydration", "Sunken eyes", "Vomiting"],
    ["Breathlessness", "Cough", "Family history", "Fatigue", "High fever"],
    ["Chest pain", "Dizziness", "Headache", "Loss of balance"],
    ["Acidity", "Blurred and distorted vision", "Depression", "Excessive hunger", "Headache", "Indigestion", "Irritability", "Stiff neck"],
    ["Back pain", "Dizziness", "Neck pain", "Weakness in limbs"],
    ["Headache", "Vomiting", "Weakness of one body side"],
    ["Dark urine", "Fatigue", "High fever", "Itching", "Vomiting", "Weight loss", "Yellowish skin"],
    ["Chills", "Diarrhoea", "Headache", "High fever", "Nausea", "Sweating", "Vomiting"],
    ["Fatigue", "Headache", "High fever", "Itching", "Lethargy", "Loss of appetite", "Malaise", "Mild fever", "Skin rash", "Swelled lymph nodes"],
    ["Back pain", "Chills", "Fatigue", "Headache", "High fever", "Joint pain", "Loss of appetite", "Malaise", "Muscle pain", "Nausea", "Pain behind the eyes", "Skin rash", "Vomiting"],
    ["Abdominal pain", "Chills", "Constipation", "Diarrhoea", "Fatigue", "Headache", "High fever", "Nausea", "Toxic look (typhos)", "Vomiting"],
    ["Blackheads", "Pus filled pimples", "Skin rash"],
    ["Bladder discomfort", "Burning micturition", "Foul smell of urine"],
    ["Joint pain", "Silver like dusting", "Skin peeling", "Skin rash", "Small dents in nails"],
    ["Blister", "High fever", "Red sore around nose", "Skin rash"]
];


// ✅ Show suggestions dynamically by matching symptom sets


function showSuggestions(value) {
    const suggestionsBox = document.getElementById("suggestions");
    suggestionsBox.innerHTML = "";

    if (!value) return;

    const query = value.trim().toLowerCase();
    const matchingSets = new Set();

    // Iterate over the array of symptom sets
    diseaseSymptoms.forEach(set => {
        if (set.some(symptom => symptom.toLowerCase().includes(query))) {
            matchingSets.add(set.join(', '));  // Store as a single string to prevent duplicates
        }
    });

    // Display unique matching sets
    matchingSets.forEach(set => {
        const suggestionDiv = document.createElement("div");
        suggestionDiv.textContent = set;
        suggestionDiv.onclick = () => selectSuggestion(set);
        suggestionsBox.appendChild(suggestionDiv);
    });
}

let selectedSymptoms = new Set();

// ✅ Select the suggested symptom set
function selectSuggestion(symptoms) {
    const symptomsInput = document.getElementById("symptoms");

    // Add selected symptoms to the input field
    symptomsInput.value = symptoms;

    // Track the selected set
    selectedSymptoms.clear();
    symptoms.split(',').map(s => s.trim()).forEach(symptom => {
        selectedSymptoms.add(symptom.toLowerCase());
    });

    document.getElementById("suggestions").innerHTML = "";
}


// ✅ Predict disease with confidence validation
function predictDisease() {
    let symptoms = document.getElementById("symptoms").value.trim();

    if (symptoms === "") {
        alert("Please enter symptoms!");
        return;
    }

    let symptomList = symptoms.split(',').map(s => s.trim().toLowerCase());

    // Validation: Check if symptoms match any predefined set
    let isValid = diseaseSymptoms.some(set => 
        symptomList.every(symptom => set.map(s => s.toLowerCase()).includes(symptom))
    );

    if (!isValid) {
        alert("Please choose symptoms from the suggestion box!!");
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

        if (data.message) {
            resultBox.innerHTML = `
                <p><strong>Prediction:</strong> ${data.message}</p>
            `;
        } else {
            resultBox.innerHTML = `
                <p><strong>You have got:</strong> 
                <span style="color:#ff5757; font-weight:bold;">${data.final_prediction}</span></p>`;
        }
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