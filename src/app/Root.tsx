'use client';

import {store, persistor} from '@/redux-store/ReduxStore';
import {ReactNode, useEffect, useRef, useState} from 'react';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {ThemeProvider, createTheme} from '@mui/material/styles';

import CssBaseline from '@mui/material/CssBaseline';
import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import {isLogined, refreshLanaguage} from '@/utils/UrlMove';
import useCustomRouter from '@/utils/useCustomRouter';

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

const Root = ({children}: {children: ReactNode}) => {
  const {back} = useCustomRouter();
  const [hasRun, setHasRun] = useState(false); // 상태를 관리하여 최초 실행 여부 판단
  const router = useRouter(); // useRouter는 클라이언트에서만 사용
  const paddingRef = useRef();
  useEffect(() => {
    refreshLanguage();
    // useRouter를 useEffect 안에서 호출하여 클라이언트 측에서만 실행되도록 설정
  }, [hasRun, router]); // hasRun과 router가 변경될 때마다 실행

  const refreshLanguage = async () => {
    if (!hasRun) {
      const isLogin = await isLogined();
      // 로그인되지 않은 유저면 Language 쿠키값을 현지언어로
      if (isLogin === false) {
        refreshLanaguage(undefined, router); // 언어 설정 후 라우팅
      } else {
        // 서버에 로그인 상태 갱신을 요청한다.
        // const router = useRouter(); // useRouter는 클라이언트에서만 사용
        // const _language: string = getLangUrlCode(getBrowserLanguage());
        // const reqData: SignInReq = {
        //   language: _language,
        // };
        // sendSignIn(reqData);
        refreshLanaguage(undefined, router); // 언어 설정 후 라우팅
      }

      setHasRun(true); // 상태를 업데이트하여 이후에는 실행되지 않도록 함
    }
  };

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
