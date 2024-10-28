'use client';

// pages/login.tsx
import {supabase} from 'utils/supabaseClient';
import {Auth} from '@supabase/auth-ui-react';
import {ThemeSupa} from '@supabase/auth-ui-shared';

const Login = () => {
  return (
    <>
      <div style={{maxWidth: '320px', margin: 'auto'}}>
        <Auth
          supabaseClient={supabase}
          providers={['google', 'kakao']} // 구글, 카카오 등 추가하고 싶은 OAuth 제공자
          appearance={{theme: ThemeSupa}} // Supabase 기본 테마 사용
        />
      </div>
    </>
  );
};

export default Login;
