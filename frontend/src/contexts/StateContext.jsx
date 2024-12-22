/* eslint-disable react/prop-types */
/* eslint-disable react-refresh/only-export-components */
import { createContext, useState, useContext } from 'react'

const initialState = ''

const StateContext = createContext(); // No default state here
export const useWaiting = () => useContext(StateContext);

export function StateProvider({ children }) {
    const [waiting, setWaiting] = useState(initialState)
    return (
        <StateContext.Provider value={[waiting, setWaiting]}>
            {children}
        </StateContext.Provider>
    );
}
