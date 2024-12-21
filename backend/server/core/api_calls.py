import requests
import os
import logging

OPENAI_API_KEY = os.environ['OPENAI_API_KEY']
BASE_URL = 'https://api.openai.com/v1'

def invoke_openai(endpoint, payload):
    url = f'{BASE_URL}{endpoint}'
    resp = requests.post(url, 
        headers = {'Authorization': f'Bearer {OPENAI_API_KEY}'},
        json = payload
    )
    if not resp.ok:
        logging.error(f'Request failed with HTTP {resp.status_code}.\nContent: {resp.content}.')
        resp.raise_for_status()
    return resp.json()