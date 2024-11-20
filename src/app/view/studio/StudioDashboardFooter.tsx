import React from 'react';
import {Button, Typography} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import DeleteIcon from '@mui/icons-material/Delete';
import styles from './StudioDashboardFooter.module.css';

const StudioDashboardFooter: React.FC = () => {
  const buttons = [
    {icon: <EditIcon />, text: 'Edit'},
    {icon: <PhotoLibraryIcon />, text: 'Gallery'},
    {icon: <DeleteIcon />, text: 'Delete'},
  ];

  return (
    <div className={styles.footer}>
      {buttons.map((button, index) => (
        <Button key={index} className={styles.button} startIcon={button.icon}>
          <Typography>{button.text}</Typography>
        </Button>
      ))}
    </div>
  );
};

export default StudioDashboardFooter;
