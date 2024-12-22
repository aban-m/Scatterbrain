from .api_calls import invoke_openai

def embed(text):
    resp = invoke_openai('/embeddings', {
        'model': 'text-embedding-3-small',
        'input': text
    })

    return resp['data'][0]['embedding']