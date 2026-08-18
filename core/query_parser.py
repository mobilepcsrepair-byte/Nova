def analyze_query(query):

    query_lower = query.lower()

    intent = "general"

    if any(word in query_lower for word in [
        "what is",
        "what does",
        "define",
        "meaning"
    ]):
        intent = "definition"


    if any(word in query_lower for word in [
        "compare",
        "difference",
        "vs"
    ]):
        intent = "comparison"


    if any(word in query_lower for word in [
        "compatible",
        "work with",
        "support"
    ]):
        intent = "compatibility"


    return {
        "intent": intent,
        "query": query
    }