import React from 'react';
import {Button, Typography, Box} from '@mui/material';
import styles from './CharacterCreateImageButton.module.css';

interface ImageButtonProps {
  width: string;
  height: string;
  label: string;
  image: string;
  selected: boolean;
  onClick: () => void;
}

const CharacterCreateImageButton: React.FC<ImageButtonProps> = ({width, height, label, image, selected, onClick}) => {
  return (
    <Button
      onClick={onClick}
      className={styles.imageButton}
      sx={{
        position: 'relative',
        width: width,
        height: height,
        padding: 0,
        border: `4px solid ${selected ? 'blue' : 'red'}`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        overflow: 'hidden',
        backgroundColor: 'transparent',
        transition: 'border-color 0.3s',
        '&:hover': {
          borderColor: selected ? 'darkblue' : 'gray',
        },
      }}
    >
      <Box
        sx={{
          flexGrow: 1,
          backgroundImage: `url(${image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          width: '100%',
        }}
      />
      <Box
        sx={{
          position: 'absolute',
          bottom: 8,
          left: '50%',
          transform: 'translateX(-50%)',
          fontWeight: 'bold',
          color: 'white',
          backgroundColor: 'rgba(255, 255, 255, 0.6)',
          padding: '4px 8px',
          borderRadius: '4px',
          width: '80%',
          height: 30,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: `4px solid ${selected ? 'blue' : 'red'}`,
        }}
      >
        <Typography variant="subtitle1" sx={{fontWeight: 'bold', color: 'black'}}>
          {label}
        </Typography>
      </Box>
    </Button>
  );
};

export default CharacterCreateImageButton;
