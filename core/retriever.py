import chromadb


client = chromadb.PersistentClient(
    path="./vector_db"
)


collection = client.get_or_create_collection(
    name="corebase"
)


def add_documents(chunks, embeddings):

    for i, chunk in enumerate(chunks):

        collection.add(
            ids=[str(i)],
            embeddings=[
                embeddings[i]
            ],
            documents=[
                chunk["text"]
            ],
            metadatas=[
                {
                    "source": chunk["source"],
                    "category": chunk["category"]
                }
            ]
        )


def search(query_embedding):

    results = collection.query(
        query_embeddings=[
            query_embedding
        ],
        n_results=5
    )

    return results