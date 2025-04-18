'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { getAuth } from '@/app/NetWork/AuthNetwork';
import {updateProfile} from '@/redux-store/slices/Profile';

export default function useAuthFromUrl() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();

  // ① loading 초기값을 조건부로
  const [loading, setLoading] = useState(() => searchParams.get('token') !== null);

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {                // null 또는 빈 문자열
      setLoading(false);
      return;
    }

    (async () => {
      try {
        const res = await getAuth(token);

        if (res?.resultCode != 0) {
            setLoading(false);
            return;
        } 
            
        if (!res?.data?.profileSimpleInfo) {
            setLoading(false);
            return;
        }
        
        const profile = res?.data?.profileSimpleInfo ?? null;

        if(profile == null)
            return;

        dispatch(updateProfile(profile));
      } catch (e) {
        console.error('Token verify failed', e);
      } finally {
        // ② token 있을 때만 URL 정리
        router.replace(window.location.pathname);
        setLoading(false);
      }
    })();
  }, [searchParams, router, dispatch]);

  return loading;
}
