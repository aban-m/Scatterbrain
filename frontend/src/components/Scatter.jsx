import React, { useEffect, useRef, useState } from 'react'
import Plotly from 'plotly.js-basic-dist'
import { useEmbeddings } from '../contexts/EmbeddingsContext'
import { useWaiting } from '../contexts/StateContext'
const initialLayout = {
    xaxis: { range: [-1, 1], autorange: false },
    yaxis: { range: [-1, 1], autorange: false },
    autosize: true,
	title: { text: 'Scatterbrain β', font: { size: 20 } }
}

const initialData = {
    type: 'scatter',
    mode: 'markers+text',
    hovertemplate: '%{customdata}<extra></extra>',
    textposition: 'bottom center',
	marker: { size: 10, color: 'blue'}
}

export default function Scatter() {
    const plotRef = useRef(null); // Reference to the plot div
    const layoutRef = useRef(initialLayout); // Reference to the current layout state
    const {estate} = useEmbeddings(); // Your custom hook
    const [data, setData] = useState(null)
	const {hoveredId, setHoveredId, waiting} = useWaiting()
    // Update data based on estate
    useEffect(() => {
        const newData = [
            {
                ...initialData,
                x: estate.pca[0],
                y: estate.pca[1],
                customdata: estate.entries.map((entry) =>
                    entry.content.length > 120 ? 
						(entry.content.slice(0, 80) + '... ' +
						entry.content.slice(entry.content.length-40, entry.content.length)) : entry.content
                ),
                text: estate.entries.map((entry) => `#${entry.entry_id}`),
            },
        ]

        // Update the plot with the current layout
        if (plotRef.current) {
            Plotly.react(plotRef.current, newData, layoutRef.current)
        }

        setData(newData)
    }, [estate])

    // Initialize the plot on first render
    useEffect(() => {
        if (plotRef.current) {
            Plotly.newPlot(plotRef.current, data || [], initialLayout, {
                responsive: true,
            })

            // Attach layout change handler
            plotRef.current.on('plotly_relayout', (updatedLayout) => {
                layoutRef.current = { ...layoutRef.current, ...updatedLayout }
            })
        }
		
		plotRef.current.on('plotly_hover', (e) => {
			setHoveredId(parseInt(e.points[0].text.slice(1)))
		}).on('plotly_unhover', (e) => {
			setHoveredId(null)
		})
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
	
	useEffect(() => {
		// Create the color and size arrays
		const colorArray = [...Array(estate.entries.length).keys()].map(i => (i + 1 === hoveredId ? '#a3d9a5' : 'blue'))
		const sizeArray = [...Array(estate.entries.length).keys()].map(i => (i + 1 === hoveredId ? 20 : 10))
		
		// Batch the restyle calls
		Plotly.restyle(plotRef.current, {
			'marker.color': [colorArray],
			'marker.size': [sizeArray],
		})
	}, [hoveredId])

    return (
        <div style={{ height: '100%', width: '100%', margin: 5 }}>
            <div ref={plotRef} style={{ height: '100%', width: '100%' }} />
        </div>
    )
}
