import SeriesDetail from '@/app/view/main/content/create/content/SeriesDetail';
import SingleDetail from '@/app/view/main/content/create/content/SingleDetail';

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
      <SingleDetail id={id}></SingleDetail>
    </>
  );
};

export default page;
