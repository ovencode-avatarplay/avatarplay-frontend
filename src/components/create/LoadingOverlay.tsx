import React from 'react';
import {CircularProgress, Box, Backdrop} from '@mui/material';

interface LoadingOverlayProps {
  loading: boolean;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({loading}) => {
  return (
    <Backdrop open={loading} sx={{zIndex: theme => theme.zIndex.modal + 1}}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <CircularProgress />
      </Box>
    </Backdrop>
  );
};

export default LoadingOverlay;