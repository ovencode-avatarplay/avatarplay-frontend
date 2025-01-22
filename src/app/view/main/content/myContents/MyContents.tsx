import React from 'react';
import MyContentTabView from './MyContentView';
import ComponentTesting from '@/components/layout/shared/ComponentTesting';

const MyContents: React.FC = () => {
  return (
    <main>
      MY CONTENTS
      {/* <MyContentTabView /> */}
      <ComponentTesting />
    </main>
  );
};

export default MyContents;
