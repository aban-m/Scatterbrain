export function apiCall(endpoint, payload, method = 'GET') {
    const url = (import.meta.env.MODE === 'development' ? 
			'http://localhost:5000' : 
			'https://abanm.pythonanywhere.com') + 		// a more elegant solution should be possible
		`/api${endpoint}`
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
            credentials: 'include',
            method: method
        }
    )
}

export function resolveId(id, estate) {
    const ind = estate.ids.indexOf(id)
    return {text: estate.texts[ind], embedding: estate.embeddings[ind]}
}