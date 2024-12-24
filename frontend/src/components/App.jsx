import { Box, useMediaQuery, useTheme } from '@mui/material'
import InputArea from './InputArea'
import Scatter from './Scatter'
import { EmbeddingsProvider } from '../contexts/EmbeddingsContext'
import { StateProvider } from '../contexts/StateContext'
import '../styles/App.css'

export default function App() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))

  return (
    <EmbeddingsProvider>
      <StateProvider>
        <Box sx={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between',
          gap: '1em',
          height: '100%',
		  overflowY: isMobile ? 'auto' : 'initial'
        }}>
          <Box sx={{
            borderStyle: 'solid', borderColor: 'grey',
            borderWidth: isMobile ? '1px 0 0 0' : '0 1px 0 0',
            flexBasis: isMobile ? '20%' : '20%',
            p: isMobile ? 'clamp(1em, 1%, 1em) 0 0 0' : '0 clamp(1em, 1%, 1em) 0 clamp(1em, 1%, 1em)',
            order: isMobile ? 1 : 0,
            ...(isMobile ? { maxHeight: '20%' } : { minHeight: '20%' }),
            display: 'flex',
            flexDirection: 'column',
		    overflowY: isMobile ? 'initial' : 'auto'
            
          }}>
            <InputArea />
          </Box>

          <Box
            sx={{
              flex: 1,
              p: 0,
              m: isMobile ? '0 0 1em 0' : '0 0 1em 0'
            }}>
            <Scatter />
          </Box>
        </Box>
      </StateProvider>
    </EmbeddingsProvider >
  )
}
