from flask import Flask, render_template
from flask_cors import CORS
from . import api

app = Flask(__name__)
CORS(app)

app.register_blueprint(api.bp, url_prefix='/api')