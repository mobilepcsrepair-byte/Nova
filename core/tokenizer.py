def create_chunks(documents):

    chunks = []

    for document in documents:

        metadata = document["content"].get(
            "metadata",
            {}
        )

        data = document["content"].get(
            "data",
            []
        )

        for entry in data:

            chunks.append({
                "text": str(entry),
                "source": document["file"],
                "category": metadata.get("document")
            })

    return chunks