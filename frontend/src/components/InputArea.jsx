/* eslint-disable react/prop-types */
import { Fragment, useEffect, useRef, useState } from 'react'
import { Typography, Box, CircularProgress } from '@mui/material'
import { useEmbeddings } from '../contexts/EmbeddingsContext'
import { useWaiting } from '../contexts/StateContext'
import {
    createText, removeEntry, updateEntry,
	createImageFromFile, declareStatus,
    lookupEntry, syncEntries, syncAll,
    apiCall, apiBase
} from '../crud.js'

import { TextField, IconButton } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Tooltip from '@mui/material/Tooltip'
import CheckIcon from '@mui/icons-material/CheckCircleOutline';
import PhotoCameraBackIcon from '@mui/icons-material/PhotoCameraBack';

function InputAreaHeader({waiting}) {
    return (<>
		<p>{waiting}</p>
    </>)
}

function InputAreaFooter() {
    return (<>
        <Typography variant='h6' align='center'>
			Footer
        </Typography>
    </>)
}

function InputField({ waiting, setWaiting, setPCA, setEntries }) {
    const inputRef = useRef(null)
	const fileRef = useRef(null)

    const onAdd = () => {
		if (!inputRef.current.value) {
			inputRef.current.focus();
			return;

		}
		declareStatus(setWaiting, 'Embedding text...', 'Critical error!',
			() => createText(inputRef.current.value)).then(() => syncAll({setPCA, setEntries}))
        inputRef.current.value = ''
    }
	
	const handleFileChange = async (event) => {
		const file = event.target.files[0];
		if (!file) return;

		const reader = new FileReader();
		reader.onload = () => {
		    const base64Data = reader.result.split(",")[1] // Extract base64 data
			declareStatus(setWaiting, 'Uploading image...', 'Image upload failed.',
						() => createImageFromFile({base64Data})).then(() => syncAll({setPCA, setEntries}))
		};
		
		reader.readAsDataURL(file);
		setWaiting('Processing image...')
	  };
	  
    return (
        <>
            <TextField
                    variant="outlined"
                    placeholder="Enter text"
                    inputRef={inputRef}
                    fullWidth />
                
            {
                waiting ? (<CircularProgress />) : (
                    <>
                        <IconButton
                            color="primary" disabled={waiting}
                            onClick={onAdd} 
                        >
                            <AddCircleIcon />
                        </IconButton>
						<input type="file" ref={fileRef} id='photo-upload' style={{ display: 'none' }} 
							onChange={handleFileChange} accept='image/*' />
                        <Tooltip title='Add photo' arrow>
                            <IconButton
                                color="primary" disabled={waiting}
                                onClick={() => fileRef.current.click()}>
                                <PhotoCameraBackIcon />
                            </IconButton>
                        </Tooltip>
                    </>
                )
            }
        </>
    )
}

function TextEntry({ entry, setFocused, waiting, setWaiting, setPCA, setEntries }) {
	const onRemove = () => {
		declareStatus(setWaiting, `Removing #${entry.entry_id}...`, 'Critical error!', () => 
		removeEntry(entry.entry_id)).then(() => syncAll({setPCA, setEntries}))
	}
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
                onClick={onRemove}>
                <DeleteIcon />
            </IconButton>
        </>
    )
}

function PhotoEntry({ entry, setFocused, waiting }) {
    return (
        <Box className="photo-entry" style={{ 
			borderStyle: '1px solid #ccc', p: 1,
            gridColumn: 'span 3', gridRow: 'span 6'}}>
            <Tooltip title={entry.content.substring(0, 120) + '...'}>
                <img src={apiBase() + entry.url} style={{ objectFit: 'cover' }} />
            </Tooltip>
        </Box>
    )
}

function TextEntryEdit({ entry, waiting, setWaiting, setFocused }) {
    const editRef = useRef(null)
    const onEdit = () => {
		setWaiting('Updating...')
        updateEntry(editRef.current.value, entry.entry_id).then(() => setWaiting(''))
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

function Entry(props) {
    return !props.entry.is_image ? TextEntry(props) : PhotoEntry(props)
}
function EntryEdit({ entry, waiting, setFocused }) {
    return !entry.is_image ? TextEntryEdit({ entry, waiting, setFocused }) : PhotoEntryEdit({ entry, waiting, setFocused })
}

export default function InputArea() {
    const [waiting, setWaiting] = useWaiting()
    const { estate, setEntries, setPCA } = useEmbeddings()
    const [focused, setFocused] = useState(null)

    useEffect(() => {
        declareStatus(setWaiting, 'Syncing...', 'Critical error!', 
					() => syncAll({setEntries, setPCA}))
    }, [])

    return (
        <>
            {/* Header */}
            <Box sx={{ borderBottom: "1px solid #ccc" }}>
                <InputAreaHeader waiting={waiting}/>
            </Box>

            {/* Text Input and Add Button */}
            <Box sx={{ my: 3, display: "flex", gap: 1 }}>
                <InputField {... {waiting, setWaiting, setPCA, setEntries}} />
            </Box>

            {/* List of TextElements */}
            <Box sx={{
                display: 'grid',
                gridTemplateColumns: '7fr 1fr 1fr',
                gridAutoRows: '3em',
                gridAutoFlow: 'rows',
                flexGrow: 1
            }}>
                {estate.entries.map((entry, i) => (
                    <Fragment key={entry.entry_id}>
                        {focused === entry.entry_id ? (
                            <EntryEdit {... {entry, waiting, setWaiting, setPCA, setEntries, setFocused}} />
                        ) : (
                            <Entry {... {entry, waiting, setWaiting, setPCA, setEntries, setFocused}} />
                        )
                        }
                    </Fragment>
                ))}

            </Box>
        </>
    )
}

