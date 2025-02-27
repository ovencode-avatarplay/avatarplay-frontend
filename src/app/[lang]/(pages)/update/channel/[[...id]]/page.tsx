import CreateChannel from '../../../create/channel/page';

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
      <CreateChannel id={id} isUpdate={true}></CreateChannel>
    </>
  );
};

export default page;
