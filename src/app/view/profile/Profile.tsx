'use client';

import React, {ReactNode} from 'react';

import styles from './Profile.module.css';
import BottomNav from '../main/bottom-nav/BottomNav';

const Profile = ({children}: {children: ReactNode}) => {
  return (
    <div className={styles.body}>
      {children}
      <BottomNav />
    </div>
  );
};

export default Profile;
