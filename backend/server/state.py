from flask import session
from server.core import pca

def add(text, vector: list):
    session['texts'].append(text)
    session['embeddings'].append(vector)
    session['pca-synced'] = False
    session.modified = True
    
    print(f'now has {len(session["texts"])} texts and {len(session["embeddings"])} embeddings')

def clear():
    session['texts'] = []
    session['embeddings'] = []
    session['pca'] = []

    session['pca-synced'] = True
    session.modified = True

def sync_pca():
    session['pca'] = pca(session['embeddings'])
    session['pca-synced'] = True
    session.modified = True

def remove(index):
    session['texts'].pop(index)
    session['embeddings'].pop(index)
    session['pca-synced'] = False
    session.modified = True

def jsonify(full):
    what = session['embeddings'] if full else session['pca']
    return {
        'embeddings': what,
        'texts': session['texts'],
        'pca': not full
    }
