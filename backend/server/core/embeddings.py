from .api_calls import invoke_openai

EMBEDDING_MODEL = "text-embedding-3-small"


def embed(text: str) -> list[float]:
    resp = invoke_openai("/embeddings", {"model": EMBEDDING_MODEL, "input": text})
    return resp["data"][0]["embedding"]


def multi_embed(texts: list[str]) -> list[list[float]]:
    resp = invoke_openai("/embeddings", {"model": EMBEDDING_MODEL, "input": texts})
    return [obj["embedding"] for obj in resp["data"]]
