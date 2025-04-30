'use client';

import parse from 'html-react-parser';
import {store, persistor} from '@/redux-store/ReduxStore';
import {ReactNode, useEffect, useRef, useState} from 'react';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {ThemeProvider, createTheme} from '@mui/material/styles';

import CssBaseline from '@mui/material/CssBaseline';
import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import {isLogined, refreshLanaguage} from '@/utils/UrlMove';
import useCustomRouter from '@/utils/useCustomRouter';
import {Backdrop, Snackbar} from '@mui/material';
import {atom, useAtom} from 'jotai';

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
          width: '24px',
          height: '24px',
        },
      },
    },
  },
});

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

const Root = ({children}: {children: ReactNode}) => {
  const [dataToast, setDataToast] = useAtom(ToastMessageAtom);
  const {back} = useCustomRouter();
  const [hasRun, setHasRun] = useState(false); // 상태를 관리하여 최초 실행 여부 판단
  const router = useRouter(); // useRouter는 클라이언트에서만 사용
  const paddingRef = useRef();

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
    // useRouter를 useEffect 안에서 호출하여 클라이언트 측에서만 실행되도록 설정
  }, [hasRun, router]); // hasRun과 router가 변경될 때마다 실행

  const refreshLanguage = async () => {
    if (!hasRun) {
      const isLogin = await isLogined();
      // 로그인되지 않은 유저면 Language 쿠키값을 현지언어로
      if (isLogin === false) {
        refreshLanaguage(false, undefined, router); // 언어 설정 후 라우팅
      } else {
        // 서버에 로그인 상태 갱신을 요청한다.
        // const router = useRouter(); // useRouter는 클라이언트에서만 사용
        // const _language: string = getLangUrlCode(getBrowserLanguage());
        // const reqData: SignInReq = {
        //   language: _language,
        // };
        // sendSignIn(reqData);
        refreshLanaguage(true, undefined, router); // 언어 설정 후 라우팅
      }

      setHasRun(true); // 상태를 업데이트하여 이후에는 실행되지 않도록 함
    }
  };

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider theme={theme}>
          <CssBaseline>
            {children}
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
        onClick={() => {
          onClose();
        }}
        sx={{
          zIndex: 10001,
          backgroundColor: 'rgba(0, 0, 0, 0.7)', // 살짝 어두운 흐림 효과
          // backdropFilter: 'blur(5px)', // 흐림 효과
        }}
      />
      <Snackbar
        open={isOpen}
        anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
        autoHideDuration={2000}
        message={parse(message)}
        onClose={() => {
          onClose();
        }}
        sx={{
          bottom: '20px',
          width: 'calc(var(--full-width-percent) - 32px)', // 전체 너비
          zIndex: 10002,
          '& .MuiPaper-root': {
            minHeight: '47px',
            width: '100%', // 전체 너비

            background: 'rgba(255, 255, 255, 1)', // 배경색
            borderRadius: '12px', // 둥근 모서리

            whiteSpace: 'nowrap', // 한 줄 처리
            overflow: 'hidden', // 넘치는 텍스트 숨김
            textOverflow: 'ellipsis', // 말줄임표 처리
          },
          '& .MuiSnackbarContent-message': {
            width: '100%',
            textAlign: 'center', // 텍스트 중앙 정렬
            fontFamily: 'Lato, sans-serif', // Lato 폰트 적용
            fontSize: '14px',
            fontWeight: 600,
            lineHeight: '20px',
            color: type == ToastType.Normal ? '#000' : '#F75555', // 글자 색상
          },
        }}
      />
    </>
  );
};
