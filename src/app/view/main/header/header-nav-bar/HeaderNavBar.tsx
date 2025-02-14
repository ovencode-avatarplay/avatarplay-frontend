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
import {BoldAlert, BoldReward, BoldRuby, BoldStar, LineMenu} from '@ui/Icons';
import {useDispatch} from 'react-redux';
import {setBottomNavColor, setSelectedIndex} from '@/redux-store/slices/MainControl';
import HamburgerBar from './HamburgerBar';

const HeaderNavBar = () => {
  const curRuby = '10.5K';
  const curStar = '100';

  const [logo, setLogo] = useState(logoTalkain);
  const dispatch = useDispatch();
  const [isHamOpen, setIsHamOpen] = useState(false);

  return (
    <header className={styles.navbar}>
      <div className={styles.logoArea}>
        <Image src={LineMenu.src} alt="Logo" width={24} height={24} priority onClick={() => setIsHamOpen(true)} />
        <Link href={getLocalizedLink('/main/homefeed')}>
          <div
            className={styles.logoArea}
            onClick={() => {
              dispatch(setBottomNavColor(0));
              dispatch(setSelectedIndex(0));
            }}
          >
            <Image src={logo} alt="Logo" width={85} height={17} priority />
          </div>
        </Link>
      </div>
      <div className={styles.rightArea}>
        <div className={styles.currencyArea}>
          <div className={styles.currencyItem}>
            <img className={styles.currencyIcon} src={BoldRuby.src} />
            <div className={styles.currencyText}>{curRuby}</div>
          </div>
          <div className={styles.currencyItem}>
            <img className={styles.currencyIcon} src={BoldStar.src} />
            <div className={styles.currencyText}>{curStar}</div>
          </div>
        </div>

        <div className={styles.buttons}>
          <Link href={getLocalizedLink('/main/game')}>
            <button
              onClick={() => {
                dispatch(setSelectedIndex(2));
                dispatch(setBottomNavColor(1));
              }}
            >
              <img className={styles.rewardIcon} src={BoldReward.src} />
            </button>
          </Link>
          <button className={styles.notification} onClick={() => {}}>
            <img className={styles.notificationIcon} src={BoldAlert.src} />
            <div className={styles.redDot}></div>
          </button>
        </div>
        {/* <UserDropdown /> */}
      </div>
      <HamburgerBar
        onClose={() => {
          setIsHamOpen(false);
        }}
        open={isHamOpen}
      ></HamburgerBar>
    </header>
  );
};

export default HeaderNavBar;
