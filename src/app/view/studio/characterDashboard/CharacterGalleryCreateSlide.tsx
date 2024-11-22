import React, {useEffect, useState} from 'react';
import {Box, Typography, Slider, TextField, Button, Slide} from '@mui/material';
import CurrencyIcon from '@mui/icons-material/AttachMoney';
import styles from './CharacterGalleryCreateSlide.module.css';
import {Swiper, SwiperSlide} from 'swiper/react';

interface CategoryCreateSlideProps {
  open: boolean;
  onClose: () => void;
  category: string;
}

const CharacterGalleryCreateSlide: React.FC<CategoryCreateSlideProps> = ({open, category}) => {
  const [creationAmount, setCreationAmount] = useState(1);
  const [imageQuality, setImageQuality] = useState(1);

  const handleAmountChange = (_: any, value: number | number[]) => {
    setCreationAmount(value as number);
  };

  const handleQualityChange = (_: any, value: number | number[]) => {
    setImageQuality(value as number);
  };

  const sampleImages = [
    'https://via.placeholder.com/100',
    'https://via.placeholder.com/100',
    'https://via.placeholder.com/100',
    'https://via.placeholder.com/100',
    'https://via.placeholder.com/100',
    'https://via.placeholder.com/100',
    'https://via.placeholder.com/100',
    'https://via.placeholder.com/100',
    'https://via.placeholder.com/100',
    'https://via.placeholder.com/100',
    'https://via.placeholder.com/100',
    'https://via.placeholder.com/100',
    'https://via.placeholder.com/100',
    'https://via.placeholder.com/100',
    'https://via.placeholder.com/100',
  ];

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    // Cleanup on component unmount
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <Slide direction="left" in={open} mountOnEnter unmountOnExit>
      <Box className={styles.container}>
        {/* Base Portrait */}
        <Box className={styles.basePortrait}>
          <img src="https://via.placeholder.com/100" alt="Base Portrait" className={styles.portraitImage} />
          <Typography variant="subtitle1">Base {category}</Typography>
          <Button variant="outlined" className={styles.changeButton}>
            Change
          </Button>
        </Box>

        {/* Swiper Section */}
        <Box className={styles.swiperSection}>
          <Typography variant="subtitle1">Select Base {category}</Typography>
          <Swiper spaceBetween={10} slidesPerView={3} className={styles.swiper}>
            {sampleImages.map((url, index) => (
              <SwiperSlide key={index}>
                <img src={url} alt={`Slide ${index}`} className={styles.swiperImage} />
              </SwiperSlide>
            ))}
          </Swiper>
        </Box>

        {/* Creation Amount Slider */}
        <Box className={styles.slider}>
          <Typography variant="subtitle1">Creation Amount</Typography>
          <Slider value={creationAmount} onChange={handleAmountChange} min={1} max={4} step={1} />
          <Typography align="right">{creationAmount}</Typography>
        </Box>

        {/* Image Quality Slider */}
        <Box className={styles.slider}>
          <Typography variant="subtitle1">Image Quality</Typography>
          <Slider
            value={imageQuality}
            onChange={handleQualityChange}
            min={1}
            max={3}
            step={1}
            marks={[
              {value: 1, label: 'Low'},
              {value: 2, label: 'Medium'},
              {value: 3, label: 'High'},
            ]}
          />
          <Typography align="right">{imageQuality === 1 ? 'Low' : imageQuality === 2 ? 'Medium' : 'High'}</Typography>
        </Box>

        {/* Generate Button */}
        <Box className={styles.generateSection}>
          <Button variant="contained" color="primary" fullWidth>
            Generate
            <Box className={styles.currency}>
              <CurrencyIcon />
              <Typography>50</Typography>
            </Box>
          </Button>
        </Box>
      </Box>
    </Slide>
  );
};

export default CharacterGalleryCreateSlide;
