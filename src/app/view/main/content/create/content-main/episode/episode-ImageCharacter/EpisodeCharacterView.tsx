import React, {useEffect, useState} from 'react';
import {Box, Typography, Slider, Button} from '@mui/material';
import CurrencyIcon from '@mui/icons-material/AttachMoney';
import styles from './EpisodeCharacterView.module.css';
import {Swiper, SwiperSlide} from 'swiper/react';
import {CharacterInfo} from '@/redux-store/slices/EpisodeInfo';
interface EpisodeCharacterViewProps {
  open: boolean;
  onClose: () => void;
  characterInfo: CharacterInfo;
  imageUrl: string;
  onChange: () => void;
}

const EpisodeCharacterView: React.FC<EpisodeCharacterViewProps> = ({
  imageUrl,
  open,
  onChange,
  onClose,
  characterInfo,
}) => {
  const handleClose = () => {
    onClose();
  };

  return (
    <Box className={styles.container}>
      {/* Base Portrait */}
      <Box className={styles.basePortrait}>
        <Box
          sx={{
            width: '300px',
            height: '300px',
            backgroundImage: `url(${imageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: '8px',
          }}
        />
        <Typography variant="subtitle1">Base Portrait</Typography>
        <Button
          variant="outlined"
          className={styles.changeButton}
          onClick={onChange} // Change 버튼 클릭 시 Step 2로 돌아가기
        >
          Change
        </Button>
      </Box>

      <Box className={styles.swiperSection}>
        <Typography variant="subtitle1">Select </Typography>
        <Typography variant="body1">{characterInfo.name}</Typography>
      </Box>

      <Box className={styles.swiperSection}>
        <Typography variant="subtitle1">Select </Typography>
        <Typography variant="body1">{characterInfo.introduction} </Typography>
      </Box>
    </Box>
  );
};

export default EpisodeCharacterView;
