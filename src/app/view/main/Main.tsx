'use client';

import React, {ReactNode, useEffect} from 'react';

import HeaderNavBar from '@/app/view/main/header/header-nav-bar/HeaderNavBar';
import BottomNav from '@/app/view/main/bottom-nav/BottomNav';
import DrawerContentDesc from '@/app/view/main/content/storyDesc/DrawerStoryDesc';
import styles from './Main.module.css';
import DrawerCharacterDesc from './content/storyDesc/DrawerCharacterDesc';
import {setBottomNavColor, setSelectedIndex} from '@/redux-store/slices/MainControl';
import {useSelector} from 'react-redux';
import {RootState} from '@/redux-store/ReduxStore';
import HeaderNavBarWhite from './content/myContents/HeaderNavBarWhite';
import {useRouter} from 'next/router';

const Main = ({children}: {children: ReactNode}) => {
  const selectedIndex = useSelector((state: RootState) => state.mainControl.selectedIndex);

  useEffect(() => {}, [selectedIndex]);
  return (
    <div className={styles.body}>
      {(selectedIndex == 0 || selectedIndex == 1) && <HeaderNavBar />}
      {/* 2번은 Shop로 접근 시 헤더를 가려야 해서 예외 적으로 페이지에 직접 Header를 넣음 */}
      {(selectedIndex == 0 || selectedIndex == 1 || selectedIndex == 2) && <div></div>}

      {children}
      <BottomNav />
      <DrawerContentDesc />
      {/* <DrawerCharacterDesc /> */}
    </div>
  );
};

export default Main;
