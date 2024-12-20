import { Fragment, useEffect, useRef, useState } from 'react'
import { Typography, Box, CircularProgress } from '@mui/material'
import { useEmbeddings } from '../contexts/EmbeddingsContext'
import { useWaiting } from '../contexts/StateContext'
import { create, sync, remove, update } from '../crud.js'

import { TextField, IconButton } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from '@mui/icons-material/CheckCircleOutline';
import { resolveId } from '../utils.js'

function InputAreaHeader() {
    const [waiting, setWaiting] = useWaiting()
    return (<>
    </>)
}

function InputAreaFooter() {
    return (<>
        <Typography variant='h6' align='center'>
        </Typography>
    </>)
}

export default function InputArea() {
    const inputRef = useRef(null)
    const editRef = useRef(null)
    const [waiting, setWaiting] = useWaiting()
    const [estate, setEstate] = useEmbeddings()
    const [focused, setFocused] = useState(null)

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { sync(setWaiting, setEstate) }, [])

    const onAdd = () => {
        create(inputRef.current.value, setWaiting, setEstate)
        inputRef.current.value = ''
    }
    const onEdit = () => {
        update(editRef.current.value, focused, setWaiting, setEstate)
		setFocused(null)
		editRef.current.value = null
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
                {estate.ids.map((id, i) => {
                    return focused === id ? (
						 <Fragment key={id}>
							<input style={{ gridColumn: 'span 2'}}
									   ref={editRef}
									   defaultValue={resolveId(id, estate).text}></input>
							<IconButton color='primary' disabled={waiting}
								onClick={onEdit}>
								<CheckIcon />
							</IconButton>
						</Fragment>
					)
					:
					(
                        <Fragment key={id}>
                            <Typography sx={{ display: 'flex', alignItems: 'center' }}>
                                {resolveId(id, estate).text}
                            </Typography>
                            <IconButton color='primary' disabled={waiting}
                                onClick={() => setFocused(id)}>
                                <EditIcon />
                            </IconButton>
                            <IconButton color='error' disabled={waiting}
                                onClick={() => remove(id, setWaiting, setEstate)}>
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

