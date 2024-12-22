from server.core.pca import pca
from server.db import ops


def sync_pcas(conn, user_id):
    emb_matrix = ops.read_matrix(conn, user_id, pca = False)
    pca_matrix = pca(emb_matrix, n_components = 2).tolist()
    ops.update_pcas(conn, user_id, pca_matrix)
