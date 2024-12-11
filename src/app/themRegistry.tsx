'use client';

import {createTheme, ThemeProvider} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
  typography: {
    fontFamily: "'Lato', 'Arial', 'Helvetica', 'sans-serif'",
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          fontFamily: "'Lato', 'Arial', 'Helvetica', 'sans-serif'",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: "'Lato', 'Arial', 'Helvetica', 'sans-serif'",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontFamily: "'Lato', 'Arial', 'Helvetica', 'sans-serif'",
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          fontFamily: "'Lato', 'Arial', 'Helvetica', 'sans-serif'",
        },
      },
    },
  },
});

export default function ThemeRegistry({children}: {children: React.ReactNode}) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
