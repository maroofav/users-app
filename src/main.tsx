import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.scss'
import { Provider } from 'react-redux'
import App from './App.tsx'

import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from './store'

import { ThemeProvider } from '@mui/material/styles'
import { theme } from './theme'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  </StrictMode>,
)
