import { RouterConfig } from '@components/RouterConfig'

import { appTheme } from '@themes/default/appTheme'
import { CssBaseline } from '@mui/material'
import { ThemeProvider } from '@mui/material/styles'
import { ToastContainer } from 'react-toastify'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

function App() {
  const queryClient = new QueryClient()

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <ToastContainer />

        <ThemeProvider theme={appTheme}>
          <CssBaseline />
          <RouterConfig />
        </ThemeProvider>
      </QueryClientProvider>
    </>
  )
}

export default App
