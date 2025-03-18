'use client';
import {useRouter} from 'next/navigation';

export const useBackHandler = () => {
  const router = useRouter();

  const handleBackClick = () => {
    // Perform any condition checks here
    // console.log('뒤로 가기 버튼 클릭');
    router.back();
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
