/* eslint-disable react/prop-types */
import { Fragment, useEffect, useRef, useState } from 'react'
import { Typography, Box, CircularProgress } from '@mui/material'
import { useEmbeddings } from '../contexts/EmbeddingsContext'
import { useWaiting } from '../contexts/StateContext'
import {
    createText, removeEntry, updateEntry,
    lookupEntry, syncEntries, syncAll,
    apiCall,
    apiBase
} from '../crud.js'

import { TextField, IconButton } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Tooltip from '@mui/material/Tooltip'
import CheckIcon from '@mui/icons-material/CheckCircleOutline';
import PhotoCameraBackIcon from '@mui/icons-material/PhotoCameraBack';

function InputAreaHeader() {
    return (<>
    </>)
}

function InputAreaFooter() {
    return (<>
        <Typography variant='h6' align='center'>
        </Typography>
    </>)
}

function InputField({ waiting }) {
    const [isText, setIsText] = useState(true)
    const inputRef = useRef(null)

    const onAdd = () => {
        createText(inputRef.current.value)
        inputRef.current.value = ''
    }

    return (
        <>
            {
                isText ?
                    (<TextField
                        variant="outlined"
                        placeholder="Enter text"
                        inputRef={inputRef}
                        fullWidth />) : (
                        <>

                        </>
                    )
            }

            {
                waiting ? (<CircularProgress />) : (
                    <>
                        <IconButton
                            color="primary" disabled={waiting}
                            onClick={onAdd} // Calls the provided handler
                        >
                            <AddCircleIcon />
                        </IconButton>
                        <Tooltip title='Add photo' arrow>
                            <IconButton
                                color="primary" disabled={waiting}
                                onClick={() => setIsText(false)}>
                                <PhotoCameraBackIcon />
                            </IconButton>
                        </Tooltip>
                    </>
                )
            }
        </>
    )
}

function TextEntry({ entry, setFocused, waiting }) {
    return (
        <>
            <Typography sx={{ display: 'flex', alignItems: 'center' }}>
                {entry.content}
            </Typography>
            <IconButton color='primary' disabled={waiting}
                onClick={() => setFocused(entry.entry_id)}>
                <EditIcon />
            </IconButton>
            <IconButton color='error' disabled={waiting}
                onClick={() => removeEntry(entry.entry_id)}>
                <DeleteIcon />
            </IconButton>
        </>
    )
}

function PhotoEntry({ entry, setFocused, waiting }) {
    return (
        <>
            <Tooltip title={entry.content.substring(0, 120) + '...'}>
                <img src={apiBase() + entry.url} style={{
                    gridColumn: 'span 3', gridRow: 'span 6',
                    objectFit: 'cover'

                }} />

            </Tooltip>
        </>
    )
}

function TextEntryEdit({ entry, waiting, setFocused }) {
    const editRef = useRef(null)
    const onEdit = () => {
        updateEntry(editRef.current.value, entry.entry_id)
        setFocused(null)
        editRef.current.value = null
    }

    return (
        <>
            <input style={{ gridColumn: 'span 2' }}
                ref={editRef}
                defaultValue={entry.content}></input>
            <IconButton color='primary' disabled={waiting}
                onClick={onEdit}>
                <CheckIcon />
            </IconButton>
        </>
    )
}

function PhotoEntryEdit({ entry, waiting, setFocused }) {
    return (<>

    </>)
}

function Entry({ entry, waiting, setFocused }) {
    return !entry.is_image ? TextEntry({ entry, waiting, setFocused }) : PhotoEntry({ entry, waiting, setFocused })
}
function EntryEdit({ entry, waiting, setFocused }) {
    return !entry.is_image ? TextEntryEdit({ entry, waiting, setFocused }) : PhotoEntryEdit({ entry, waiting, setFocused })
}

export default function InputArea() {
    const [waiting, setWaiting] = useWaiting()
    const { estate, setEntries, setPCA } = useEmbeddings()
    const [focused, setFocused] = useState(null)

    useEffect(() => {
        setWaiting('Syncing...')
        syncAll(setEntries, setPCA).then(() => setWaiting(''))
    }, [])

    return (
        <>
            {/* Header */}
            <Box sx={{ borderBottom: "1px solid #ccc" }}>
                <InputAreaHeader />
            </Box>

            {/* Text Input and Add Button */}
            <Box sx={{ my: 3, display: "flex", gap: 1 }}>
                <InputField setEntries={setEntries} setPCA={setPCA} waiting={waiting} />
            </Box>

            {/* List of TextElements */}
            <Box sx={{
                display: 'grid',
                gridTemplateColumns: '6fr 1fr 1fr',
                gridAutoRows: '3em',
                gridAutoFlow: 'rows',
                flexGrow: 1
            }}>
                {estate.entries.map((entry, i) => (
                    <Fragment key={entry.entry_id}>
                        {focused === entry.entry_id ? (
                            <EntryEdit waiting={waiting} entry={entry} setFocused={setFocused} />
                        ) : (
                            <Entry waiting={waiting} entry={entry} setFocused={setFocused} />
                        )
                        }
                    </Fragment>
                ))}

            </Box>

            {/* Footer */}
            <Box sx={{ p: 2, borderTop: '1px solid #ccc', justifySelf: 'flex-end' }}>
                <InputAreaFooter />
            </Box>
        </>
    )
}

