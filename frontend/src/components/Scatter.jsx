import React, { useEffect, useRef, useState } from "react"
import Plotly from "plotly.js-basic-dist"
import { useEmbeddings } from "../contexts/EmbeddingsContext"
const initialLayout = {
    xaxis: { range: [-1, 1], autorange: false },
    yaxis: { range: [-1, 1], autorange: false },
    autosize: true,
}

const initialData = {
    type: "scatter",
    mode: "markers+text",
    hovertemplate: "%{customdata}<extra></extra>",
    textposition: "bottom center",
}

export default function Scatter() {
    const plotRef = useRef(null); // Reference to the plot div
    const layoutRef = useRef(initialLayout); // Reference to the current layout state
    const [estate, setEstate] = useEmbeddings(); // Your custom hook
    const [data, setData] = useState(null)

    // Update data based on estate
    useEffect(() => {
        const newData = [
            {
                ...initialData,
                x: estate.embeddings[0],
                y: estate.embeddings[1],
                customdata: estate.texts.map((s) =>
                    s.length > 10 ? s.slice(0, 10) + "..." : s
                ),
                text: estate.ids.map((s) => `#${s}`),
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
            plotRef.current.on("plotly_relayout", (updatedLayout) => {
                layoutRef.current = { ...layoutRef.current, ...updatedLayout }
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <div style={{ height: "100%", width: "100%", margin: 5 }}>
            <div ref={plotRef} style={{ height: "100%", width: "100%" }} />
        </div>
    )
}
