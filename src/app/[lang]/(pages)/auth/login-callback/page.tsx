'use client';

import {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {supabase} from '@/utils/supabaseClient';
import {useSignalR} from '@hooks/useSignalR';
import {setStar} from '@/redux-store/slices/Currency';
import {useDispatch} from 'react-redux';

export default function LoginCallback() {
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);

  const dispatch = useDispatch();
  // 💎 루비 선물 수신
  const onGift = (payload: any) => {
    dispatch(setStar(payload.amount));
    console.log(`💎 ${payload.amount} 루비를 선물 받았습니다!`);
  };

  // ✅ SignalR 연결
  useSignalR(token ?? '', onGift);

  useEffect(() => {
    const init = async () => {
      const session = await supabase.auth.getSession();
      const accessToken = session.data?.session?.access_token;
      if (!accessToken) return;

      setToken(accessToken);
    };

    init();
  }, []);

  useEffect(() => {
    if (token) {
      // 연결만 하고 리다이렉트
      router.replace('/ko/main/homefeed');
    }
  }, [token]);

  return <div>로그인 중입니다...</div>;
}
