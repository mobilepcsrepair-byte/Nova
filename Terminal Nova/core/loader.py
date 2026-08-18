import json
import os


def load_documents(folder):
    documents = []

    for file in os.listdir(folder):
        if file.endswith(".json"):
            path = os.path.join(folder, file)

            with open(path, "r", encoding="utf-8") as f:
                data = json.load(f)

            documents.append({
                "file": file,
                "content": data
            })

    return documents