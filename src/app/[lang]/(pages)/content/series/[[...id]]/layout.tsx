import {Metadata} from 'next';
import React from 'react';

type Props = {
  children: React.ReactNode;
};

export const metadata: Metadata = {
  title: 'Talkain',
  description: 'content series',
  icons: '/images/Talkain_icon_256_green.png',
};

const layout = (props: Props) => {
  return <>{props.children}</>;
};

export default layout;
