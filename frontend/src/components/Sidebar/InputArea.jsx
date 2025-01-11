/* eslint-disable react/prop-types */
import { useRef } from "react";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import PhotoCameraBackIcon from "@mui/icons-material/PhotoCameraBack";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Tooltip from "@mui/material/Tooltip";
import { useWaiting } from "../../contexts/StateContext.jsx";
import {
  createText,
  createImageFromFile,
  declareStatus,
  syncAll,
} from "../../crud.js";

export default function InputArea({ setPCA, setEntries }) {
  const inputRef = useRef(null);
  const fileRef = useRef(null);
  const { waiting, setWaiting } = useWaiting();

  const onAdd = () => {
    if (!inputRef.current.value) {
      inputRef.current.focus();
      return;
    }
    declareStatus(setWaiting, "Embedding text...", "Critical error!", () =>
      createText(inputRef.current.value)
    ).then(() => syncAll({ setPCA, setEntries }));
    inputRef.current.value = "";
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64Data = reader.result.split(",")[1]; // Extract base64 data
      declareStatus(
        setWaiting,
        "Uploading image...",
        "Image upload failed.",
        () => createImageFromFile({ base64Data })
      ).then(() => syncAll({ setPCA, setEntries }));
    };

    reader.readAsDataURL(file);
    setWaiting("Processing image...");
  };

  return (
    <>
      <TextField
        variant="outlined"
        placeholder="Enter text"
        inputRef={inputRef}
        fullWidth
      />

      {waiting ? (
        <CircularProgress />
      ) : (
        <>
          <IconButton color="primary" disabled={waiting} onClick={onAdd}>
            <AddCircleIcon />
          </IconButton>
          <input
            type="file"
            ref={fileRef}
            id="photo-upload"
            style={{ display: "none" }}
            onChange={handleFileChange}
            accept="image/*"
          />
          <Tooltip title="Add photo" arrow>
            <IconButton
              color="primary"
              disabled={waiting}
              onClick={() => fileRef.current.click()}
            >
              <PhotoCameraBackIcon />
            </IconButton>
          </Tooltip>
        </>
      )}
    </>
  );
}
