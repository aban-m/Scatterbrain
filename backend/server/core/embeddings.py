import requests
import os

OPENAI_API_KEY = os.environ['OPENAI_API_KEY']

def embed(text):
    resp = requests.post('https://api.openai.com/v1/embeddings',
        json = {
            'model': 'text-embedding-3-small',
            'dimensions': 256,
            'input': text
        },
        headers = {
            'Authorization': f'Bearer {OPENAI_API_KEY}'
        }
    )
    if not resp.ok(): print(resp); print(resp.data)
    return resp.json()['data'][0]['embedding']