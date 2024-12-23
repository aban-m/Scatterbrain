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
		<p>{waiting ? waiting : 'Ready'}</p>
    </>)
}

function InputAreaFooter() {
    return (<>
    </>)
}

function FocusableDiv({hoveredId, setHoveredId, entry, children, style}) {
	return (
		<div onMouseOver={(e) => {e.target.style.opacity='0.9'; setHoveredId(entry.entry_id)}}
			onMouseOut={(e) => {e.target.style.opacity='1'; setHoveredId(null)}}
			style={{ borderWidth: entry.entry_id === hoveredId ? '5px' : '0px',
			borderStyle: 'solid', borderColor: '#a3d9a5', borderRadius: '2px',
			transition: 'all 0.15s ease-in-out',
			display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1',
			...style}}>
		{children}
		</div>
	)
}

function InputField({ setPCA, setEntries }) {
    const inputRef = useRef(null)
	const fileRef = useRef(null)
	const { waiting, setWaiting } = useWaiting()
	
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

function TextEntry({ entry, setFocused, setPCA, setEntries }) {
	const { waiting, setWaiting, hoveredId, setHoveredId } = useWaiting()

	const onRemove = () => {
		declareStatus(setWaiting, `Removing #${entry.entry_id}...`, 'Critical error!', () => 
		removeEntry(entry.entry_id)).then(() => syncAll({setPCA, setEntries}))
	}
    return (
        <>
			<p style={{ display: 'flex', alignItems: 'center' }}>
				{entry.entry_id}
			</p>
			<FocusableDiv {...{hoveredId, setHoveredId, entry}}>
				<p style={{ display: 'flex', alignItems: 'center' }} id={`entry-${entry.entry_id}`}>
					{entry.content}
				</p>
			</FocusableDiv>
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

function PhotoEntry({ entry, setFocused, setPCA, setEntries }) {
	const { waiting, setWaiting, hoveredId, setHoveredId } = useWaiting()
	const onRemove = () => {
		declareStatus(setWaiting, `Removing #${entry.entry_id}...`, 'Critical error!', () => 
		removeEntry(entry.entry_id)).then(() => syncAll({setPCA, setEntries}))
	}
	
    return (
	<>
		<p style={{ display: 'flex', alignItems: 'center'}}>
				{entry.entry_id}
		</p>
		<FocusableDiv {...{hoveredId, setHoveredId, entry}}
			style={{
			borderStyle: '1px solid #ccc', p: 1,
			gridColumn: 'span 2'
		}}>
			<Tooltip title={entry.content.substring(0, 120) + '...'}>
				<img src={apiBase() + entry.url} style={{ objectFit: 'cover' }} id={`entry-${entry.entry_id}`} />
			</Tooltip>
		</FocusableDiv>
         <IconButton color='error' disabled={waiting}
				onClick={onRemove}>
            <DeleteIcon />
	     </IconButton>		
		</>
    )
}

function TextEntryEdit({ entry,  setFocused, setPCA, setEntries }) {
	const { waiting, setWaiting } = useWaiting()
    const editRef = useRef(null)
    const onEdit = () => {
        declareStatus(setWaiting, 'Updating...', 'Critical error!',
			() => updateEntry(editRef.current.value, entry.entry_id)).then(() => {
			setFocused(null)
			editRef.current.value = null
			}).then(() => syncAll({setPCA, setEntries}))
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

function PhotoEntryEdit({ entry, setFocused }) {
    return (<>

    </>)
}

function Entry(props) {
    return !props.entry.is_image ? TextEntry(props) : PhotoEntry(props)
}
function EntryEdit(props) {
    return !props.entry.is_image ? TextEntryEdit(props) : PhotoEntryEdit(props)
}

export default function InputArea() {
    const { waiting, setWaiting, hoveredId } = useWaiting()
    const { estate, setEntries, setPCA } = useEmbeddings()
    const [focused, setFocused] = useState(null)

    useEffect(() => {
        declareStatus(setWaiting, 'Syncing...', 'Critical error!', 
					() => syncAll({setEntries, setPCA}))
    }, [])
	
	useEffect(() => {
		const el = document.getElementById(`entry-${hoveredId}`)
		if (el) { 
			el.scrollIntoView({
				scrollingBehavior: 'smooth',
				block: 'center'
			})
		}
	}, [hoveredId])

    return (
        <>
            {/* Header */}
            <Box sx={{ borderBottom: "1px solid #ccc" }}>
                <InputAreaHeader waiting={waiting}/>
            </Box>

            {/* Text Input and Add Button */}
            <Box sx={{ my: 3, display: "flex", gap: 1 }}>
                <InputField {... {setPCA, setEntries}} />
            </Box>

            {/* List of TextElements */}
            <Box sx={{
                display: 'grid',
                gridTemplateColumns: '1fr 8fr 2fr 2fr',
				gridTemplateRows: 'minmax(10pt, auto)',
                gridAutoFlow: 'rows'
            }}>
                {estate.entries.map((entry, i) => (
                    <Fragment key={entry.entry_id}>
                        {focused === entry.entry_id ? 
                            (<EntryEdit {... {entry, setPCA, setEntries, setFocused}} />)
                          : (<Entry {... {entry, setPCA, setEntries, setFocused}} />)
                        }
                    </Fragment>
                ))}

            </Box>
        </>
    )
}

