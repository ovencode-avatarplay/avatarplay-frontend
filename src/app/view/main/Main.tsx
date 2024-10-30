'use client';

import React, {ReactNode, useEffect} from 'react';

import HeaderNavBar from '@/app/view/main/header/header-nav-bar/HeaderNavBar';
import BottomNav from '@/app/view/main/bottom-nav/BottomNav';
import DrawerContentDesc from '@/app/view/main/content/ContentDesc/DrawerContentDesc';
import {Provider} from 'react-redux';
import {store} from '@/redux-store/ReduxStore';
import Style from './Main.module.css';

const Main = ({children}: {children: ReactNode}) => {
  // 서비스 워커 등록
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then(registration => {
          console.log('Service Worker registered with scope:', registration.scope);
        })
        .catch(error => {
          console.error('Service Worker registration failed:', error);
        });
    }
  }, []);

  return (
    <Provider store={store}>
      <div className={Style.body}>
        <HeaderNavBar />
        {children}
        <BottomNav />
        <DrawerContentDesc />
      </div>
    </Provider>
  );
};

export default Main;
