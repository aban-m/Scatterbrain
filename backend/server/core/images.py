import base64
from io import BytesIO
from PIL import Image
import requests
from .api_calls import invoke_openai

config = {
    'params': {
        'max_tokens': 300,
        'temperature': 0,
        'frequency_penalty': 0.3
    },
    'prompt': '''Give a thorough description of the following image, focusing on the main aspects.'''
}

def describe_image(image: str | bytes, format: str = 'image/jpeg'):
    '''
        image is either a string representing a URL or a bytes object.
    '''
    if isinstance(image, bytes):
        image = base64.b64encode(io.BytesIO(image)).decode('ascii')     # first, convert to base64
        image = f'data:{format}/base64;base64,{image}'
    
    resp = invoke_openai('/chat/completions', payload =  {
            **config['params'],
            'messages': [
                {'role': 'user', 'content': config['prompt']},
                {'role': 'user', 'content': {'type': 'image_url', 'image_url': image}}
            ]
        }
    )
    return resp['choices'][0]['message']['content']

def resize_image(image_input: str | bytes, size):
    if isinstance(image_input, str):
        response = requests.get(image_input)
        response.raise_for_status() 
        image_bytes = response.content
    else:
        image_bytes = image_input
    
    image_stream = BytesIO(image_bytes)
    with Image.open(image_stream) as image:
        image = image.convert("RGB")
        image.thumbnail(size, Image.LANCZOS)
        output_stream = BytesIO()
        image.save(output_stream, format='JPEG', quality=95)
        return output_stream.getvalue()
    
    