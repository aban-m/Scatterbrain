from server.core.pca import pca
from server.db import ops

def jsonify_entries(conn, user_id):
    entries = [dict(x) for x in ops.read_user(conn, user_id)]
    for entry in entries:
        entry['url'] = url_for('api.image', user_id, eid = entry['entry_id'])\
                       if entry['is_image'] else ''
    return {'entries': entries}

def sync_pcas(conn, user_id):
    emb_matrix = ops.read_matrix(conn, user_id, pca = False)
    pca_matrix = pca(emb_matrix, n_components = 2).tolist()
    ops.update_pcas(conn, user_id, pca_matrix)
