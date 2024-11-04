import React from 'react';
import Style from './MyContents.module.css';
import MyContentTabView from './MyContentView';

const MyContents: React.FC = () => {
  return (
    <main className={Style.myContents}>
      <MyContentTabView />
    </main>
  );
};

export default MyContents;
