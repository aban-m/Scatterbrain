export function apiCall(endpoint, payload, method = 'GET') {
    const url = 'http://' +
		(import.meta.env.MODE === 'development' ? 
			'localhost:5000' : 
			'abanm.pythonanywhere.com') + 		// a more elegant solution should be possible
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
            method: method
        }
    )
}

export function resolveId(id, estate) {
    const ind = estate.ids.indexOf(id)
    return {text: estate.texts[ind], embedding: estate.embeddings[ind]}
}