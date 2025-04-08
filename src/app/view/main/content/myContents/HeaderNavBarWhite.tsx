import React, {useState} from 'react';

import Image from 'next/image';

import styles from './HeaderNavBarWhite.module.css';
import logoTalkain from '@ui/logo_talkain.png';

import UserDropdown from '@shared/UserDropdown';
import Link from 'next/link';
import {getLocalizedLink} from '@/utils/UrlMove';
import {
  BoldNotification,
  BoldReward,
  BoldRuby,
  BoldStar,
  LineFriendList,
  LineMenu,
  LineNotification,
  LineReward,
  LineSearch,
  LineSearchThin,
} from '@ui/Icons';
import {useDispatch, useSelector} from 'react-redux';
import {setBottomNavColor, setSelectedIndex} from '@/redux-store/slices/MainControl';
import HamburgerBar from '../../sidebar/HamburgerBar';
import {RootState} from '@/redux-store/ReduxStore';
import {formatCurrency} from '@/utils/util-1';

const HeaderNavBar = () => {
  const curRuby = '10.5K';
  const curStar = '100';

  const [logo, setLogo] = useState(logoTalkain);
  const dispatch = useDispatch();
  const [isHamOpen, setIsHamOpen] = useState(false);

  const dataStarInfo = useSelector((state: RootState) => state.starInfo);
  const starAmount = dataStarInfo.star;

  return (
    <header className={styles.navbar}>
      {/* <div className={styles.logoArea}>
        <Image src={LineMenu.src} alt="Logo" width={24} height={24} priority onClick={() => setIsHamOpen(true)} />
        <Link href={getLocalizedLink('/main/homefeed')}>
          <Image className={styles.logoImage} src={logo} alt="Logo" priority />
        </Link>
      </div> */}
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
            <button>
              <img className={styles.rewardIcon} src={LineSearchThin.src} />
            </button>
            <button className={styles.notification} onClick={() => {}}>
              <img className={styles.notificationIcon} src={LineFriendList.src} />
              {/* <div className={styles.redDot}></div> */}
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

        {/* <UserDropdown /> */}
      </div>
      <HamburgerBar
        onClose={() => {
          setIsHamOpen(false);
        }}
        isLeft={false}
        open={isHamOpen}
      ></HamburgerBar>
    </header>
  );
};

export default HeaderNavBar;
