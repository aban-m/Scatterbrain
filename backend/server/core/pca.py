import numpy

def pca(L):
    # for now, pick the first 3 coordinates of each vector
    return numpy.array(L)[:, :2].T.tolist()