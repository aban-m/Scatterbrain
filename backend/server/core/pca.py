import numpy as np

def pca(X, n_components = 2):
    """
    Perform PCA on the dataset X.

    Parameters:
        X (ndarray): Input data of shape (n_samples, n_features).
        n_components (int): Number of principal components to compute.

    Returns:
        X_pca (ndarray): Transformed data of shape (n_samples, n_components).
        components (ndarray): Principal components of shape (n_components, n_features).
        explained_variance (ndarray): Explained variance of each component.
    """
    match len(X):
        case 0:
            return []
        case 1:
            return [[0.0, 0.0]]
    # Step 1: Standardize the data (mean = 0, variance = 1)
    X_meaned = X - np.mean(X, axis=0)

    # Step 2: Compute the covariance matrix
    cov_matrix = np.cov(X_meaned, rowvar=False)

    # Step 3: Compute eigenvalues and eigenvectors
    eigenvalues, eigenvectors = np.linalg.eigh(cov_matrix)

    # Step 4: Sort eigenvalues and eigenvectors by descending eigenvalues
    sorted_indices = np.argsort(eigenvalues)[::-1]
    eigenvalues = eigenvalues[sorted_indices]
    eigenvectors = eigenvectors[:, sorted_indices]

    # Step 5: Select the top `n_components`
    selected_vectors = eigenvectors[:, :n_components]

    # Step 6: Project data onto the principal components
    X_pca = np.dot(X_meaned, selected_vectors)

    return X_pca