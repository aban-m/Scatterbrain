// 2d scatter
import Plotly from 'react-plotly.js'
import { useEffect } from 'react'
import { useEmbeddings } from '../contexts/EmbeddingsContext'

const initialLayout = {
    title: 'Scatterbrain v0.1'
}
const initialData = {
    type: 'scatter'
}

export default function Scatter() {
    const [estate, setEstate] = useEmbeddings()

    return (
        <>
            <Plotly layout={initialLayout}
                data={{
                    ...initialData, x: estate.embeddings[0], y: estate.embeddings[1]
                }} />
        </>
    )
}