/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useContext } from 'react';

const initialState = {
    embeddings: [],
    texts: [],
    ids: []
};

const EmbeddingsContext = createContext(); // No default state here
export const useEmbeddings = () => useContext(EmbeddingsContext);

export function EmbeddingsProvider({ children }) {
    const [estate, setEstate] = useState(initialState); // Manage state here

    return (
        <EmbeddingsContext.Provider value={[estate, setEstate]}>
            {children}
        </EmbeddingsContext.Provider>
    );
}
