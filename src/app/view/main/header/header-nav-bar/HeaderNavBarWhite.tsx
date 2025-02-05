import React, {useState} from 'react';

import Image from 'next/image';

import styles from './HeaderNavBarWhite.module.css';

import Logo256White from '/public/images/Talkain_logo_256_white.png';
import Logo256Black from '/public/images/Talkain_logo_256_black.png';
import Logo512White from '/public/images/Talkain_logo_512_white.png';
import Logo512Black from '/public/images/Talkain_logo_512_black.png';
import logoTalkain from '@ui/logo_talkain.png';

import UserDropdown from '@shared/UserDropdown';
import Link from 'next/link';
import {getLocalizedLink} from '@/utils/UrlMove';
import {BoldAlert, BoldRuby, BoldStar, LineMenu} from '@ui/Icons';
import {useDispatch, useSelector} from 'react-redux';
import {setBottomNavColor, setSelectedIndex} from '@/redux-store/slices/MainControl';
import HamburgerBar from './HamburgerBar';
import TestAdModal from './TestAdModal';
import {RootState} from '@/redux-store/ReduxStore';

const HeaderNavBarWhite = () => {
  const selectedIndex = useSelector((state: RootState) => state.mainControl.selectedIndex);
  const curRuby = '10.5K';
  const curStar = '100';

  const [logo, setLogo] = useState(logoTalkain);
  const dispatch = useDispatch();
  const [isHamOpen, setIsHamOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [iframeSrc, setIframeSrc] = useState('');
  const openModal = (type: 'ruby' | 'star') => {
    if (type === 'ruby') {
      setIframeSrc('https://example.com/ruby'); // 여기에 실제 오퍼월 URL을 입력
    } else {
      setIframeSrc('https://example.com/star'); // 여기에 실제 오퍼월 URL을 입력
    }
    setIsModalOpen(true);
  };
  return (
    <>
      <header className={styles.navbar}>
        <div className={styles.logoArea}>
          <Image
            src={LineMenu.src}
            alt="Logo"
            width={24}
            height={24}
            priority
            onClick={() => setIsHamOpen(true)}
            className={styles.logo}
          />
          <Link href={getLocalizedLink('/main/homefeed')}>
            <div
              className={styles.logoArea}
              onClick={() => {
                dispatch(setBottomNavColor(0));
                dispatch(setSelectedIndex(0));
              }}
            >
              <Image src={logo} alt="Logo" width={85} height={17} priority className={styles.logo} />
            </div>
          </Link>
        </div>
        {selectedIndex == 3 && (
          <div className={styles.rightArea}>
            <button className={styles.notification} onClick={() => {}}>
              <img className={styles.notificationIcon} src={BoldAlert.src} />
              <div className={styles.redDot}></div>
            </button>
            {/* <UserDropdown /> */}
          </div>
        )}
        <HamburgerBar
          onClose={() => {
            setIsHamOpen(false);
          }}
          open={isHamOpen}
        ></HamburgerBar>
      </header>

      {/* 전체 화면 모달 */}
      <TestAdModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} iframeSrc={iframeSrc}></TestAdModal>
    </>
  );
};

export default HeaderNavBarWhite;
