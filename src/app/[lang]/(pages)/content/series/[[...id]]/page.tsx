import Series from '@/app/view/main/content/contents/series/ContentSeriesDetail';
import React from 'react';

type Props = {
  params: {
    id?: string[];
  };
};

const page = ({params}: Props) => {
  const id = params?.id?.[0] ?? '0';
  return (
    <>
      <Series id={id} />
    </>
  );
};

export default page;
