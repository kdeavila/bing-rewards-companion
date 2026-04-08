import { createTheme } from '@mui/material/styles';

export type ThemeMode = 'light' | 'dark';

export const googleTheme = createTheme({
    colorSchemes: {
      light: {
        palette: {
          primary: {
            main: '#1a73e8', // Google Blue
          },
          secondary: {
            main: '#34a853', // Google Green
          },
          background: {
            default: '#f8f9fa',
            paper: '#ffffff',
          },
        },
      },
      dark: {
        palette: {
          primary: {
            main: '#8ab4f8',
          },
          secondary: {
            main: '#81c995',
          },
          background: {
            default: '#111418',
            paper: '#1b1f24',
          },
        },
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
          root: ({ theme }) => [
            {
              boxShadow: '0 1px 2px 0 rgba(60,64,67,.3), 0 1px 3px 1px rgba(60,64,67,.15)',
              '&:hover': {
                boxShadow: '0 4px 6px 0 rgba(60,64,67,.3), 0 4px 8px 3px rgba(60,64,67,.15)',
              },
            },
            theme.applyStyles('dark', {
              boxShadow: '0 1px 2px 0 rgba(0,0,0,.5), 0 2px 6px 0 rgba(0,0,0,.35)',
              '&:hover': {
                boxShadow: '0 4px 10px 0 rgba(0,0,0,.45), 0 8px 20px 0 rgba(0,0,0,.35)',
              },
            }),
          ],
        },
      },
    },
  });
