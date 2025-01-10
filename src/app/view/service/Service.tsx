'use client';

import React, {ReactNode} from 'react';

import styles from './service.module.css';
import {Analysis} from './analysis/Analysis';

const Service = () => {
  return (
    <div className={styles.body}>
      <Analysis />
    </div>
  );
};

export default Service;
