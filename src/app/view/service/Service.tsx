'use client';

import React, {ReactNode} from 'react';

import styles from './Service.module.css';
import {Analysis} from './analysis/Analysis';

const ServiceMain = ({children}: {children: ReactNode}) => {
  return (
    <div className={styles.body}>
      <Analysis />
    </div>
  );
};

export default ServiceMain;
