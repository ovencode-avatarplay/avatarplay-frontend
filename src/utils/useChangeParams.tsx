import {useCallback} from 'react';
import {useSearchParams} from 'next/navigation';

const useChangeParams = () => {
  const searchParams = useSearchParams();

  const changeParams = useCallback(
    (key: any, value: any) => {
      if (searchParams == null) return;

      const currentParams = new URLSearchParams(searchParams.toString());

      currentParams.set(key, value); // 기존 키가 있으면 수정, 없으면 추가
      if (value == undefined || value == null) {
        currentParams.delete(key); // 값이 없을 경우 삭제
      }
      // } else {
      // }

      const newUrl = `${window.location.pathname}?${currentParams.toString()}`;
      window.history.replaceState(null, '', newUrl);
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

  return {changeParams, getParam};

  return {changeParams, getParam};
};

export default useChangeParams;
