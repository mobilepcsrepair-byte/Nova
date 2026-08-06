import chromadb
from sentence_transformers import SentenceTransformer


# Load embedding model
model = SentenceTransformer(
    "all-MiniLM-L6-v2"
)


# Load existing vector database
client = chromadb.PersistentClient(
    path="./vector_db"
)


collection = client.get_or_create_collection(
    name="corebase"
)


def search_corebase(question, results=5):

    # Convert question into vector
    query_vector = model.encode(
        question
    ).tolist()


    # Search database
    output = collection.query(
        query_embeddings=[
            query_vector
        ],
        n_results=results
    )


    return output


def display_results(results):

    documents = results.get(
        "documents",
        []
    )

    metadata = results.get(
        "metadatas",
        []
    )


    if not documents or not documents[0]:
        print("\nNo matches found.")
        return


    print("\n--- CoreBase Results ---\n")


    for i, doc in enumerate(documents[0]):

        print(f"Result {i+1}:")
        print(doc)

        if metadata:
            print(
                "Source:",
                metadata[0][i].get("source")
            )

        print("------------------------")