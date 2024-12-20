import uuid
from flask import Blueprint, request, session
from server import state
from server.core import embed

print(__name__)
bp = Blueprint('api', __name__)

@bp.route('/')
def root():
	return {'ok': True}

@bp.route('/echo', methods=('POST','GET'))
def echo():
	# get the json of the request
	if request.method == 'GET':
		return {
			'echo': '.'
		}
	else:
		return {
			'echo': request.json['text'].upper()
		}
	
@bp.route('/embeddings', methods=('POST','GET', 'DELETE', 'PATCH'))
def embeddings():
	# get the json of the request
	if request.method == 'GET':
		return state.jsonify(full=True)
	elif request.method == 'DELETE':
		tgt = request.json['target']
		if tgt == 'all':
			state.clear()
		else:
			state.delete(tgt)
		return state.jsonify(False)
	elif request.method == 'PATCH':
		tgt, new_text = request.json['target'], request.json['new']
		new_embedding = embed(new_text)
		state.update(tgt, new_text, new_embedding)
		return state.jsonify(False)
	else:
		text = request.json['text']
		vector = embed(text)
		state.add(text, vector)
		return {'ok': True}
	
@bp.route('/pca', methods=('GET',))
def pca_all():
	if session['pca-synced']:
		return state.jsonify(full=False)
	else:
		state.sync_pca()
		return state.jsonify(full=False)

## @bp.route('/embeddings/<text>')
## def embedding_text(text):
## 	vector = embed(text)
## 	state.add(text, vector)
## 	return {'ok': True}

@bp.route('/session')
def session_id():
	return {'session_id': session['session_id']}