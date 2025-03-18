'use client';

import {supabase} from 'utils/supabaseClient';
import Image from 'next/image';
import styles from './Login.module.css';
import {AppleLogo, FacebookLogo, GoogleLogo, KakatalkLogo, LineClose} from '@ui/Icons';
import {useRouter} from 'next/navigation';
import {sendSignIn} from '@/app/NetWork/AuthNetwork';
import {getBrowserLanguage} from '@/utils/browserInfo';
import {getLangUrlCode} from '@/configs/i18n';

const Login = () => {
  const handleOAuthLogin = async (provider: 'google' | 'kakao' | 'facebook' | 'apple') => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: process.env.NEXT_PUBLIC_FRONT_URL,
      },
    });
    const language = getLangUrlCode(getBrowserLanguage());
  };
  const router = useRouter();

  return (
    <div className={styles.loginContainer}>
      <button
        className={styles.closeBtn}
        onClick={() => {
          router.back();
        }}
      >
        <img src={LineClose.src} className={styles.closeImg}></img>
      </button>

      <button className={styles.buttonGuest}>Guest Account</button>

      <div className={styles.divider}>
        <span>or</span>
      </div>

      <div className={styles.benefitText}>
        Join us and enjoy daily <span className={styles.highlight}>free 300 rubies</span>
      </div>

      <div className={styles.buttonContainer}>
        <button className={styles.buttonKakao} onClick={() => handleOAuthLogin('kakao')}>
          <Image src={KakatalkLogo} width={24} height={24} alt="Kakao" />
          Continue with Kakaotalk
        </button>

        <button className={styles.buttonSocial} onClick={() => handleOAuthLogin('facebook')}>
          <Image src={FacebookLogo} width={24} height={24} alt="Facebook" />
          Continue with Facebook
        </button>

        <button className={styles.buttonSocial} onClick={() => handleOAuthLogin('google')}>
          <Image src={GoogleLogo} width={24} height={24} alt="Google" />
          Continue with Google
        </button>

        <button className={styles.buttonSocial} onClick={() => handleOAuthLogin('apple')}>
          <Image src={AppleLogo} width={24} height={24} alt="Apple" />
          Continue with Apple
        </button>
      </div>

      <div className={styles.policy}>
        <span>Privacy Policy</span>
        <span>Terms of Service</span>
      </div>
    </div>
  );
};

export default Login;
