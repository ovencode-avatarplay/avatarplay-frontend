'use client';
import {useRouter} from 'next/navigation';
import useCustomRouter from './useCustomRouter';

export const useBackHandler = () => {
  const {back} = useCustomRouter();
  const router = useRouter();

  const handleBackClick = () => {
    // Perform any condition checks here
    // console.log('뒤로 가기 버튼 클릭');
    back();
  };

  return handleBackClick;
};

// 줌인아웃을 막는다. ( 채팅창에서만 ?? )
export const preventZoom = () => {
  document.addEventListener(
    'touchstart',
    event => {
      if (event.touches.length > 1) {
        event.preventDefault(); // 두 손가락 터치 시 기본 동작 방지
      }
    },
    {passive: false},
  );

  document.addEventListener(
    'touchmove',
    event => {
      if (event.touches.length > 1) {
        event.preventDefault(); // 두 손가락 터치 시 스크롤도 방지
      }
    },
    {passive: false},
  );
};

export const getBackUrl = () => {
  const storage = globalThis?.sessionStorage;
  const prevPath = storage.getItem('prevPath');
  const curPath = storage.getItem('currentPath');
  if (prevPath == curPath) {
    return null;
  }
  return prevPath;
};

export const formatCurrency = (value: number): string => {
  if (value >= 1_000_000) {
    return (value / 1_000_000).toFixed(value % 1_000_000 === 0 ? 0 : 3) + 'M';
  } else if (value >= 1_000) {
    return (value / 1_000).toFixed(value % 1_000 === 0 ? 0 : 3) + 'K';
  }
  return value.toString();
};

export const copyStrToClipboard = (str: string) => {
  console.log('str : ', str);
  if (typeof window === 'undefined') return; // 서버에서 실행 방지

  const success = () => {
    console.log('URL을 클립보드에 복사했습니다.');
  };
  const failure = (err: any) => console.error('클립보드에 URL을 복사하지 못했습니다. : ', err);

  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(str).then(success).catch(failure);
    } else {
      const tempInput = document.createElement('textarea');
      tempInput.value = str;
      document.body.appendChild(tempInput);
      tempInput.select();
      tempInput.focus();

      const successful = document.execCommand('copy');
      document.body.removeChild(tempInput);

      successful ? success() : failure('execCommand를 통한 복사 실패');
    }
  } catch (error) {
    failure(error);
  }
};

export const copyCurrentUrlToClipboard = (pathname: any, searchParams: any) => {
  if (typeof window === 'undefined') return; // 서버에서 실행 방지

  const queryString = searchParams?.toString() || ''; // 현재 쿼리 파라미터 가져오기
  const url = queryString
    ? `${window.location.origin}${pathname}?${queryString}`
    : `${window.location.origin}${pathname}`;
  copyStrToClipboard(url);
};
