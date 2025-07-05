import { RouterConfig } from '@components/RouterConfig'

import { appTheme } from '@themes/default/appTheme'
import { CssBaseline } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import { ToastContainer } from 'react-toastify'

function App() {
  return (
    <>
      <ToastContainer />

      <ThemeProvider theme={appTheme}>
        <CssBaseline />
        <RouterConfig />
      </ThemeProvider>
    </>
  )
}

export default App
