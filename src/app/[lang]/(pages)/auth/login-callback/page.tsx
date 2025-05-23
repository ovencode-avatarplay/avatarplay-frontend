'use client';

import {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {supabase} from '@/utils/supabaseClient';
//import {useSignalR} from '@hooks/useSignalR';
import {setStar} from '@/redux-store/slices/Currency';
import {useDispatch, useSelector} from 'react-redux';
import {CircularProgress, Box, Typography} from '@mui/material';
import {RootState} from '@/redux-store/ReduxStore';
import {setLastUrlLink} from '@/redux-store/slices/CommonRedux';
import {sendGetNotiReddot} from '@/app/NetWork/NotificationNetwork';
import {setUnread} from '@/redux-store/slices/Notification';
import {useSignalRContext} from '@/app/view/main/SignalREventInjector';

export default function LoginCallback() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const dispatch = useDispatch();
  const lastUrlLink = useSelector((state: RootState) => state.commonRedux.lastUrlLink);
  const signalR = useSignalRContext();

  // ✅ SignalR 연결
  //useSignalR(token ?? '');

  useEffect(() => {
    const init = async () => {
      try {
        setIsLoading(true);
        const session = await supabase.auth.getSession();
        const accessToken = session.data?.session?.access_token;

        if (!accessToken) {
          setError('로그인 세션을 찾을 수 없습니다.');
          return;
        }

        setToken(accessToken);

        // 알림 레드닷 상태 확인
        try {
          const response = await sendGetNotiReddot();
          if (response.data?.isNotifiactionReddot !== undefined) {
            dispatch(setUnread(response.data.isNotifiactionReddot));
            //TODO: 슬라이스에 잘 들어가는지 나중에 확인 필요
          }
          if (response.data?.isNotifiactionReddot === false) {
            dispatch(setUnread(false));
            // 서버의 알림 캐시 클리어
            await signalR?.clearNotificationCache();
          }
        } catch (err) {
          console.error('알림 레드닷 상태 확인 중 오류:', err);
        }
      } catch (err) {
        setError('로그인 처리 중 오류가 발생했습니다.');
        console.error('Login error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, []);

  useEffect(() => {
    if (token) {
      const redirectTimer = setTimeout(() => {
        if (lastUrlLink !== '') {
          router.replace(lastUrlLink);
          dispatch(setLastUrlLink(''));
        } else {
          router.replace('/ko/main/homefeed');
        }
      }, 1000); // 1초 후 리다이렉트

      return () => clearTimeout(redirectTimer);
    }
  }, [token, router, lastUrlLink, dispatch]);

  if (error) {
    return (
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="100vh" gap={2}>
        <Typography color="error">{error}</Typography>
        <Typography color="primary" sx={{cursor: 'pointer'}} onClick={() => router.replace('/ko/auth/login')}>
          로그인 페이지로 돌아가기
        </Typography>
      </Box>
    );
  }

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="100vh" gap={2}>
      <CircularProgress size={60} />
      <Typography variant="h6">로그인 중입니다...</Typography>
    </Box>
  );
}
