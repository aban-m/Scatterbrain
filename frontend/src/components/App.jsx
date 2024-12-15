import '../styles/App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import InputArea from './InputArea'
import Scatter from './Scatter'
import { EmbeddingsProvider } from '../contexts/EmbeddingsContext'

function App() {

  return (
    <EmbeddingsProvider>
        <InputArea />
        <Scatter />
    </EmbeddingsProvider>
  )
}

export default App
