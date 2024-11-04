import React from 'react';
import Style from './MyContents.module.css';
import MyContentTabView from './MyContentView';

const MyContents: React.FC = () => {
  return (
    <main className={Style.myContents}>
      MY CONTENTS
      {/* <MyContentTabView /> */}
    </main>
  );
};

export default MyContents;
