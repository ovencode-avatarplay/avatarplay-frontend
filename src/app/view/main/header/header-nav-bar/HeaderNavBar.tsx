import React, {useState} from 'react';

import Image from 'next/image';

import styles from './HeaderNavBar.module.css';

import Logo256White from '/public/images/Talkain_logo_256_white.png';
import Logo256Black from '/public/images/Talkain_logo_256_black.png';
import Logo512White from '/public/images/Talkain_logo_512_white.png';
import Logo512Black from '/public/images/Talkain_logo_512_black.png';
import logoTalkain from '@ui/logo_talkain.png';

import UserDropdown from '@shared/UserDropdown';
import Link from 'next/link';
import {getLocalizedLink} from '@/utils/UrlMove';
import {BoldAlert, BoldRuby, BoldStar} from '@ui/Icons';

const HeaderNavBar = () => {
  const [logo, setLogo] = useState(logoTalkain);

  return (
    <header className={styles.navbar}>
      <Link href={getLocalizedLink('/main/homefeed')}>
        <div className={styles.logoArea}>
          <Image src={logo} alt="Logo" width={128} height={128} priority />
        </div>
      </Link>
      <div className={styles.rightArea}>
        <div className={styles.currencyArea}>
          <div className={styles.currencyItem}>
            <img className={styles.currencyIcon} src={BoldRuby.src} />
            <div className={styles.currencyText}>CurRuby</div>
          </div>
          <div className={styles.currencyItem}>
            <img className={styles.currencyIcon} src={BoldStar.src} />
            <div className={styles.currencyText}>CurStar</div>
          </div>
        </div>
        <button className={styles.notification} onClick={() => {}}>
          <img className={styles.notificationIcon} src={BoldAlert.src} />
        </button>
        <UserDropdown />
      </div>
    </header>
  );
};

export default HeaderNavBar;
