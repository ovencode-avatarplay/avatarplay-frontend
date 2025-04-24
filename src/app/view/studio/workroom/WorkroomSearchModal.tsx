import CreateDrawerHeader from '@/components/create/CreateDrawerHeader';
import Dialog from '@mui/material/Dialog';

interface Props {
  open: boolean;
  onClose: () => void;
}

const WorkroomSearchModal = ({open, onClose}: Props) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 'calc(100%)',
          maxWidth: '1300px',

          height: '100%',
          maxHeight: '100%',

          margin: '0 auto',
          borderRadius: '0px',
        },
      }}
    >
      <CreateDrawerHeader title="Search" onClose={onClose}>
        <div>search</div>
      </CreateDrawerHeader>
      <div></div>
    </Dialog>
  );
};

export default WorkroomSearchModal;
