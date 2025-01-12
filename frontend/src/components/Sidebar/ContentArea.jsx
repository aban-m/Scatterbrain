/* eslint-disable react/prop-types */
import { Fragment, useEffect, useRef, useState } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import Tooltip from "@mui/material/Tooltip";
import CheckIcon from "@mui/icons-material/CheckCircleOutline";

import { useEmbeddings } from "../../contexts/EmbeddingsContext";
import { useWaiting } from "../../contexts/StateContext";
import {
  removeEntry,
  updateEntry,
  declareStatus,
  syncAll,
  API_HOST,
} from "../../crud.js";

function FocusableDiv({ hoveredId, setHoveredId, entry, children, style }) {
  return (
    <div
      onClick={(e) => {
        if (hoveredId !== entry.entry_id) {
          e.target.style.opacity = "0.9";
          setHoveredId(entry.entry_id);
        } else {
          e.target.style.opacity = "1";
          setHoveredId(null);
        }
      }}
      style={{
        borderWidth: "5px",
        borderStyle: hoveredId === entry.entry_id ? "solid" : "none",
        borderColor: "#a3d9a5",
        borderRadius: "2px",
        transition: "all 0.15s ease-in-out",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function TextEntry({ entry, setFocused, setPCA, setEntries }) {
  const { waiting, setWaiting, hoveredId, setHoveredId } = useWaiting();

  const onRemove = () => {
    declareStatus(
      setWaiting,
      `Removing #${entry.entry_id}...`,
      "Critical error!",
      () => removeEntry(entry.entry_id)
    ).then(() => syncAll({ setPCA, setEntries }));
  };
  return (
    <>
      <p style={{ display: "flex", alignItems: "center" }}>{entry.entry_id}</p>
      <FocusableDiv {...{ hoveredId, setHoveredId, entry }}>
        <p
          style={{ display: "flex", alignItems: "center" }}
          id={`entry-${entry.entry_id}`}
        >
          {entry.content}
        </p>
      </FocusableDiv>
      <IconButton
        color="primary"
        disabled={waiting}
        onClick={() => setFocused(entry.entry_id)}
      >
        <EditIcon />
      </IconButton>
      <IconButton color="error" disabled={waiting} onClick={onRemove}>
        <DeleteIcon />
      </IconButton>
    </>
  );
}

function PhotoEntry({ entry, setFocused, setPCA, setEntries }) {
  const { waiting, setWaiting, hoveredId, setHoveredId } = useWaiting();
  const onRemove = () => {
    declareStatus(
      setWaiting,
      `Removing #${entry.entry_id}...`,
      "Critical error!",
      () => removeEntry(entry.entry_id)
    ).then(() => syncAll({ setPCA, setEntries }));
  };

  return (
    <>
      <p style={{ display: "flex", alignItems: "center" }}>{entry.entry_id}</p>
      <FocusableDiv
        {...{ hoveredId, setHoveredId, entry }}
        style={{
          borderStyle: "1px solid #ccc",
          p: 1,
          gridColumn: "span 2",
        }}
      >
        <Tooltip title={entry.content.substring(0, 120) + "..."}>
          <img
            src={API_HOST + entry.url}
            style={{ objectFit: "cover" }}
            id={`entry-${entry.entry_id}`}
          />
        </Tooltip>
      </FocusableDiv>
      <IconButton color="error" disabled={waiting} onClick={onRemove}>
        <DeleteIcon />
      </IconButton>
    </>
  );
}

function TextEntryEdit({ entry, setFocused, setPCA, setEntries }) {
  const { waiting, setWaiting } = useWaiting();
  const editRef = useRef(null);
  const onEdit = () => {
    declareStatus(setWaiting, "Updating...", "Critical error!", () =>
      updateEntry(editRef.current.value, entry.entry_id)
    )
      .then(() => {
        setFocused(null);
        editRef.current.value = null;
      })
      .then(() => syncAll({ setPCA, setEntries }));
  };

  return (
    <>
      <input
        style={{ gridColumn: "span 3" }}
        ref={editRef}
        defaultValue={entry.content}
      ></input>
      <IconButton color="primary" disabled={waiting} onClick={onEdit}>
        <CheckIcon />
      </IconButton>
    </>
  );
}

function PhotoEntryEdit({ entry, setFocused }) {
  return <></>;
}

function Entry(props) {
  return !props.entry.is_image ? TextEntry(props) : PhotoEntry(props);
}
function EntryEdit(props) {
  return !props.entry.is_image ? TextEntryEdit(props) : PhotoEntryEdit(props);
}

export default function ContentArea() {
  const { waiting, setWaiting, hoveredId } = useWaiting();
  const { estate, setEntries, setPCA } = useEmbeddings();
  const [focused, setFocused] = useState(null);

  useEffect(() => {
    declareStatus(setWaiting, "Syncing...", "Critical error!", () =>
      syncAll({ setEntries, setPCA })
    );
  }, []);

  useEffect(() => {
    const el = document.getElementById(`entry-${hoveredId}`);
    if (el) {
      el.scrollIntoView({
        scrollingBehavior: "smooth",
      });
    }
  }, [hoveredId]);

  return (
    <>
      {/* List of TextElements */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 8fr 2fr 2fr",
          gridTemplateRows: "minmax(10pt, auto)",
          gridAutoFlow: "rows",
        }}
      >
        {estate.entries.map((entry, i) => (
          <Fragment key={entry.entry_id}>
            {focused === entry.entry_id ? (
              <EntryEdit {...{ entry, setPCA, setEntries, setFocused }} />
            ) : (
              <Entry {...{ entry, setPCA, setEntries, setFocused }} />
            )}
          </Fragment>
        ))}
      </Box>
    </>
  );
}
