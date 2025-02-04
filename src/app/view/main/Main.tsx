'use client';

import React, {ReactNode} from 'react';

import HeaderNavBar from '@/app/view/main/header/header-nav-bar/HeaderNavBar';
import BottomNav from '@/app/view/main/bottom-nav/BottomNav';
import DrawerContentDesc from '@/app/view/main/content/ContentDesc/DrawerContentDesc';
import styles from './Main.module.css';
import DrawerCharacterDesc from './content/ContentDesc/DrawerCharacterDesc';
import {setBottomNavColor, setSelectedIndex} from '@/redux-store/slices/MainControl';
import {useSelector} from 'react-redux';
import {RootState} from '@/redux-store/ReduxStore';
import HeaderNavBarWhite from './header/header-nav-bar/HeaderNavBarWhite';

const Main = ({children}: {children: ReactNode}) => {
  const selectedIndex = useSelector((state: RootState) => state.mainControl.selectedIndex);
  console.log('selectedIndex', selectedIndex);

  return (
    <div className={styles.body}>
      {selectedIndex != 2 && <HeaderNavBar />}
      {selectedIndex == 2 && <HeaderNavBarWhite />}

      {children}
      <BottomNav />
      <DrawerContentDesc />
      <DrawerCharacterDesc />
    </div>
  );
};

export default Main;
