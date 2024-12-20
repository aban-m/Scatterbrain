import uuid
from cachelib.file import FileSystemCache
from flask import Flask, session
from flask_cors import CORS
from flask_session import Session
from server import state
from server import apiviews

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secretkey'
app.config.update(dict(
    SESSION_TYPE = 'filesystem',
    SESSION_PERMANENT = True,
    SESSION_FILE_THRESHOLD = 100,
    PERMANENT_SESSION_LIFETIME = 86400,
    SESSION_SERIALIZATION_FORMAT = 'json',
    SESSION_CACHELIB = FileSystemCache(threshold=500, cache_dir='/.sessions')
))


CORS(app)
sess = Session()
sess.init_app(app)

@app.before_request
def initiate_session():
    if 'session_id' not in session:
        session['session_id'] = str(uuid.uuid4())
        state.clear()
    print(f'request from {session["session_id"]}')

@app.route('/')
def index():
    return '<h1>Backend server running - 1a</h1>'


# register api.bp as a blueprint with url prefix /api/...
app.register_blueprint(apiviews.bp, url_prefix='/api')