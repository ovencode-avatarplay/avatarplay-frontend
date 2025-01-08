'use client';

import React, {ReactNode} from 'react';

import styles from './service.module.css';
import {Analysis} from './analysis/analysis';

const Service = () => {
  return (
    <div className={styles.body}>
      <Analysis />
    </div>
  );
};

export default Service;
