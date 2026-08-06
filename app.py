from core.loader import load_documents
from core.tokenizer import create_chunks
from core.embeddings import create_embeddings
from core.retriever import add_documents
from core.query import search_corebase, display_results


def build_index():

    docs = load_documents(
        "./knowledge"
    )


    chunks = create_chunks(
        docs
    )


    if len(chunks) == 0:
        print(
            "No knowledge entries found."
        )
        return


    vectors = create_embeddings(
        chunks
    )


    add_documents(
        chunks,
        vectors
    )


    print(
        f"Indexed {len(chunks)} entries."
    )


def chat():

    print("""
================================
        Nova v0.1
================================

Type 'exit' to quit.
""")


    while True:

        question = input(
            "\nCoreBase> "
        )


        if question.lower() == "exit":
            break


        results = search_corebase(
            question
        )


        display_results(
            results
        )


if __name__ == "__main__":

    build_index()

    chat()