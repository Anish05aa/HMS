import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import AppContextProvider from './context/AppContext.jsx'
import { ThemeProvider } from './context/ThemeContext'
import './index.css'

createRoot(document.getElementById('root')).render(

  <BrowserRouter>
    <AppContextProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>

    </AppContextProvider>
  </BrowserRouter>




)
