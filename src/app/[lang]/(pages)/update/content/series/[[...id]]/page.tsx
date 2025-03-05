'use client';
import CreateSeriesContent from '@/app/view/main/content/create/content/CreateSeriesContent';
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
      <CreateSeriesContent id={id}></CreateSeriesContent>
    </>
  );
};

export default page;
