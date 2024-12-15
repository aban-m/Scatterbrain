// 2d scatter
import Plotly from 'react-plotly.js'
import { useEmbeddings } from '../contexts/EmbeddingsContext'

const initialLayout = {
    title: 'Scatterbrain v0.1',
    'xaxis.range': [-1, 1],
    'yaxis.range': [-1, 1]
}
const initialData = {
    type: 'scatter',
    mode: 'markers+text',
    hovertemplate: '%{customdata}<extra></extra>',
    textposition: 'bottom center'
}

export default function Scatter() {
    const [estate, setEstate] = useEmbeddings()
    return (
        <>
            <Plotly 
                layout={initialLayout}
                data={[{
                    ...initialData, x: estate.embeddings[0], y: estate.embeddings[1], 
                    customdata: estate.texts.map((s, i) => s.length > 10 ? s.slice(0, 10)+'...' : s),
                    text: estate.ids.map((s, i) => `#${s}`)
                }]}
            />
        </>
    )
}