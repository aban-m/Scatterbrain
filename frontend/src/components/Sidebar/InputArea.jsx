/* eslint-disable react/prop-types */
import { useRef, useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import IconButton from "@mui/material/IconButton";
import PhotoCameraBackIcon from "@mui/icons-material/PhotoCameraBack";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import Tooltip from "@mui/material/Tooltip";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

import { useWaiting } from "../../contexts/StateContext.jsx";
import {
  createText,
  createImageFromFile,
  declareStatus,
  syncAll,
} from "../../crud.js";

const fileChangeListener = ({ setPCA, setEntries, setWaiting }) => {
  return async (event) => {
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
};

function InputModalitySelector({ mode, setMode }) {
  return (
    <FormControl size="small">
      <InputLabel id="type-label">Type</InputLabel>
      <Select
        value={mode}
        labelId="type-label"
        label="Input type"
        variant="outlined"
        onChange={(e) => setMode(e.target.value)}
        sx={{
          maxWidth: "20ch",
        }}
      >
        <MenuItem value="direct">Direct text</MenuItem>
        <MenuItem value="reddit">Reddit post URL</MenuItem>
      </Select>
    </FormControl>
  );
}

export default function InputArea({ setPCA, setEntries }) {
  const inputRef = useRef(null);
  const fileRef = useRef(null);
  const { waiting, setWaiting } = useWaiting();
  const [mode, setMode] = useState("direct");

  const onAdd = () => {
    if (!inputRef.current.value) {
      inputRef.current.focus();
      return;
    }
    switch (mode) {
      case "direct":
        declareStatus(setWaiting, "Embedding text...", "Critical error!", () =>
          createText(inputRef.current.value)
        ).then(() => syncAll({ setPCA, setEntries }));
        inputRef.current.value = "";
        break;
      case "reddit":
        alert("Not implemented yet, I am afraid.");
        break;
      default:
        alert("For real?");
    }
  };

  return (
    <>
      <Box sx={{ my: 3, display: "flex", gap: 1 }}>
        <TextField
          variant="outlined"
          placeholder="Enter text"
          inputRef={inputRef}
          fullWidth
        />
        <IconButton
          color="primary"
          // disabled={waiting}
          onClick={onAdd}
        >
          <AddCircleIcon />
        </IconButton>
        <input
          type="file"
          ref={fileRef}
          id="photo-upload"
          style={{ display: "none" }}
          onChange={fileChangeListener({ setPCA, setEntries, setWaiting })}
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
      </Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-end",
          alignItems: "baseline",
          gap: 1,
        }}
      >
        <InputModalitySelector {...{ mode, setMode }} />
      </Box>
    </>
  );
}
