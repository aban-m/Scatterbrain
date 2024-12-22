/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useContext } from 'react'

const initialState = {
  entries: [],
  pca: []
};

const EmbeddingsContext = createContext(); // No default state here
export const useEmbeddings = () => useContext(EmbeddingsContext);

export function EmbeddingsProvider({ children }) {
    const [estate, setEstate] = useState(initialState); 

    const setPCA = (newPcaData) => {
        setEstate(prevState => ({
            ...prevState, 
            pca: newPcaData // Only update PCA
        }));
    };

    const setEntries = (newEntriesData) => {
        setEstate(prevState => ({
            ...prevState,
            entries: newEntriesData // Only update entries
        }));
    };

    return (
        <EmbeddingsContext.Provider value={{ estate, setPCA, setEntries }}>
            {children}
        </EmbeddingsContext.Provider>
    );
}