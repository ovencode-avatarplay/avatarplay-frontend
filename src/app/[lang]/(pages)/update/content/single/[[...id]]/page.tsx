'use client';
import CreateSeriesContent from '@/app/view/main/content/create/content/CreateSeriesContent';
import CreateSingleContent from '@/app/view/main/content/create/content/CreateSingleContent';
import SeriesDetail from '@/app/view/main/content/create/content/SeriesDetail';

type Props = {
  params: {
    id?: string[];
  };
};

const page = ({params}: Props) => {
  const id = parseInt(params?.id?.[0] || '0');
  console.log('id', id);

  return (
    <>
      {' '}
      <CreateSingleContent id={id}></CreateSingleContent>
    </>
  );
};

export default page;
