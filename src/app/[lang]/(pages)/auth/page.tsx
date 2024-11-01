'use client';

// pages/login.tsx
import {useEffect} from 'react';
import {supabase} from 'utils/supabaseClient';
import {Auth} from '@supabase/auth-ui-react';
import {ThemeSupa} from '@supabase/auth-ui-shared';
import {useRouter, useSearchParams} from 'next/navigation';
import {Session} from '@supabase/supabase-js';

const Login = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect'); // 쿼리 파라미터에서 redirect 값을 가져옴

  useEffect(() => {
    const handleAuthStateChange = async (event: any, session: Session | null) => {
      if (event === 'SIGNED_IN') {
        // 로그인 성공 시 리다이렉트
        alert(session?.access_token);

        try {
          const jwtToken = session?.access_token; // 세션에서 JWT 토큰 추출

          const response = await fetch(`${process.env.NEXT_PUBLIC_CHAT_API_URL}/api/v1/auth/sign-in`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${jwtToken}`, // JWT를 Authorization 헤더에 포함
              'Content-Type': 'application/json',
            },
          });

          if (!response.ok) {
            console.error('Failed to authenticate:', response.statusText);
            return;
          }

          const data = await response.json();
          localStorage.setItem('jwt', data.accessToken);
        } catch (error) {
          console.error('Error occurred during authentication:', error);
        }
      }

      if (redirect) {
        router.push(redirect);
      } else {
        router.push('/');
      }

      const {data: authListener} = supabase.auth.onAuthStateChange((event, session) => {
        handleAuthStateChange(event, session);
      });

      return () => {
        authListener?.subscription.unsubscribe();
      };
    };
  }, []);

  return (
    <>
      <div style={{maxWidth: '320px', margin: 'auto'}}>
        <Auth
          supabaseClient={supabase}
          providers={['google', 'kakao']} // 구글, 카카오 등 추가하고 싶은 OAuth 제공자
          appearance={{theme: ThemeSupa}} // Supabase 기본 테마 사용
          onlyThirdPartyProviders
        />
      </div>
    </>
  );
};

export default Login;
