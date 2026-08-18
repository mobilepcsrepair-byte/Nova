from sentence_transformers import SentenceTransformer


model = SentenceTransformer(
    "all-MiniLM-L6-v2"
)


def create_embeddings(chunks):

    texts = [
        chunk["text"]
        for chunk in chunks
    ]

    vectors = model.encode(texts)

    return vectors