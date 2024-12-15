import requests
import os

OPENAI_API_KEY = os.environ['OPENAI_API_KEY']

def embed(text):
    return requests.post('https://api.openai.com/v1/embeddings',
        json = {
            'model': 'text-embedding-3-small',
            'dimensions': 256,
            'input': text
        },
        headers = {
            'Authorization': f'Bearer {OPENAI_API_KEY}'
        }
    ).json()['data'][0]['embedding']