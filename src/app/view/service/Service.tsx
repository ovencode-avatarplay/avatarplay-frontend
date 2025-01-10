'use client';

import React, {ReactNode} from 'react';

import styles from './service.module.css';
import {Analysis} from './analysis/Analysis';

const ServiceMain = ({children}: {children: ReactNode}) => {
  return (
    <div className={styles.body}>
      {children}
      <Analysis />
    </div>
  );
};

export default ServiceMain;
