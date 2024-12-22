
export const lookupEntry = (entries, id) => entries.find(item => item.entry_id === id);
	// Unfortunately, it is O(n). We prefered the elegance of representation over the elegance of method.


export function apiCall(method, endpoint, payload) {
    const url = (import.meta.env.MODE === 'development' ? 
			'http://localhost:5000' : 
			'https://abanm.pythonanywhere.com')
    const body = (method == 'GET') ? {} : {
        body: JSON.stringify(payload),
        headers: {
            'Content-Type': 'application/json'
        }
    }
    return fetch(
        url, {
            ...body, method,
            credentials: 'include',			// super-important
        }
    ).then((resp) => resp.json())
}

export function syncPCA(setPCA) {
	return apiCall('GET', '/pca', {})
		.then((data) => setPCA(data.pca))
}

export function syncEntries(setEntries) {
	return apiCall('GET', '/entries', {})
		.then((data) => setEntries(data.entries))
}

export function syncAll(setEntries, setPCA) {
	syncEntries(setEntries)
	syncPCA(setPCA)
}

export function createText(text) {
    return apiCall('POST', '/entries', { text: text })
}

export function createImageFromFile({base64Data, filename, mimetype}) {
	return apiCall('POST', '/entries', {
		image: base64Data,
		is_url: false,
		context: {filename, mimetype}
	})
}
export function createImageFromUrl(url) {
	return apiCall('POST', '/entries', {
		image: url,
		is_url: true,
		context: {}
	})
}

export function updateEntry(text, id) {
    return apiCall('PATCH', `/entries/${id}`, { text: text })
}

export function removeEntry(id) {
    return apiCall('DELETE', `/entries/${id}`)
}

export function removeEntries() {
	return apiCall('DELETE', '/entries', {})
}