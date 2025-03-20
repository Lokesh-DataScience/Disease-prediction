from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from webdriver_manager.chrome import ChromeDriverManager
import time
import json
import os
import warnings
warnings.filterwarnings('ignore')

# ✅ Automatically download and use ChromeDriver
service = Service(ChromeDriverManager().install())
driver = webdriver.Chrome(service=service)

def scrape_medicines(disease_name: str):
    driver.get("https://www.1mg.com/")
    time.sleep(2)  # Wait for page to load

    # Locate the search bar and enter the disease name
    search_bar = driver.find_element(By.XPATH, "//input[@id='srchBarShwInfo']")
    search_bar.send_keys(disease_name)
    search_bar.send_keys(Keys.RETURN)
    
    time.sleep(3)  # Wait for results to load

    # Get all product elements
    product_elements = driver.find_elements(By.CLASS_NAME, "style__product-box___3oEU6")

    results = []
    
    for product in product_elements:
        try:
            # Extract rating
            rating_element = product.find_element(By.CLASS_NAME, "CardRatingDetail__ratings-container___2ZTSK")
            rating = float(rating_element.text.strip())
        except:
            rating = 0.0  # If no rating is found, assume 0

        # ✅ Only process medicines with rating >= 4.5
        if rating >= 4:
            try:
                link_element = product.find_element(By.CLASS_NAME, "style__product-link___1hWpa")
                medicine_url = link_element.get_attribute("href")
                driver.get(medicine_url)
                time.sleep(3)

                try:
                    name = driver.find_element(By.TAG_NAME, "h1").text
                except:
                    name = "Not available"

                try:
                    # Extract and clean description
                    description_elements = driver.find_elements(By.CLASS_NAME, "ProductDescription__description-content___A_qCZ")
                    description = " ".join([desc.text.strip() for desc in description_elements])  

                    # Remove "Frequently Asked Questions:" and everything after it
                    if "Frequently Asked Questions:" in description:
                        description = description.split("Frequently Asked Questions:")[0].strip()
                    
                except:
                    description = "Not available"

                # Store the scraped details
                results.append({
                    "Disease Name": disease_name,
                    "Medicine Name": name,
                    "Rating": rating,
                    "Description": description,
                    "URL": medicine_url
                })

                driver.back()  # Go back to search results
                time.sleep(2)

            except Exception as e:
                print(f"Error processing a product: {e}")

    return results

disease = "hepatitis B" #NO AIDS DATA
medicines = scrape_medicines(disease)

# Remove duplicates based on Medicine Name
unique_medicines = {}
for med in medicines:
    unique_medicines[med['Medicine Name']] = med

# Convert unique medicines back to a list
medicines_data = list(unique_medicines.values())

# Define the file path
json_file_path = '../data/medicines_data.json'

# Check if the file exists and is not empty
if os.path.exists(json_file_path) and os.path.getsize(json_file_path) > 0:
    # Load existing data from the JSON file
    with open(json_file_path, 'r') as json_file:
        existing_data = json.load(json_file)
else:
    # If the file doesn't exist or is empty, start with an empty list
    existing_data = []

# Append the new data to the existing data
existing_data.extend(medicines_data)

# Prepare the data to be saved in JSON format
medicines_data_for_json = []
for med in existing_data:
    medicine_info = {
        "Disease Name": med['Disease Name'],
        "Medicine Name": med['Medicine Name'],
        "Rating": med['Rating'],
        "Description": med['Description'],
        "URL": med['URL']
    }
    medicines_data_for_json.append(medicine_info)

# Save the updated data back to the JSON file
with open(json_file_path, 'w') as json_file:
    json.dump(medicines_data_for_json, json_file, indent=4)

driver.quit()  # Close the browser
