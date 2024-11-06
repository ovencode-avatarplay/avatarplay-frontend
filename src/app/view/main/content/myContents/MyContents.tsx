import React from 'react';
import styles from './MyContents.module.css';
import MyContentTabView from './MyContentView';

const MyContents: React.FC = () => {
  return (
    <main className={styles.myContents}>
      MY CONTENTS
      {/* <MyContentTabView /> */}
    </main>
  );
};

export default MyContents;
