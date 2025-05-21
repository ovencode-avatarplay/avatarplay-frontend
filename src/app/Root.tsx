'use client';

import parse from 'html-react-parser';
import {store, persistor} from '@/redux-store/ReduxStore';
import {ReactNode, useEffect, useRef, useState} from 'react';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {ThemeProvider, createTheme} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {useRouter} from 'next/navigation';
import {isLogined, refreshLanaguage} from '@/utils/UrlMove';
import useCustomRouter from '@/utils/useCustomRouter';
import {Backdrop, Snackbar} from '@mui/material';
import {atom, useAtom} from 'jotai';
import {SignalREventInjector} from './view/main/SignalREventInjector';

export enum ToastType {
  Normal,
  Error,
}

export type ToastMessageAtomType = {
  isOpen: boolean;
  message: string;
  type: ToastType;
  open: (message: string, type?: ToastType) => void;
};

export const ToastMessageAtom = atom<ToastMessageAtomType>({
  isOpen: false,
  type: ToastType.Normal,
  message: '',
  open: (message: string, type?: ToastType) => {},
});

const theme = createTheme({
  typography: {
    fontFamily: "'Lato', 'Noto Sans KR', 'Noto Sans JP', 'Noto Sans SC', 'Noto Sans TC'",
  },
  components: {
    MuiTextField: {
      defaultProps: {autoComplete: 'off'},
    },
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          fontFamily: "'Lato', 'Noto Sans KR', 'Noto Sans JP', 'Noto Sans SC', 'Noto Sans TC'",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: "'Lato', 'Noto Sans KR', 'Noto Sans JP', 'Noto Sans SC', 'Noto Sans TC'",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontFamily: "'Lato', 'Noto Sans KR', 'Noto Sans JP', 'Noto Sans SC', 'Noto Sans TC'",
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          fontFamily: "'Lato', 'Noto Sans KR', 'Noto Sans JP', 'Noto Sans SC', 'Noto Sans TC'",
        },
      },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          width: '24px',
          height: '24px',
        },
      },
    },
  },
});

const Root = ({children}: {children: ReactNode}) => {
  const [dataToast, setDataToast] = useAtom(ToastMessageAtom);
  const [hasRun, setHasRun] = useState(false);
  const [token, setToken] = useState<string | null>(null); // ✅ useState로 token 관리
  const router = useRouter();
  const {back} = useCustomRouter();
  const paddingRef = useRef();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const jwt = localStorage.getItem('jwt');
      if (jwt) {
        setToken(jwt);
      }
    }
  }, []);

  useEffect(() => {
    dataToast.open = openToastMessage;
  }, [dataToast]);

  const openToastMessage = (message: string, type: ToastType = ToastType.Normal) => {
    dataToast.message = message;
    dataToast.isOpen = true;
    dataToast.type = type;
    setDataToast({...dataToast});
  };

  useEffect(() => {
    refreshLanguage();
  }, [hasRun, router]);

  const refreshLanguage = async () => {
    if (!hasRun) {
      const isLogin = await isLogined();
      if (!isLogin) {
        refreshLanaguage(false, undefined, router);
      } else {
        refreshLanaguage(true, undefined, router);
      }
      setHasRun(true);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const jwt = localStorage.getItem('jwt');
      if (jwt && token !== jwt) {
        setToken(jwt);
      }
    }, 500); // 0.5초마다 체크
    return () => clearInterval(interval);
  }, [token]);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider theme={theme}>
          <CssBaseline>
            {token ? <SignalREventInjector token={token}>{children}</SignalREventInjector> : children}
            <ToastMessage
              isOpen={dataToast.isOpen}
              message={dataToast.message}
              type={dataToast.type}
              onClose={() => {
                dataToast.isOpen = false;
                setDataToast({...dataToast});
              }}
            />
          </CssBaseline>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
};

export default Root;

type ToastMessageType = {
  isOpen: boolean;
  message: string;
  type: ToastType;
  onClose: () => void;
};

export const ToastMessage = ({isOpen, message, onClose, type}: ToastMessageType) => {
  return (
    <>
      <Backdrop
        open={isOpen}
        onClick={() => onClose()}
        sx={{
          zIndex: 10001,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
        }}
      />
      <Snackbar
        open={isOpen}
        anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
        autoHideDuration={2000}
        message={parse(message)}
        onClose={() => onClose()}
        sx={{
          bottom: '20px',
          margin: '0 auto',
          width: 'calc(var(--full-width-percent) - 32px)',
          zIndex: 10002,
          '& .MuiPaper-root': {
            minHeight: '47px',
            width: '100%',
            background: 'rgba(255, 255, 255, 1)',
            borderRadius: '12px',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          },
          '& .MuiSnackbarContent-message': {
            width: '100%',
            textAlign: 'center',
            fontFamily: 'Lato, sans-serif',
            fontSize: '14px',
            fontWeight: 600,
            lineHeight: '20px',
            color: type === ToastType.Normal ? '#000' : '#F75555',
          },
        }}
      />
    </>
  );
};
