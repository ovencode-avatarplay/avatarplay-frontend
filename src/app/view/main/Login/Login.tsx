'use client';
import {useState} from 'react';
import {supabase} from 'utils/supabaseClient';
import Image from 'next/image';
import styles from './Login.module.scss';
import {AppleLogo, FacebookLogo, GoogleLogo, KakatalkLogo, EmailLogo, LineClose} from '@ui/Icons';
import {useRouter} from 'next/navigation';
import {getBrowserLanguage} from '@/utils/browserInfo';
import {getLangUrlCode} from '@/configs/i18n';
import getLocalizedText from '@/utils/getLocalizedText';
import formatText from '@/utils/formatText';
import useCustomRouter from '@/utils/useCustomRouter';
import logoTalkain from '@ui/logo_talkain.png';

const Login = () => {
  const {back} = useCustomRouter();
  const Header = 'Login';
  const Common = 'Common';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const handleOAuthLogin = async (provider: 'google' | 'kakao' | 'facebook' | 'apple') => {
    const langCode = getLangUrlCode(getBrowserLanguage());
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${langCode}/auth/login-callback?from=oauth`,
      },
    });

    //이부분에 signalIR 연결
  };

 const handleEmailLogin = async () => {
    const {data, error} = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert('로그인 실패: ' + error.message);
    } else {
      router.push('/'); // 로그인 성공 후 이동할 경로
    }
  };
  const router = useRouter();

  return (
    <div className={styles.loginContainer}>
      <div className={styles.logoWrapper}>
        <Image src={logoTalkain} width={110} height={26.28} alt="Talkain Logo" />
      </div>
      <button
        className={styles.closeBtn}
        onClick={() => {
          back();
        }}
      >
        <img src={LineClose.src} className={styles.closeImg}></img>
      </button>

      <button style={{display: 'none'}} className={styles.buttonGuest}>
        {getLocalizedText('login001_button_006')}
      </button>

      <div style={{display: 'none'}} className={styles.divider}>
        <span>{getLocalizedText(Header, 'login001_label_001')}</span>
      </div>

      <div className={styles.benefitText}>
        {formatText(getLocalizedText(Header, 'login001_desc_002'))}

        <span className={styles.highlight}>{formatText(getLocalizedText(Header, 'login001_label_003'), ['300'])}</span>

        {/* Join us and enjoy daily <span className={styles.highlight}>free 300 rubies</span> */}
      </div>

      <div className={styles.buttonContainer}>
        <button className={styles.buttonKakao} onClick={() => handleOAuthLogin('kakao')}>
          <Image src={KakatalkLogo} width={24} height={24} alt="Kakao" />
          {getLocalizedText('common_button_continuewithkakaotalk')}
        </button>
        <button style={{display: 'none'}} className={styles.buttonSocial} onClick={() => handleOAuthLogin('facebook')}>
          <Image src={FacebookLogo} width={24} height={24} alt="Facebook" />
          {getLocalizedText('common_button_continuewithfacebook')}{' '}
        </button>
        <button className={styles.buttonSocial} onClick={() => handleOAuthLogin('google')}>
          <Image src={GoogleLogo} width={24} height={24} alt="Google" />
          {getLocalizedText('common_button_continuewithgoogle')}{' '}
        </button>
        <button className={styles.buttonSocial} onClick={() => handleOAuthLogin('apple')}>
          <Image src={AppleLogo} width={24} height={24} alt="Apple" />
          {getLocalizedText('common_button_continuewithapple')}{' '}
        </button>
        <hr className={styles.divider} />
        <div className={styles.emailLoginSection}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={styles.emailInput}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={styles.emailInput}
          />
          <button className={styles.buttonSocial} onClick={handleEmailLogin}>
            <Image src={EmailLogo} width={24} height={24} alt="Email" />
            {getLocalizedText('common_button_continuewithemail')}
          </button>
        </div>
        <a href="register" rel="noopener noreferrer">
          {getLocalizedText('login001_label_register')}
        </a>
      </div>

      <div className={styles.policy}>
        <a href="/privacy-policy" target="_blank" rel="noopener noreferrer">
          {getLocalizedText('login001_label_004')}
        </a>
        <a href="/terms-of-service" target="_blank" rel="noopener noreferrer">
          {getLocalizedText('login001_label_005')}
        </a>
      </div>
    </div>
  );
};

export default Login;
