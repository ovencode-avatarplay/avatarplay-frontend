'use client'; // 이 파일은 클라이언트 전용 컴포넌트입니다.

import {useEffect, useRef, useState} from 'react';
import {usePathname, useRouter} from 'next/navigation'; // 클라이언트 사이드에서만 사용
import Root from './Root';
import '@/app/globals.css';
import '@/app/reset.css';
import {isLogined, refreshLanaguage} from '@/utils/UrlMove';

export default function Layout({
  children,
  searchParams,
}: {
  children: React.ReactNode;
  searchParams: {[key: string]: never};
}) {
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

  const pathname = usePathname();

  //storing the pathnames when the value changes.
  useEffect(() => {
    storePathValues();
  }, [pathname, searchParams]);

  function storePathValues() {
    const storage = globalThis?.sessionStorage;
    if (!storage) return;

    // Set the previous path as the value of the current path.
    const prevPath = storage.getItem('currentPath');

    storage.setItem('prevPath', prevPath ?? '');
    // Set the current path value by looking at the browser's location object.
    storage.setItem('currentPath', globalThis.location.pathname + globalThis.location.search);
  }

  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR&family=Noto+Sans+JP&family=Noto+Sans+SC&family=Noto+Sans+TC&display=swap"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </head>
      <body>
        <Root>{children}</Root> {/* 설정 정보를 Provider를 통해 자식 컴포넌트에 전달 */}
        {/* <div ref={paddingRef} style={{height: '0px', width: '100%'}}></div> */}
      </body>
    </html>
  );
}
