import CreateDrawerHeader from '@/components/create/CreateDrawerHeader';
import {Drawer} from '@mui/material';
import React, {useEffect, useState} from 'react';
import {useRouter} from 'next/navigation';

interface Props {
  open: boolean;
  onClose: () => void;
}

const EpisodeInitialize: React.FC<Props> = ({open, onClose}) => {
  const router = useRouter();

  const [isInitFinished, setIsInitFinished] = useState<boolean>(false);

  const handlerOnCompleteInit = () => {
    setIsInitFinished(true);
  };

  const handlerOnClose = () => {
    if (isInitFinished) {
      onClose();
    } else {
      router.back();
    }
  };

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {width: '100vw', height: '100vh', maxWidth: '500px', margin: '0 auto'},
      }}
    >
      <CreateDrawerHeader title="EpisodeInitial" onClose={handlerOnClose} />
      EpisodeInitial
      <button onClick={handlerOnCompleteInit}> Init </button>
      isInit : {isInitFinished ? 'Complete' : 'False'}
    </Drawer>
  );
};

export default EpisodeInitialize;
