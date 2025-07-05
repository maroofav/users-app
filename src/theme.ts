import type {} from '@mui/x-data-grid/themeAugmentation'
import { createTheme, ThemeOptions } from '@mui/material/styles'

// Create base theme options
const themeOptions: ThemeOptions = {
  palette: {
    success: {
      main: '#3eb181',
      contrastText: '#fff',
    },
    text: {
      primary: '#333',
      secondary: '#666',
      disabled: '#999',
    },
    grey: {
      100: '#ccc',
    },
  },
  components: {
    MuiDataGrid: {
      styleOverrides: {
        root: {
          border: 0,
          '& .actions': {
            color: 'text.secondary',
          },
          '& .textPrimary': {
            color: 'text.primary',
          },
          '& .MuiDataGrid-columnHeader': {
            height: '50px !important',
          },
          '& .MuiDataGrid-columnHeaderTitle': {
            color: 'text.disabled',
            textTransform: 'uppercase',
            fontWeight: 'bold',
            fontSize: '13px',
            letterSpacing: '0.5px',
            wordSpacing: '1.5px',
          },
          '& .MuiDataGrid-columnSeparator': {
            display: 'none',
          },
          '& .MuiDataGrid-cell:focus, & .MuiDataGrid-cell:focus-visible, & .MuiDataGrid-cell:focus-within, & .MuiDataGrid-cell:hover, & .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-visible, & .MuiDataGrid-columnHeader:focus-within, & .MuiDataGrid-columnHeader:hover':
            {
              outline: 'none !important',
            },
          '& .MuiDataGrid-cell': {
            fontSize: '0.75rem',
          },
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        input: {
          fontSize: '0.75rem',
          borderWidth: '1px',
          borderColor: 'grey.100',
          borderStyle: 'solid',
          borderRadius: '4px',
          '&[readonly]': {
            color: '#999',
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        input: {
          padding: '4px 11px',
          border: 'none',
          height: '26px',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'capitalize',
          fontWeight: 'normal',
          height: '33px',
        },
      },
    },
  },
}

// Create and export theme
export const theme = createTheme(themeOptions)
