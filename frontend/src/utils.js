export function apiCall(endpoint, payload, method = 'GET') {
    const url = `/api${endpoint}`
    const body = (method == 'GET') ? {} : {
        body: JSON.stringify(payload),
        headers: {
            'Content-Type': 'application/json'
        }
    }
    return fetch(
        url,
        {
            ...body,
            method: method
        }
    )
}

export function resolveId(id, estate) {
    const ind = estate.ids.indexOf(id)
    return {text: estate.texts[ind], embedding: estate.embeddings[ind]}
}