import {usePathname, useRouter, useSearchParams} from 'next/navigation';
import React, {useCallback, useEffect} from 'react';
import {getLocalizedLink} from './UrlMove';
import {atom, useAtom} from 'jotai';

const MAX_HISTORY = 5; // 저장할 최대 경로 개수

export const getBackUrl = () => {
  const storage = globalThis?.sessionStorage;
  const prevPathList = JSON.parse(storage.getItem('prevPathList') || '[]');

  if (prevPathList.length === 0) {
    return null; // 이전 경로가 없으면 null 반환
  }

  return prevPathList[prevPathList.length - 1]; // 가장 최근의 이전 경로 반환
};

export type useCustomRouterType = {
  isNotSavePrevPath: boolean;
  isReplaceLastPath: boolean;
};

export const routerAtom = atom<useCustomRouterType>({
  isNotSavePrevPath: false,
  isReplaceLastPath: false,
});

const useCustomRouter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [data, setData] = useAtom(routerAtom);

  useEffect(() => {
    storePathValues();
  }, [pathname, searchParams]);

  function storePathValues() {
    const storage = globalThis?.sessionStorage;
    if (!storage) return;

    const prevPath = storage.getItem('currentPath');

    let prevPathList = JSON.parse(storage.getItem('prevPathList') || '[]');
    const prevPathname = prevPath ? new URL(prevPath, window.location.origin).pathname : null;
    const currentPathname = globalThis.location.pathname; // 현재 pathname만 가져오기

    if (prevPathname && prevPathname !== currentPathname && !data.isNotSavePrevPath) {
      prevPathList.push(prevPath);
    }

    if (prevPathList.length > MAX_HISTORY) {
      prevPathList.shift(); // 오래된 항목 제거
    }

    // 새로운 prevPathList 저장
    storage.setItem('prevPathList', JSON.stringify(prevPathList));

    // 현재 경로 저장 (query params 포함)
    storage.setItem('currentPath', globalThis.location.pathname + globalThis.location.search);
    data.isNotSavePrevPath = false;
    setData({...data});
  }

  const replace = (path: string) => {
    // 새 경로로 replace
    router.replace(getLocalizedLink(path));
    data.isNotSavePrevPath = true;
    // 이전 경로 저장하지 않도록 설정
    setData({...data});
  };

  const back = (defaultPath = '/main/homefeed') => {
    const storage = globalThis?.sessionStorage;
    let prevPathList = JSON.parse(storage.getItem('prevPathList') || '[]');

    if (prevPathList.length === 0) {
      router.replace(getLocalizedLink(defaultPath));
    } else {
      const prevPath = prevPathList.pop(); // 마지막 경로를 꺼냄
      storage.setItem('prevPathList', JSON.stringify(prevPathList));

      // 현재 경로를 이전 경로로 설정
      storage.setItem('currentPath', prevPath);

      router.replace(prevPath);
    }

    data.isNotSavePrevPath = true;
    setData({...data});
  };

  const changeParams = useCallback(
    (key: any, value: any) => {
      if (searchParams == null) return;

      const currentParams = new URLSearchParams(searchParams.toString());

      currentParams.set(key, value); // 기존 키가 있으면 수정, 없으면 추가
      if (value == undefined || value == null) {
        currentParams.delete(key); // 값이 없을 경우 삭제
      }

      const newUrl = `${window.location.pathname}?${currentParams.toString()}`;
      window.history.replaceState(null, '', newUrl);

      setData({...data});
    },
    [searchParams],
  );

  const getParam = useCallback(
    (key: any) => {
      if (searchParams == null) return;

      const currentParams = new URLSearchParams(searchParams.toString());
      return currentParams.get(key) || null;
    },
    [searchParams],
  );

  return {back, changeParams, getParam, replace};
};

export default useCustomRouter;
