import { Fragment, useEffect, useRef, useState } from 'react'
import { Typography, Box, CircularProgress } from '@mui/material'
import { useEmbeddings } from '../contexts/EmbeddingsContext'
import { useWaiting } from '../contexts/StateContext'
import { createText, removeEntry, updateEntry,
	lookupEntry, syncEntries, syncAll } from '../crud.js'

import { TextField, IconButton } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from '@mui/icons-material/CheckCircleOutline';


function InputAreaHeader() {
    const [waiting, setWaiting] = useWaiting()
	console.log(waiting)
    return (<>
	{waiting}
    </>)
}

function InputAreaFooter() {
	const [waiting, setWaiting] = useWaiting()
    return (<>
        <Typography variant='h6' align='center'>
        </Typography>
    </>)
}

export default function InputArea() {
    const inputRef = useRef(null)
    const editRef = useRef(null)
    const [waiting, setWaiting] = useWaiting()
    const {estate, setEntries, setPCA} = useEmbeddings()
    const [focused, setFocused] = useState(null)

	useEffect(() => {
		syncAll(setEntries, setPCA)
	}, [])

    const onAdd = () => {
        createText(inputRef.current.value).then(() => syncAll(setEntries, setPCA))
        inputRef.current.value = ''
    }
    const onEdit = () => {
        updateEntry(editRef.current.value, focused).then(() => syncAll(setEntries, setPCA))
		setFocused(null)
		editRef.current.value = null
    }
	const onRemove = (id) => {
		removeEntry(id).then(() => syncAll(setEntries, setPCA))
	}


    return (
        <>
            {/* Header */}
            <Box sx={{ borderBottom: "1px solid #ccc" }}>
                <InputAreaHeader />
            </Box>

            {/* Text Input and Add Button */}
            <Box sx={{ my: 3, display: "flex", gap: 1 }}>
                <TextField
                    variant="outlined"
                    placeholder="Enter text"
                    inputRef={inputRef}
                    fullWidth
                />
				{ waiting ? (<CircularProgress />) : (
                <IconButton
                    color="primary" disabled={waiting}
                    onClick={onAdd} // Calls the provided handler
                >
                    <AddCircleIcon />
                </IconButton> ) }
            </Box>

            {/* List of TextElements */}
            <Box sx={{
                display: 'grid',
                gridTemplateColumns: '7fr 1fr 1fr',
                gridAutoRows: '3em',
                gridAutoFlow: 'rows',
                flexGrow: 1
            }}>
                {estate.entries.map((entry, i) => {
                    return focused === entry.entry_id ? (
						 <Fragment key={entry.entry_id}>
							<input style={{ gridColumn: 'span 2'}}
									   ref={editRef}
									   defaultValue={entry.content}></input>
							<IconButton color='primary' disabled={waiting}
								onClick={onEdit}>
								<CheckIcon />
							</IconButton>
						</Fragment>
					)
					:
					(
                        <Fragment key={entry.entry_id}>
                            <Typography sx={{ display: 'flex', alignItems: 'center' }}>
                                {entry.content}
                            </Typography>
                            <IconButton color='primary' disabled={waiting}
                                onClick={() => setFocused(entry.entry_id)}>
                                <EditIcon />
                            </IconButton>
                            <IconButton color='error' disabled={waiting}
                                onClick={() => onRemove(entry.entry_id)}>
                                <DeleteIcon />
                            </IconButton>
                        </Fragment>
                    )
                })}

            </Box>

            {/* Footer */}
            <Box sx={{ p: 2, borderTop: '1px solid #ccc', justifySelf: 'flex-end' }}>
                <InputAreaFooter />
            </Box>
        </>
    )
}

