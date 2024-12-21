import uuid
from flask import Flask
from flask_cors import CORS

from server import apiviews
from backend.server.db import base

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secretkey'
CORS(app, supports_credentials=True) # Access-Control-Allow-Credentials: true
DATABASE = 'main.db'

@app.route('/')
def index():
    return '<h1>Backend server running - 1b</h1>'

# register api.bp as a blueprint with url prefix /api/...
app.register_blueprint(apiviews.bp, url_prefix='/api')
app.before_request(base.get_db)
app.teardown_appcontext(base.close_db)