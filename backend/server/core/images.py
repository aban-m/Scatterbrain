import base64
from io import BytesIO
from PIL import Image
import requests
from server.core.api_calls import invoke_openai

config = {
    'params': {
        'max_tokens': 300,
        'temperature': 0,
        'frequency_penalty': 0.3,
        'model': 'gpt-4o-mini'
    },
    'detail': 'low',
    'prompt': '''Give a thorough description of the following image, focusing on the main aspects.''',
    'thumbnail_size': (200, 200)
}

def describe(image: str, is_url: bool, format: str = 'image/jpeg'):
    '''
        image is either a string representing a URL or a base64-encoded image
    '''
    if not is_url:
        image = f'data:{format};base64,{image}'
    
    resp = invoke_openai('/chat/completions', payload =
        {
            **config['params'],
            'messages': [
                {'role': 'user', 'content': [
                    {'type': 'text', 'text': config['prompt']},
                    {'type': 'image_url', 'image_url': {'url': image, 'detail': config['detail']}}
                ]}
            ]
        }
    )
    return resp['choices'][0]['message']['content']

def resize(image: Image.Image, size: tuple):
    ''' Resizes the image *in-place*, returning the resulting bytestream '''
    image.thumbnail(size, Image.LANCZOS)
    output_stream = BytesIO()
    image.save(output_stream, format='JPEG')
    return output_stream.getvalue()
    

def process(image_input: str, is_url: bool):
    ''' Input is either base64-encoded image or a URL to an image. '''
    if is_url:
        resp = requests.get(image_input, headers = {
            'User-Agent': 'scatterbrain v1'
        })
        resp.raise_for_status()
        image_bytes = resp.content
        image_base64 = base64.b64encode(image_bytes).decode('ascii')
    else:
        image_bytes = base64.b64decode(image_input)
        image_base64 = image_input

    image_stream = BytesIO(image_bytes)
    image = Image.open(image_stream)
    width, height = image.width, image.height # preserve the original data

    mini_b64 = base64.b64encode(resize(image, config['thumbnail_size'])).decode('ascii')
    description = describe(image_base64, is_url = False, format = 'image/jpeg')
    
    return {
        'width': width, 'height': height,
        'description': description,
        'mini_b64': mini_b64
    }

