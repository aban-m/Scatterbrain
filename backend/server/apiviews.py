import uuid
import base64
from io import BytesIO
from flask import Blueprint, request, session, g, abort, send_file, url_for
from server import utils
from server.core import images
from server.core.embeddings import embed
from server.db.base import connect
from server.db import ops

bp = Blueprint('api', __name__)

@bp.route('/')
def root():
    return {'ok': True}

@bp.before_request
def get_db():
    if not 'user_id' in session:
        session['user_id'] = str(uuid.uuid4())
    if 'db' not in g:
        g.db = connect()

@bp.teardown_request
def close_db(exception):
    db = g.pop('db', None)
    if db is not None:
        db.close()

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

@bp.route('/image/<uid>/<int:eid>', methods=('GET',))
def image(uid, eid):
    #if uid != session['user_id']:
    #    abort(401)
    b64 = ops.get_image(g.db, uid, eid)
    if b64 is None:
        abort(404)
    stream = BytesIO(base64.b64decode(b64))
    return send_file(stream, mimetype='image/jpeg')
    
@bp.route('/pca', methods=('PATCH', 'GET'))
def pca():
    if request.method == 'PATCH':
        utils.sync_pcas(g.db, session['user_id'])
        return {'ok': True}
    
    elif request.method == 'GET':
        if not ops.get_synced(g.db, session['user_id']):
            utils.sync_pcas(g.db, session['user_id'])
        pcas = ops.read_matrix(g.db, session['user_id'], pca = True)
        return {'pca': list(zip(*pcas))}        # the tuples are converted to lists automatically

@bp.route('/embeddings', methods=('GET',))
def embeddings():
    return {'embeddings': ops.read_matrix(g.db, session['user_id'], pca = False)}

@bp.route('/entries', methods=('POST','GET', 'DELETE', 'PATCH'))
def entries():
    # get the json of the request
    if request.method == 'GET':
        entries = [dict(x) for x in ops.read_user(g.db, session['user_id'])]
        for entry in entries:
            entry['url'] = url_for('api.image', uid = session['user_id'], eid = entry['entry_id'])\
                           if entry['is_image'] else ''
        return {'entries': entries}

    
    elif request.method == 'DELETE':
        tgt = request.json['target']
        if tgt == 'all':
            ops.delete_entries(g.db, session['user_id'])
        else:
            ops.delete_entry(g.db, session['user_id'], tgt)
        return {'ok': True}
            
    elif request.method == 'PATCH':
        tgt, new_text = request.json['target'], request.json['new']
        new_embedding = embed(new_text)
        ops.update_entry(g.db, session['user_id'], tgt, new_text, new_embedding)
        return {'ok': True}

    elif request.method == 'POST':
        is_text = 'image' not in request.json

        if is_text:
            text = request.json['text']
            embedding = embed(text)
            ops.create_text_entry(g.db, session['user_id'], text, embedding)

        else:
            image_input = request.json['image']
            is_url = request.json['is_url']
            result = images.process(image_input, is_url)
            embedding = embed(result['description'])
            ops.create_image_entry(g.db, session['user_id'], mini_b64 = result['mini_b64'],
                                  height = result['height'], width = result['width'],
                                  description = result['description'], embedding = embedding)
            
        return {'ok': True}

    else:
        raise NotImplementedError()


@bp.route('/whoami')
def whoami():
    return {'user_id': session['user_id']}
