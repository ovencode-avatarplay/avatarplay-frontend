'use client';

import React, {ReactNode} from 'react';

import HeaderNavBar from '@/app/view/main/header/header-nav-bar/HeaderNavBar';
import {Provider} from 'react-redux';
import {store} from '@/redux-store/ReduxStore';
import styles from './Studio.module.css';
import StudioTopMenu from './StudioTopMenu';

const Studio = ({children}: {children: ReactNode}) => {
  return (
    <div className={styles.body}>
      <HeaderNavBar />
      <StudioTopMenu />
      {children}
    </div>
  );
};

export default Studio;