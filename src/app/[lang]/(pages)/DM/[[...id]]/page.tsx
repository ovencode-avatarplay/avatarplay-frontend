'use client';

import Chat from '@/app/view/main/content/myContents/04_Chat/Chat';

type Props = {
  params: {
    id?: string[];
  };
};

const page = ({params}: Props) => {
  console.log('paramsid', params?.id);
  const id = params?.id?.[0] || '0';
  console.log('id', id);

  return <Chat urlLinkKey={id}></Chat>;
};

export default page;
