import { useState } from 'react'
import InputArea from './InputArea'
import Scatter from './Scatter'
import { Box, SwipeableDrawer, useMediaQuery, Container } from "@mui/material";
import { EmbeddingsProvider } from '../contexts/EmbeddingsContext'

import { useTheme } from "@mui/material/styles";
import { StateProvider } from '../contexts/StateContext';

export default function App() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <EmbeddingsProvider>
      <StateProvider>
        <Box sx={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between',
          gap: '1em',
          height: '100%'
        }}>
          <Box sx={{
            borderStyle: 'solid',
            borderWidth: isMobile ? '1px 0 0 0' : '0 1px 0 0',
            flexBasis: isMobile ? '20%' : '15%',
            flexShrink: 1,
            p: isMobile ? 'clamp(1em, 1%, 1em) 0 0 0' : '0 clamp(1em, 1%, 1em) 0 clamp(1em, 1%, 1em)',
            order: isMobile ? 1 : 0,
            ...(isMobile ? {maxHeight: '20%'} : {minHeight: '20%'}),
            display: "flex",
            flexDirection: "column",
            overflowY: isMobile ? 'initial' : 'auto'
          }}>
            <InputArea />
          </Box>

          <Box
            sx={{
              flex: 2,
              p: 0,
              m: isMobile ? '0 0 1em 0' : '0 0 1em 0'
            }}>
            <Scatter />
          </Box>
        </Box>
      </StateProvider>
    </EmbeddingsProvider >
  );

}
