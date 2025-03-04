'use client';

import CreateSingleContent from '@/app/view/main/content/create/content/CreateSingleContent';
import SeriesDetail from '@/app/view/main/content/create/content/SeriesDetail';
import SingleDetail from '@/app/view/main/content/create/content/SingleDetail';

type Props = {
  params: {
    id?: string[];
  };
};

const page = ({params}: Props) => {
  console.log('paramsid', params?.id);
  const id = parseInt(params?.id?.[0] || '0');
  console.log('id', id);

  return (
    <>{params?.id == undefined ? <CreateSingleContent></CreateSingleContent> : <SingleDetail id={id}></SingleDetail>}</>
  );
};

export default page;
