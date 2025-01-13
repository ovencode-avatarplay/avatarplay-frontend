import React from 'react';
import styles from './MyContents.module.css';
import MyContentTabView from './MyContentView';
import ComponentTesting from '@/components/layout/shared/ComponentTesting';

const MyContents: React.FC = () => {
  return (
    <main className={styles.myContents}>
      MY CONTENTS
      {/* <MyContentTabView /> */}
      <ComponentTesting />
    </main>
  );
};

export default MyContents;
