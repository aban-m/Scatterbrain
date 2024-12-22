from flask import Flask
from flask_cors import CORS

from server import apiviews

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secretkey'
CORS(app, supports_credentials=True) # Access-Control-Allow-Credentials: true

@app.route('/')
def index():
    return '<h1>Backend server running - 1b</h1>'

# register api.bp as a blueprint with url prefix /api/...
app.register_blueprint(apiviews.bp, url_prefix='/api')
