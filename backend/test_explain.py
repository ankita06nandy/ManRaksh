from explain import explain_prediction

test_person = {
    "AvegDuratEcerc": 30,
    "Intensity": 3,
    "LivinPlace": "Urban",
    "RelatshpStatus": "Married",

    "EAI1": 2,
    "EAI2": 2,
    "EAI3": 3,
    "EAI4": 2,
    "EAI5": 3,
    "EAI6": 2,

    "EDS1": 2,
    "EDS2": 2,
    "EDS3": 2,
    "EDS4": 2,
    "EDS5": 2,
    "EDS6": 2,
    "EDS7": 2,
    "EDS8": 2,
    "EDS9": 2,
    "EDS10": 2,
    "EDS11": 2,
    "EDS12": 2,
    "EDS13": 2,
    "EDS14": 2,
    "ESD15": 2,
    "EDS16": 2,
    "EDS17": 2,
    "EDS18": 2,
    "EDS19": 2,
    "EDS20": 2,
    "EDS21": 2
}

result = explain_prediction(test_person)

print("\nSHAP EXPLANATION")
print("================")

print("Risk Level:", result["risk_level"])
print("Prediction Class:", result["prediction_class"])

print("\nTop Contributors:")
for item in result["top_contributors"]:
    print(
        f"{item['feature']} | "
        f"Impact: {item['impact']:.4f} | "
        f"{item['direction']}"
    )