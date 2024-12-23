/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useContext } from 'react'

const StateContext = createContext(); // No default state here
export const useWaiting = () => useContext(StateContext);

export function StateProvider({ children }) {
    const [waiting, setWaiting] = useState('')
	const [hoveredId, setHoveredId] = useState(null)
	
    return (
        <StateContext.Provider value={{waiting, setWaiting, hoveredId, setHoveredId}}>
            {children}
        </StateContext.Provider>
    );
}
