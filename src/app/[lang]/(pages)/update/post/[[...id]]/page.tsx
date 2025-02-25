import PostMain from '@/app/view/main/content/create/post/PostMain';

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
      <PostMain id={id} isUpdate={true}></PostMain>
    </>
  );
};

export default page;
