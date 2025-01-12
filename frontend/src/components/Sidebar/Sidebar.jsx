/* eslint-disable react/prop-types */
import { useState } from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import InputArea from "./InputArea.jsx";
import ContentArea from "./ContentArea.jsx";
import CheckIcon from "@mui/icons-material/Check";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import { useWaiting } from "../../contexts/StateContext";
import { useEmbeddings } from "../../contexts/EmbeddingsContext";
import { declareStatus, removeEntries, syncAll } from "../../crud.js";

function InputAreaHeader({ waiting, setWaiting, setEntries, setPCA }) {
  const [visible, setVisible] = useState(false);
  return (
    <>
      <Box
        sx={{
          borderBottom: "1px solid #ccc",
          display: visible ? "initial" : "none",
        }}
      >
        <p style={{ fontSize: "1.1em", textAlign: "justifyLow" }}>
          This app allows you to visualize a 2D version of the embeddings of
          text. You can also add a picture, where a description of it will be
          used as the text.
          <br />
          For more information, please checkout &nbsp;
          <a href="https://github.com/aban-m/Scatterbrain">the GitHub page.</a>
        </p>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <p>{waiting ? waiting : "Ready"}</p>
        <IconButton
          onClick={() => {
            declareStatus(
              setWaiting,
              "Resetting...",
              "Critical error!",
              removeEntries
            ).then(() => syncAll({ setEntries, setPCA }));
          }}
        >
          R
        </IconButton>
        <IconButton onClick={() => setVisible(!visible)} color="primary">
          {!visible ? <HelpOutlineIcon /> : <CheckIcon />}
        </IconButton>
      </Box>
    </>
  );
}

export default function Sidebar() {
  const { waiting, setWaiting } = useWaiting();
  const { setPCA, setEntries } = useEmbeddings();
  return (
    <>
      <Box sx={{ borderBottom: "1px solid #ccc" }}>
        <InputAreaHeader {...{ setPCA, setEntries, waiting, setWaiting }} />
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <InputArea {...{ setPCA, setEntries }} />
      </Box>

      <ContentArea />
    </>
  );
}
