import { useState } from 'react';
import { apiCall } from '../utils';
import { useEmbeddings } from '../contexts/EmbeddingsContext';

export default function InputArea() {
    const [text, setText] = useState('')
    const [waiting, setWaiting] = useState('')
    const [estate, setEstate] = useEmbeddings()

    const handleAdd = () => {
        setWaiting('Adding...')
        apiCall('/embeddings', { text: text }, 'POST')
            .then((_) => setWaiting(''))
    };

    const handleSubmit = () => {
        setWaiting('Analyzing...');
        apiCall('/pca', {}, 'GET')
            .then((r) => r.json()) 
            .then((data) => {
                setEstate({ embeddings: data['embedding'], texts: data['texts'] })
                setWaiting('')
            });
    }
    return (
        <>
            <div>
                <input type="text" value={text} onChange={(e) => setText(e.target.value)} />
                <button onClick={handleAdd}>Add</button>
                <button onClick={handleSubmit}>Render</button>
            </div>
            <div>
                <p className="output mt-3">{waiting}</p>
                <p>Latest rendered: {estate.texts[estate.texts.length-1]}</p>
            </div>
        </>
    );
}
