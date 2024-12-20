import { apiCall } from "./utils"

export function _sync(setEstate) {
    return apiCall('/pca', null, 'GET').then((r) => r.json())
        .then((data) => setEstate(data))
}

export function sync(setWaiting, setEstate) {
    return declareStatus('Syncing...', setWaiting, () => _sync(setEstate))
}

export function _create(text) {
    return apiCall('/embeddings', { text: text }, 'POST')
}

export function _update(text, id) {
    return apiCall('/embeddings', { new: text, target: id }, 'PATCH')
}

export function _remove(id) {
    return apiCall('/embeddings', { target: id }, 'DELETE')
}
export function remove(id, setWaiting, setEstate) {
    return declareStatus('Deleting...', setWaiting, () => _remove(id)).then(() => sync(setWaiting, setEstate))
}

export function update(text, id, setWaiting, setEstate) {
    return declareStatus('Updating...', setWaiting, () => _update(text, id)).then(() => sync(setWaiting, setEstate))
}

export function create(text, setWaiting, setEstate) {
    return declareStatus('Adding...', setWaiting, () => _create(text)).then(() => sync(setWaiting, setEstate))
}

export function declareStatus(state, setWaiting, callback) {
    setWaiting(state)
    return callback().then(() => setWaiting(''))
}