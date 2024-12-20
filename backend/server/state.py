import time
from flask import session
from server.core import pca

def add(text, vector: list):
    session['texts'].append(text)
    session['embeddings'].append(vector)
    session['ids'].append(max(session['ids'], default=0) + 1)
    session['pca-synced'] = False
    session.modified = True
    
    print(f'now has {len(session["texts"])} texts and {len(session["embeddings"])} embeddings')

def clear():
    session['texts'] = []
    session['embeddings'] = []
    session['pca'] = []
    session['ids'] = []

    session['pca-synced'] = True
    session.modified = True

def sync_pca():
    session['pca'] = pca(session['embeddings'])
    session['pca-synced'] = True
    session.modified = True

def delete(id):
    index = [i for i, e in enumerate(session['ids']) if e == id]
    if not index:
        raise IndexError(f'Cannot find id {id}')
    index = index[0]

    session['texts'].pop(index)
    session['embeddings'].pop(index)
    session['ids'].pop(index)
    session['pca-synced'] = False
    session.modified = True

def update(id, text, embedding):
    index = [i for i, e in enumerate(session['ids']) if e == id]
    if not index:
        raise IndexError(f'Cannot find id {id}')
    index = index[0]

    session['texts'][index] = text
    session['embeddings'][index] = embedding
    session['pca-synced'] = False
    session.modified = True   

def jsonify(full):
    what = session['embeddings'] if full else session['pca']
    return {
        'embeddings': what,
        'texts': session['texts'],
        'pca': not full,
        'ids': session['ids']
    }

