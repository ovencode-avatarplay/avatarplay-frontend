'use client';

import {useEffect, useState} from 'react';
import {useRouter, useSearchParams} from 'next/navigation';
import {supabase} from '@/utils/supabaseClient';
import {useSignalR} from '@hooks/useSignalR';

export default function LoginCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [token, setToken] = useState<string | null>(null);

  const onMessage = (payload: any) => {
    console.log('📩 Received:', payload);
  };

  // ✅ useSignalR은 항상 호출되지만 내부에서 token 없으면 연결 시도 안 함
  const {joinRoom} = useSignalR(token ?? '', onMessage);
  const getOrCreateDMRoom = async (): Promise<number> => {
    const res = await fetch('/api/chat/dm-room', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // 쿠키 인증 필요 시
    });

    const data = await res.json();

    if (!res.ok || !data.roomId) {
      throw new Error('DM 방 생성 실패');
    }

    return data.roomId;
  };

  useEffect(() => {
    const init = async () => {
      const session = await supabase.auth.getSession();
      const accessToken = session.data?.session?.access_token;
      if (!accessToken) return;

      setToken(accessToken); // token 설정되면 useSignalR 훅에 반영됨
    };

    init();
  }, []);

  useEffect(() => {
    if (!token) return;

    const connectToRoom = async () => {
      const roomId = await getOrCreateDMRoom(); // ✅ 서버 API 호출
      await joinRoom(roomId);
      router.replace('/ko/main/homefeed');
    };

    connectToRoom();
  }, [token]);

  return <div>로그인 중입니다...</div>;
}
