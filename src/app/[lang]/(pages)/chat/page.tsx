'use client';

import {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';
import {Turnstile} from '@marsidev/react-turnstile';
import Chat from '@/app/view/main/content/Chat/ChatPage';
import {isLogined} from '@/utils/UrlMove';

export default function ChatPage() {
  const router = useRouter();
  const [isVerified, setIsVerified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const loggedIn = await isLogined();
      if (loggedIn) {
        setIsVerified(true);
      }
      setIsLoading(false);
    };
    checkLoginStatus();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">로딩 중...</div>
      </div>
    );
  }

  if (!isVerified) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white">
        <div className="flex flex-col items-center justify-center p-8 rounded-lg shadow-lg bg-white">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">봇 방지를 위해 캡챠를 완료해주세요</h2>

          <div className="w-full flex justify-center">
            <Turnstile
              siteKey="0x4AAAAAABeUkzEB8lSdVkm6"
              onSuccess={() => setIsVerified(true)}
              options={{
                theme: 'light',
                size: 'normal',
                language: 'ko',
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  return <Chat />;
}
