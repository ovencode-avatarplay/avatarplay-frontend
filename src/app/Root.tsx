'use client';

import {store, persistor} from '@/redux-store/ReduxStore';
import {ReactNode} from 'react';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {ThemeProvider, createTheme} from '@mui/material/styles';

import CssBaseline from '@mui/material/CssBaseline';

// MUI에 전역 css 적용하는 코드
const theme = createTheme({
  typography: {
    fontFamily: "'Lato', 'Noto Sans KR', 'Noto Sans JP', 'Noto Sans SC', 'Noto Sans TC' ",
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
          fontFamily: "'Lato', 'Noto Sans KR', 'Noto Sans JP', 'Noto Sans SC', 'Noto Sans TC' ",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: "'Lato', 'Noto Sans KR', 'Noto Sans JP', 'Noto Sans SC', 'Noto Sans TC' ",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontFamily: "'Lato', 'Noto Sans KR', 'Noto Sans JP', 'Noto Sans SC', 'Noto Sans TC' ",
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          fontFamily: "'Lato', 'Noto Sans KR', 'Noto Sans JP', 'Noto Sans SC', 'Noto Sans TC' ",
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
