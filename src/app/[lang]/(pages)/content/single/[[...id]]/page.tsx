import {ContentType} from '@/app/NetWork/ContentNetwork';
import ContentSeriesDetail from '@/app/view/main/content/contents/series/ContentSeriesDetail';
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
      <ContentSeriesDetail id={id} type={ContentType.Single} />
    </>
  );
};

export default page;
