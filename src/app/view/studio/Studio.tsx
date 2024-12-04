'use client';

import React, {ReactNode} from 'react';

import HeaderNavBar from '@/app/view/main/header/header-nav-bar/HeaderNavBar';
import styles from './Studio.module.css';
import StudioTopMenu from './StudioTopMenu';

const Studio = ({children}: {children: ReactNode}) => {
  return (
    <div className={styles.body}>
      <HeaderNavBar />
      {children}
    </div>
  );
};

export default Studio;
