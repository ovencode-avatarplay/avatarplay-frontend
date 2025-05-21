import React, {useState} from 'react';

import Image from 'next/image';

import styles from './HeaderNavBarWhite.module.css';
import logoTalkain from '@ui/logo_talkain.png';

import Link from 'next/link';
import {getLocalizedLink} from '@/utils/UrlMove';
import {LineFriendList, LineMenu, LineSearchThin} from '@ui/Icons';
import {useDispatch, useSelector} from 'react-redux';
import {setBottomNavColor, setSelectedIndex} from '@/redux-store/slices/MainControl';
import HamburgerBar from '../../sidebar/HamburgerBar';
import {RootState} from '@/redux-store/ReduxStore';
import ChatSearchMain from './03_Search/ChatSearchMain';

const HeaderNavBar = () => {
  const [logo, setLogo] = useState(logoTalkain);
  const dispatch = useDispatch();
  const [isHamOpen, setIsHamOpen] = useState(false);

  const [openSearch, setOpenSearch] = useState(false);

  return (
    <header className={styles.navbar}>
      <div className={styles.logoArea}>
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
      <div className={styles.rightArea}>
        <div className={styles.rightinfo}>
          <div className={styles.buttons}>
            <button
              onClick={() => {
                setOpenSearch(true);
              }}
            >
              <img className={styles.rewardIcon} src={LineSearchThin.src} />
            </button>
            <button className={styles.notification} onClick={() => {}}>
              <img className={styles.notificationIcon} src={LineFriendList.src} />
            </button>
            <Image
              src={LineMenu.src}
              alt="Ham"
              width={24}
              height={24}
              priority
              onClick={() => setIsHamOpen(true)}
              className={styles.ham}
            />
          </div>
        </div>
      </div>
      <HamburgerBar
        onClose={() => {
          setIsHamOpen(false);
        }}
        isLeft={false}
        open={isHamOpen}
      ></HamburgerBar>
      <ChatSearchMain isOpen={openSearch} onClose={() => setOpenSearch(false)}></ChatSearchMain>
    </header>
  );
};

export default HeaderNavBar;
