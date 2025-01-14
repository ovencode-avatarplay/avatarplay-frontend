'use client';

import React, {ReactNode} from 'react';

import HeaderNavBar from '@/app/view/main/header/header-nav-bar/HeaderNavBar';
import BottomNav from '@/app/view/main/bottom-nav/BottomNav';
import DrawerContentDesc from '@/app/view/main/content/ContentDesc/DrawerContentDesc';
import styles from './Main.module.css';

const Main = ({children}: {children: ReactNode}) => {
  return (
    <div className={styles.body}>
      <HeaderNavBar />
      {children}
      <BottomNav />
      <DrawerContentDesc />
    </div>
  );
};

export default Main;
