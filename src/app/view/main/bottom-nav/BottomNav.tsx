'use client';

import * as React from 'react';

// style, mui
import styles from './BottomNav.module.scss';

import profileData from 'data/profile/profile-data.json';

// components
import Link from 'next/link';
import CreateWidget from '../content/create/CreateWidget';
import SelectProfileWidget from '../../profile/SelectProfileWidget';
import {getLocalizedLink, isLogined} from '@/utils/UrlMove';
import {useDispatch, useSelector} from 'react-redux';
import {Add_Button, BoldHome, LinePlus} from '@ui/Icons';
import {setBottomNavColor, setSelectedIndex} from '@/redux-store/slices/MainControl';
import {RootState} from '@/redux-store/ReduxStore';
import UserDropdown from '@/components/layout/shared/UserDropdown';
import {setSkipStoryInit} from '@/redux-store/slices/StoryInfo';
import {useAtom} from 'jotai';
import {useRouter} from 'next/navigation';

export default function BottomNav() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [profileDrawerOpen, setProfileDrawerOpen] = React.useState(false);
  const [timer, setTimer] = React.useState<NodeJS.Timeout | null>(null);
  const selectedIndex = useSelector((state: RootState) => state.mainControl.selectedIndex);
  const colorMode = useSelector((state: RootState) => state.mainControl.bottomNavColor);

  const toggleDrawer = (open: boolean) => {
    setDrawerOpen(open); //
  };

  const handleClick = (index: number) => {
    if (index == 0) {
      dispatch(setBottomNavColor(0));
    } else {
      dispatch(setBottomNavColor(1));
    }
    dispatch(setSelectedIndex(index));
  };

  const toggleProfileDrawer = (open: boolean) => {
    setProfileDrawerOpen(open);
  };

  const handleLongPressStart = () => {
    const timeout = setTimeout(() => {
      toggleProfileDrawer(true); // 2초 후 DrawerSelectProfile 열기
    }, 2000); // 2초
    setTimer(timeout);
  };
  const handleLongPressEnd = () => {
    if (timer) {
      clearTimeout(timer); // 버튼을 누르다 떼면 타이머 초기화
    }
    setTimer(null);
  };

  //#region SVG Control
  const lightIconColor = '#BDC1C6';
  const lightSelectColor = '#000000';

  const checkColor = (index: number) => {
    if (index === selectedIndex) {
      return 'brightness(0) saturate(100%) invert(0%) sepia(93%) saturate(30%) hue-rotate(80deg) brightness(92%) contrast(107%)';
    } else {
      return 'brightness(0) saturate(100%) invert(86%) sepia(4%) saturate(285%) hue-rotate(174deg) brightness(91%) contrast(86%)';
    }
  };

  const homeSvg = (
    <img className={styles.buttonIcon} style={{filter: checkColor(0)}} src={'/ui/Icons/Bold/Home.svg'} />
    // <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
    //   <path
    //     fillRule="evenodd"
    //     clipRule="evenodd"
    //     d="M9.34393 20.7821V17.7152C9.34391 16.9381 9.97587 16.3067 10.7586 16.3018H13.6328C14.4191 16.3018 15.0565 16.9346 15.0565 17.7152V20.7732C15.0564 21.4473 15.6042 21.9951 16.2831 22H18.244C19.1598 22.0023 20.0389 21.6428 20.6874 21.0007C21.3358 20.3586 21.7002 19.4868 21.7002 18.5775V9.86585C21.7002 9.13139 21.3723 8.43471 20.8048 7.9635L14.1432 2.67427C12.9787 1.74912 11.3156 1.77901 10.1856 2.74538L3.66721 7.9635C3.07294 8.42082 2.71775 9.11956 2.7002 9.86585V18.5686C2.7002 20.4637 4.24758 22 6.15637 22H8.07249C8.39937 22.0023 8.71368 21.8751 8.94567 21.6464C9.17765 21.4178 9.30812 21.1067 9.30811 20.7821H9.34393Z"
    //     fill={checkColor(0)}
    //   />
    // </svg>
  );
  const exploreSvg = (
    <img className={styles.buttonIcon} style={{filter: checkColor(1)}} src={'/ui/Icons/Bold/Search.svg'} />

    // <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
    //   <circle cx="12.5667" cy="11.7666" r="8.98856" fill={checkColor(1)} />
    //   <path
    //     d="M18.8184 18.4851L22.3424 22"
    //     stroke={checkColor(1)}
    //     strokeWidth="1.5"
    //     strokeLinecap="round"
    //     strokeLinejoin="round"
    //   />
    // </svg>
  );

  const Add_Button = (
    <img className={styles.buttonIcon} src={'/ui/Icons/Line/Add_Button.svg'} />
    // <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
    //   <path
    //     fillRule="evenodd"
    //     clipRule="evenodd"
    //     d="M7.15039 4.5C7.15039 3.5335 7.93389 2.75 8.90039 2.75H8.98062C9.78887 2.75 10.5014 3.28016 10.7337 4.05432L11.3924 6.25H8.90039C7.93389 6.25 7.15039 5.4665 7.15039 4.5ZM6.1613 6.25C5.83789 5.74485 5.65039 5.14432 5.65039 4.5C5.65039 2.70507 7.10547 1.25 8.90039 1.25H8.98062C10.4513 1.25 11.7478 2.21466 12.1704 3.6233L12.4004 4.38992L12.6304 3.6233C13.053 2.21466 14.3495 1.25 15.8202 1.25H15.9004C17.6953 1.25 19.1504 2.70507 19.1504 4.5C19.1504 5.14432 18.9629 5.74485 18.6395 6.25H20.9004C22.143 6.25 23.1504 7.25736 23.1504 8.5C23.1504 9.74264 22.143 10.75 20.9004 10.75H3.90039C2.65775 10.75 1.65039 9.74264 1.65039 8.5C1.65039 7.25736 2.65775 6.25 3.90039 6.25H6.1613ZM15.9004 6.25C16.8669 6.25 17.6504 5.4665 17.6504 4.5C17.6504 3.5335 16.8669 2.75 15.9004 2.75H15.8202C15.0119 2.75 14.2994 3.28016 14.0671 4.05432L13.4084 6.25H15.9004ZM11.6499 12.7282C11.6504 12.7391 11.6504 12.752 11.6504 12.7778V16.25C11.6504 16.6642 11.9862 17 12.4004 17C12.8146 17 13.1504 16.6642 13.1504 16.25V12.7778C13.1504 12.752 13.1504 12.7391 13.1509 12.7282C13.1622 12.4692 13.3696 12.2618 13.6286 12.2505C13.6395 12.25 13.6524 12.25 13.6782 12.25H20.3504C20.6304 12.25 20.7704 12.25 20.8774 12.3045C20.9715 12.3524 21.048 12.4289 21.0959 12.523C21.1504 12.63 21.1504 12.77 21.1504 13.05V16.35C21.1504 18.5902 21.1504 19.7103 20.7144 20.566C20.3309 21.3186 19.719 21.9305 18.9664 22.314C18.1107 22.75 16.9906 22.75 14.7504 22.75H10.0504C7.81018 22.75 6.69008 22.75 5.83443 22.314C5.08178 21.9305 4.46986 21.3186 4.08636 20.566C3.65039 19.7103 3.65039 18.5902 3.65039 16.35V13.05C3.65039 12.77 3.65039 12.63 3.70489 12.523C3.75282 12.4289 3.82931 12.3524 3.9234 12.3045C4.03035 12.25 4.17036 12.25 4.45039 12.25H11.1226C11.1484 12.25 11.1613 12.25 11.1722 12.2505C11.4312 12.2618 11.6386 12.4692 11.6499 12.7282Z"
    //     fill={checkColor(2)}
    //   />
    // </svg>
  );

  const contentSvg = (
    <img className={styles.buttonIcon} style={{filter: checkColor(3)}} src={'/ui/Icons/Bold/Chat_Round_Dots.svg'} />

    // <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
    //   <path
    //     fillRule="evenodd"
    //     clipRule="evenodd"
    //     d="M5 8C3.89543 8 3 9.04467 3 10.3333V19.6667C3 20.9553 3.89543 22 5 22H19C20.1046 22 21 20.9553 21 19.6667V10.3333C21 9.04467 20.1046 8 19 8H5Z"
    //     fill={checkColor(3)}
    //   />
    //   <rect x="5" y="5" width="14" height="2" rx="1" fill={checkColor(3)} />
    //   <rect x="7" y="2" width="10" height="2" rx="1" fill={checkColor(3)} />
    // </svg>
  );

  const profileSvg = (
    <img className={styles.buttonIcon} style={{filter: checkColor(4)}} src={'/ui/Icons/Bold/Profile.svg'} />

    // <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
    //   <path
    //     fillRule="evenodd"
    //     clipRule="evenodd"
    //     d="M12.5967 12.5838C15.5347 12.5838 17.8887 10.2288 17.8887 7.29176C17.8887 4.35476 15.5347 1.99976 12.5967 1.99976C9.65969 1.99976 7.30469 4.35476 7.30469 7.29176C7.30469 10.2288 9.65969 12.5838 12.5967 12.5838Z"
    //     fill={checkColor(4)}
    //   />
    //   <path
    //     fillRule="evenodd"
    //     clipRule="evenodd"
    //     d="M12.5971 15.1746C8.2841 15.1746 4.6001 15.8546 4.6001 18.5746C4.6001 21.2956 8.2611 21.9996 12.5971 21.9996C16.9101 21.9996 20.5941 21.3206 20.5941 18.5996C20.5941 15.8786 16.9341 15.1746 12.5971 15.1746Z"
    //     fill={checkColor(4)}
    //   />
    // </svg>
  );
  //#endregion

  const buttonData = [
    {label: 'Home', icon: homeSvg, link: '/main/homefeed'},
    {label: 'Explore', icon: exploreSvg, link: '/main/explore'},
    {label: 'Plus', icon: Add_Button, link: '/main/plus'},
    {label: 'Content', icon: contentSvg, link: '/main/message'},
    {label: 'My', icon: profileSvg, link: '/profile'},
  ];

  React.useEffect(() => {
    const currentPath = window.location.pathname; // 현재 경로 가져오기
    const foundIndex = buttonData.findIndex(button => currentPath.includes(button.link) && button.link != '');
    if (foundIndex !== -1 && foundIndex !== selectedIndex) {
      dispatch(setSelectedIndex(foundIndex));
    }
  }, []);

  React.useEffect(() => {}, [colorMode]);

  return (
    <footer>
      <div className={` ${styles.bottomNav} ${colorMode === 1 ? styles['light-mode'] : styles['light-mode']}`}>
        {/* 다크모드 화이트 모드로 변경 */}
        <div className={styles.bottomNavBox}>
          {buttonData.map((button, index) => {
            const isMy = button.label == 'My';
            const isPlus = button.label == 'Plus';
            if (!isMy && !isPlus) {
              return (
                <Link
                  key={index}
                  href={getLocalizedLink(button.link)}
                  onClick={index !== buttonData.length - 1 ? () => handleClick(index) : undefined}
                  onMouseDown={index === buttonData.length - 1 ? handleLongPressStart : undefined}
                  onMouseUp={index === buttonData.length - 1 ? handleLongPressEnd : undefined}
                  onMouseLeave={index === buttonData.length - 1 ? handleLongPressEnd : undefined}
                  // 모바일 대응
                  onTouchStart={index === buttonData.length - 1 ? handleLongPressStart : undefined}
                  onTouchEnd={index === buttonData.length - 1 ? handleLongPressEnd : undefined}
                  onTouchCancel={index === buttonData.length - 1 ? handleLongPressEnd : undefined}
                >
                  <button
                    className={`${styles.navButton} 
                    ${selectedIndex === index ? styles.selected : ''} 
                    ${selectedIndex === index && colorMode === 0 ? styles['light-mode'] : ''}`}
                  >
                    {/* 다크모드 화이트 모드로 변경 */}
                    {button.icon}
                  </button>
                </Link>
              );
            } else if (isMy) {
              return (
                <div
                  key={index}
                  className={`${styles.navButton} 
                        ${selectedIndex === index ? styles.selected : ''} 
                        ${selectedIndex === index && colorMode === 0 ? '' : ''}`}
                >
                  <UserDropdown />
                </div>
              );
            } else if (isPlus) {
              return (
                <button
                  key={index}
                  className={`${styles.navButton}  `}
                  onClick={async () => {
                    const isLogin = await isLogined();
                    if (isLogin) {
                      dispatch(setSkipStoryInit(false));
                      toggleDrawer(!drawerOpen);
                    } else {
                      const urlLogin = getLocalizedLink('/auth');
                      router.push(urlLogin);
                    }
                  }}
                >
                  <div className={styles.navButtonPlusWrap}>
                    <img className={styles.buttonIconPlus} src={LinePlus.src} />
                  </div>
                </button>
              );
            }
          })}
        </div>
        <CreateWidget open={drawerOpen} onClose={() => toggleDrawer(false)} />
        <SelectProfileWidget
          open={profileDrawerOpen}
          onClose={() => toggleProfileDrawer(false)}
          profiles={profileData}
          isEditing={true}
        />
      </div>
    </footer>
  );
}
