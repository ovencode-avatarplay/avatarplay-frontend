'use client';

import {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {supabase} from '@/utils/supabaseClient';
//import {useSignalR} from '@hooks/useSignalR';
import {setStar} from '@/redux-store/slices/Currency';
import {useDispatch} from 'react-redux';
import {CircularProgress, Box, Typography} from '@mui/material';

export default function LoginCallback() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const dispatch = useDispatch();
  // 💎 루비 선물 수신
  const onGift = (payload: any) => {
    dispatch(setStar(payload.amount));
    console.log(`💎 ${payload.amount} 루비를 선물 받았습니다!`);
  };

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
        router.replace('/ko/main/homefeed');
      }, 1000); // 1초 후 리다이렉트

      return () => clearTimeout(redirectTimer);
    }
  }, [token, router]);

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
