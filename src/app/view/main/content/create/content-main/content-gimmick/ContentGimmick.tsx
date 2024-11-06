// PlaceHolder

import CreateDrawerHeader from '@/components/create/CreateDrawerHeader';
import {Box, Drawer} from '@mui/material';
import React from 'react';
import styles from './ContentGimmick.module.css';

interface Props {
  open: boolean;
  onClose: () => void;
}

const ContentGimmick: React.FC<Props> = ({open, onClose}) => {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {width: '100vw', height: '100vh'},
      }}
    >
      <Box className={styles.drawerContainer}>
        <CreateDrawerHeader title="Gimmick" onClose={onClose} />
      </Box>
      <div>ContentGimmick</div>
    </Drawer>
  );
};

export default ContentGimmick;
