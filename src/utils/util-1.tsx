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
