'use client'; // 이 파일은 클라이언트 전용 컴포넌트입니다.

import {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation'; // 클라이언트 사이드에서만 사용
import Root from './Root';
import '@/app/globals.css';
import {getCurrentLanguage, initLocalLanguage, isLogined, refreshLanaguage} from '@/utils/UrlMove';

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  minimumScale: 1,
  userScalable: false,
  interactiveWidget: 'resizes-content',
};

export default function Layout({children}: {children: React.ReactNode}) {
  const [hasRun, setHasRun] = useState(false); // 상태를 관리하여 최초 실행 여부 판단
  const router = useRouter(); // useRouter는 클라이언트에서만 사용

  useEffect(() => {
    // useRouter를 useEffect 안에서 호출하여 클라이언트 측에서만 실행되도록 설정
    if (!hasRun) {
      // 로그인되지 않은 유저면 Language 쿠키값을 현지언어로
      if (isLogined() === false) {
        refreshLanaguage(undefined, router); // 언어 설정 후 라우팅
      } else {
        refreshLanaguage(undefined, router); // 언어 설정 후 라우팅
      }

      setHasRun(true); // 상태를 업데이트하여 이후에는 실행되지 않도록 함
    }
  }, [hasRun, router]); // hasRun과 router가 변경될 때마다 실행

  return (
    <html lang="en">
      <body>
        <Root>{children}</Root> {/* 설정 정보를 Provider를 통해 자식 컴포넌트에 전달 */}
      </body>
    </html>
  );
}
