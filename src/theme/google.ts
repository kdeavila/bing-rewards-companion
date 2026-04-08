import { createTheme } from '@mui/material/styles';

export const googleTheme = createTheme({
  palette: {
    primary: {
      main: '#1a73e8', // Google Blue
    },
    secondary: {
      main: '#34a853', // Google Green
    },
    background: {
      default: '#f8f9fa',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h5: {
      fontWeight: 500,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 24, // Pill shape like modern Google buttons
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 1px 2px 0 rgba(60,64,67,.3), 0 1px 3px 1px rgba(60,64,67,.15)',
          '&:hover': {
            boxShadow: '0 4px 6px 0 rgba(60,64,67,.3), 0 4px 8px 3px rgba(60,64,67,.15)',
          },
        },
      },
    },
  },
});
