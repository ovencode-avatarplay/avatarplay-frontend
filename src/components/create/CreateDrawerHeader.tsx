import React from 'react';
import {Box, IconButton, Typography} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import styles from './CreateDrawerHeader.module.css';

interface Props {
  title: string;
  onClose: () => void;
}

const CreateDrawerHeader: React.FC<Props> = ({title, onClose}) => {
  return (
    <Box className={styles.header}>
      <IconButton onClick={onClose}>
        <ArrowBackIcon />
      </IconButton>
      <Typography variant="h6">{title}</Typography>
    </Box>
  );
};

export default CreateDrawerHeader;
