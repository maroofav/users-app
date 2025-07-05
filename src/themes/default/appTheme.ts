import { createTheme } from '@mui/material/styles'

const themeMode = 'light'
const lightMode = themeMode === 'light'

export const colors = {
  // Array goes from dark to light
  black: {
    100: '#000',
    150: '#1018281A',
    200: '#252D3C',
    300: '#272d37',
    500: 'rgba(25,118,210,0.08)',
  },
  grey: {
    300: '#5F6D7E',
    350: '#6B7B8F',
    400: '#777',
    600: '#919BA7',
    625: '#A5ACBA',
    650: '#D4D9E1',
    700: '#DAE0E6',
    750: '#E8EFFD',
    800: '#ecfbff',
    900: '#EFEFF1',
  },
  white: {
    100: '#eee',
    200: '#f2f3f4',
    500: '#FAFBFC',
    600: '#F9F8FB',
    700: '#F5F8FE',
    800: '#FCFCFD',
    900: '#fff',
  },
  blue: {
    100: 'rgb(28 40 88)',
    500: '#437EF7',
    600: '#528BFF',
    700: '#1976d2',
  },
  purple: {
    200: '#222a51',
    300: '#35427f',
    400: '#574EFA',
    500: '#736CFB',
    600: '#8F89FC',
    900: '#ECEBFF',
  },
  pink: { 400: '#A032F6' },
  red: {
    100: '#F04438',
    600: '#FEB8AE',
    800: '#ffe0e0',
    900: '#FFF2F0',
  },
  green: {
    100: '#2D8A39',
    300: '#5DC264',
    350: '#7FD184',
    800: '#e0ffe8',
    900: '#F0FAF0',
  },
  orange: { 800: '#ffffe0' },
}

export const customThemeVars = {
  common: {
    baseFontSize: 16,
    color: lightMode ? colors.black[300] : colors.white[100],
    linkColor: lightMode ? colors.purple[400] : colors.blue[600],
    backgroundColor: lightMode ? colors.white[900] : colors.blue[100],
    borderColor: lightMode ? colors.white[100] : colors.purple[200],
    boxShadow: lightMode
      ? '0 11px 15px -7px rgb(0 0 0 / 20%), 0 24px 38px 3px rgb(0 0 0 / 14%), 0 9px 46px 8px rgb(0 0 0 / 12%)'
      : '0 11px 15px -7px rgb(255 255 255 / 20%), 0 24px 38px 3px rgb(255 255 255 / 14%), 0 9px 46px 8px rgb(255 255 255 / 12%)',

    notificationBackgroundColors: {
      success: colors.green[800],
      info: colors.grey[800],
      warn: colors.orange[800],
      error: colors.red[900],
    },

    buttonColors: {
      mainBtn: {
        backgroundColor: colors.blue[500],
      },
      appBtn: {
        backgroundColor: `linear-gradient(90deg, ${colors.pink[400]} 0%, ${colors.blue[600]} 100%)`,
      },
      error: {
        backgroundColor: colors.red[100],
      },
    },

    paperColors: {
      paperBlue: {
        backgroundColor: colors.white[700],
        color: colors.blue[500],
      },
    },
  },
}

export const appTheme = createTheme({
  palette: {
    mode: themeMode,
    error: {
      main: customThemeVars.common.buttonColors.error.backgroundColor,
    },
    warning: {
      main: customThemeVars.common.buttonColors.error.backgroundColor,
    },
    info: {
      main: customThemeVars.common.buttonColors.mainBtn.backgroundColor,
    },
    success: {
      main: colors.green[300],
    },
    primary: {
      main: colors.purple[400],
    },
    secondary: {
      main: colors.black[300],
    },
    background: {
      default: customThemeVars.common.backgroundColor,
      paper: customThemeVars.common.backgroundColor,
    },
    text: {
      primary: customThemeVars.common.color,
    },
  },

  typography: {
    fontFamily: '"Inter", "Roboto","Helvetica","Arial",sans-serif',

    h1: {
      fontSize: 28 / customThemeVars.common.baseFontSize + 'rem',
      fontWeight: 600,
      lineHeight: 38 / customThemeVars.common.baseFontSize + 'rem',
      color: colors.black[300],
    },
    h2: {
      fontSize: 20 / customThemeVars.common.baseFontSize + 'rem',
      fontWeight: 500,
      lineHeight: 28 / customThemeVars.common.baseFontSize + 'rem',
    },
    h3: {
      fontSize: 16 / customThemeVars.common.baseFontSize + 'rem',
      fontWeight: 600,
      lineHeight: 24 / customThemeVars.common.baseFontSize + 'rem',
    },
    h4: {
      fontSize: 14 / customThemeVars.common.baseFontSize + 'rem',
      fontWeight: 500,
      lineHeight: 20 / customThemeVars.common.baseFontSize + 'rem',
    },
    h5: {
      fontSize: 13 / customThemeVars.common.baseFontSize + 'rem',
      fontWeight: 400,
      lineHeight: 18 / customThemeVars.common.baseFontSize + 'rem',
    },
    h6: {
      fontSize: 12 / customThemeVars.common.baseFontSize + 'rem',
      fontWeight: 400,
      lineHeight: 18 / customThemeVars.common.baseFontSize + 'rem',
    },
  },

  components: {
    MuiGrid: {
      styleOverrides: {
        root: {
          '& .auth-header-wrap, & .dashboard-header-wrap': {
            borderBottomColor: customThemeVars.common.borderColor,
          },
          '& .auth-footer, & .dashboard-footer': {
            borderTopColor: customThemeVars.common.borderColor,
          },
          '& .grey-box': {
            backgroundColor: colors.white[700],
          },
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          fontSize: '0.9375rem',
          fontFamily: 'Inter',
          fontStyle: 'normal',
          fontWeight: '600',
          lineHeight: '22px',
          textTransform: 'capitalize',
          letterSpacing: '-0.1px',
        },
        contained: {
          boxShadow: '0px 1px 2px 0px rgba(16, 24, 40, 0.04)',

          '&.low-shadow-btn:hover': {
            boxShadow: `0px 1px 2px 1px ${colors.grey[700]} !important`,
          },

          '&.main-contained-btn': {
            background:
              customThemeVars.common.buttonColors.mainBtn.backgroundColor,
            borderRadius: '5px',
          },

          '&.app-contained-btn': {
            borderRadius: '6px',
            color: 'white',
            background:
              customThemeVars.common.buttonColors.appBtn.backgroundColor,
            padding: '12px 18px',
          },

          '&.gradient-btn': {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '8px',
            textTransform: 'none',
            padding: '8px 24px',
            fontWeight: 600,
            fontSize: '0.9rem',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
              transform: 'translateY(-1px)',
            },
          },

          '&.danger-contained-btn': {
            background:
              customThemeVars.common.buttonColors.error.backgroundColor,
            color: colors.white[900],
            borderRadius: '6px',
          },

          '&.btn-pad': {
            padding: '12px 18px',
          },

          '&.btn-small': {
            padding: '8px 12px',
            height: '36px',
          },

          '&.btn-disabled': {
            background: colors.grey[700],
            color: colors.grey[600],
          },
        },
        outlined: {
          '&.btn-pad': {
            padding: '12px 18px',
          },

          '&.main-outlined-btn.secondary-btn': {
            border: `1px solid ${colors.grey[700]}`,
          },
        },
        text: {
          color: colors.purple[400],
          '&:hover': {
            color: colors.purple[600],
          },
          '&.no-background': {
            background: 'none',
          },
          '&.link-button.blue': {
            color: colors.blue[700],
          },
          '&.link-button.grey': {
            color: colors.grey[400],
          },
          '&.link-button.underline': {
            textDecoration: 'underline',
          },
        },
      },
    },

    MuiTextField: {
      styleOverrides: {
        root: {
          '& .Mui-error': {
            marginLeft: 0,
          },
          '& .MuiFormHelperText-root': {
            marginLeft: 0,
          },
          '&.app-textbox .MuiOutlinedInput-input': {
            color: colors.grey[400],
          },
          '&.app-textbox fieldset': {
            borderColor: colors.grey[700],
          },
          '&.app-textbox .MuiOutlinedInput-root:not(.Mui-focused):hover fieldset':
            {
              borderColor: colors.grey[600],
            },
        },
      },
    },

    MuiAutocomplete: {
      styleOverrides: {
        root: {
          '& .placeholder': {
            color: colors.grey[600],
          },
          '&.app-dropdown': {
            minHeight: '40px',
            color: colors.grey[400],
          },
          '&.app-dropdown.small': {
            minHeight: '36px',
            color: colors.grey[400],
          },
          '&.app-dropdown fieldset': {
            borderColor: colors.grey[700],
          },
          '&.app-dropdown:hover fieldset': {
            borderColor: colors.grey[600],
          },
        },
      },
    },

    MuiTypography: {
      styleOverrides: {
        root: {
          fontFamily: '"Roboto","Inter","Helvetica","Arial",sans-serif',
          letterSpacing: '0.01em',
        },
      },
    },

    MuiBackdrop: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(0, 0, 0, 0.20)',
        },
      },
    },

    MuiModal: {
      styleOverrides: {
        root: {
          '& .modal-box': {
            borderColor: lightMode ? 'transparent' : colors.purple[300],
            boxShadow: customThemeVars.common.boxShadow,
            backgroundColor: lightMode ? colors.white[900] : colors.blue[100],
          },
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          '&.status-chip': {
            backgroundColor:
              customThemeVars.common.paperColors.paperBlue.backgroundColor,
            color: customThemeVars.common.paperColors.paperBlue.color,
            borderRadius: '5px',
          },
        },
      },
    },

    MuiAvatar: {
      styleOverrides: {
        root: {
          '&.large-avatar': {
            width: 170,
            height: 170,
            marginBottom: '16px',
            border: '4px dashed',
            borderColor: colors.grey[700],
          },
          '&.user-card-avatar': {
            width: 120,
            height: 120,
            margin: 'auto',
            border: '4px solid transparent',
            outline: '4px solid rgba(255, 255, 255, 0.3)',
            outlineOffset: '3px',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
            marginBottom: '6px',
          },
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          '&.user-card': {
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: '24px',
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)',
            },
          },
        },
      },
    },
  },
})
