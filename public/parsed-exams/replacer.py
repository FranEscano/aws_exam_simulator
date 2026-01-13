import json

# Load original exam
with open("exam19.json", "r", encoding="utf-8") as f:
    exam = json.load(f)

# Load explanations
with open("explanations.json", "r", encoding="utf-8") as f:
    explanations = json.load(f)

# Create lookup dictionary: {id: explanation}
explanation_map = {e["id"]: e["explanation"] for e in explanations}

# Inject explanations
for question in exam["questions"]:
    qid = question["id"]
    if qid in explanation_map:
        question["explanation"] = explanation_map[qid]

# Save merged file
with open("exam19_with_explanations.json", "w", encoding="utf-8") as f:
    json.dump(exam, f, indent=2, ensure_ascii=False)

print("✅ exam19_with_explanations.json created successfully")
