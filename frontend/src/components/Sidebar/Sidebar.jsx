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

function InputAreaHeader({ waiting }) {
  const [visible, setVisible] = useState(false);
  return (
    <>
      <Box
        sx={{
          borderBottom: "1px solid #ccc",
          display: visible ? "initial" : "none",
        }}
      >
        <p style={{ fontSize: "1.1em", align: "justify" }}>
          This app allows you to visualize a 2D version of the embeddings of
          text. You can also add a picture, where a description of it will be
          used as the text.
          <br />
          For more information, please checkout
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
        <IconButton onClick={() => setVisible(!visible)} color="primary">
          {!visible ? <HelpOutlineIcon /> : <CheckIcon />}
        </IconButton>
      </Box>
    </>
  );
}

export default function Sidebar() {
  const { waiting } = useWaiting();
  const { setPCA, setEntries } = useEmbeddings();
  return (
    <>
      <Box sx={{ borderBottom: "1px solid #ccc" }}>
        <InputAreaHeader waiting={waiting} />
      </Box>

      <Box sx={{ my: 3, display: "flex", gap: 1 }}>
        <InputArea {...{ setPCA, setEntries }} />
      </Box>

      <ContentArea />
    </>
  );
}
