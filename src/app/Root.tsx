'use client';

import {store, persistor} from '@/redux-store/ReduxStore';
import {ReactNode, useEffect} from 'react';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {ThemeProvider, createTheme} from '@mui/material/styles';

import CssBaseline from '@mui/material/CssBaseline';

// MUI에 전역 css 적용하는 코드
const theme = createTheme({
  typography: {
    fontFamily: "'Lato', 'Arial', 'Helvetica', 'sans-serif'",
  },
  components: {
    MuiTextField: {
      defaultProps: {
        autoComplete: 'off',
      },
    },
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
    MuiAvatar: {
      styleOverrides: {
        root: {
          width: '32px',
          height: '32px',
        },
      },
    },
  },
});

const Root = ({children}: {children: ReactNode}) => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider theme={theme}>
          <CssBaseline>{children}</CssBaseline>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
};

export default Root;
