import React, {useEffect, useState} from 'react';
import {Box, Typography, Slider, Button} from '@mui/material';
import CurrencyIcon from '@mui/icons-material/AttachMoney';
import styles from './CharacterGalleryCreate.module.css';
import {Swiper, SwiperSlide} from 'swiper/react';
import {CharacterInfo} from '@/redux-store/slices/EpisodeInfo';
import {GalleryCategory, galleryCategoryText} from './CharacterGalleryData';

interface CategoryCreateProps {
  open: boolean;
  onClose: () => void;
  category: GalleryCategory;
  characterInfo: CharacterInfo;
}

const CharacterGalleryCreate: React.FC<CategoryCreateProps> = ({open, onClose, category, characterInfo}) => {
  const [creationAmount, setCreationAmount] = useState(1);
  const [imageQuality, setImageQuality] = useState(1);

  const handleAmountChange = (_: any, value: number | number[]) => {
    setCreationAmount(value as number);
  };

  const handleQualityChange = (_: any, value: number | number[]) => {
    setImageQuality(value as number);
  };

  const handleClose = () => {
    onClose();
  };
  const handleGenerate = () => {
    const generationData = {
      mainImageUrl: characterInfo.mainImageUrl,
      category: category,
      selectedImage: selectedItemIndex,
      creationAmount: creationAmount,
      imageQuality: imageQuality,
    };

    console.log('Generation Data:', generationData);
  };
  const [selectedItemIndex, setSelectedItemIndex] = useState<number>(0);
  const poseImages = [
    '/images/real.png',
    '/images/real.png',
    '/images/real.png',
    '/images/real.png',
    '/images/real.png',
    '/images/real.png',
  ];

  const ExpressionImages = [
    '/images/001.png',
    '/images/001.png',
    '/images/001.png',
    '/images/001.png',
    '/images/001.png',
    '/images/001.png',
  ];
  const [selectionImages, setSelectionImages] = useState(poseImages);

  useEffect(() => {
    if (category === GalleryCategory.Pose) setSelectionImages(poseImages);
    else if (category === GalleryCategory.Expression) setSelectionImages(ExpressionImages);
    else {
      console.log('Err');
    }
  }, [category]);

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
    <Box className={styles.container}>
      {/* Base Portrait */}
      <Box className={styles.basePortrait}>
        <Box
          sx={{
            width: '180px',
            height: '240px',
            backgroundImage: `url(${characterInfo.mainImageUrl})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            borderRadius: '8px',
          }}
        />
        <Typography variant="subtitle1">Base Portrait</Typography>
        <Button variant="outlined" className={styles.changeButton}>
          Change
        </Button>
      </Box>

      {/* Swiper Section */}
      <Box className={styles.swiperSection}>
        <Typography variant="subtitle1">Select {galleryCategoryText[category]}</Typography>
        <Swiper
          spaceBetween={10}
          slidesPerView={3}
          centeredSlides={true} // 중앙 정렬 활성화
          onSlideChange={swiper => setSelectedItemIndex(swiper.activeIndex)} // 슬라이드 변경 시 활성화된 인덱스 업데이트
          onSwiper={swiper => setSelectedItemIndex(swiper.activeIndex)} // Swiper 초기화 시 활성화된 인덱스 설정
          className={styles.swiper}
        >
          {selectionImages.map((url, index) => (
            <SwiperSlide key={index}>
              <Box
                sx={{
                  width: '100%',
                  height: '100px',
                  backgroundImage: `url(${url})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  borderRadius: '8px',
                  border: selectedItemIndex === index ? '8px solid blue' : 'none', // 선택된 아이템에 파란색 테두리 추가
                  transition: 'border 0.3s ease', // 테두리 애니메이션 추가
                }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </Box>

      {/* Creation Amount Slider */}

      <Typography variant="subtitle1">Creation Amount</Typography>
      <Box className={styles.sliderbox}>
        <Slider value={creationAmount} onChange={handleAmountChange} sx={{width: '70%'}} min={1} max={4} step={1} />
        <Typography align="right">{creationAmount}</Typography>
      </Box>

      {/* Image Quality Slider */}
      <Typography variant="subtitle1">Image Quality</Typography>
      <Box className={styles.sliderbox}>
        <Slider
          className={styles.slider}
          value={imageQuality}
          onChange={handleQualityChange}
          sx={{width: '70%'}}
          min={1}
          max={3}
          step={1}
        />
        <Typography align="right">{imageQuality === 1 ? 'Low' : imageQuality === 2 ? 'Medium' : 'High'}</Typography>
      </Box>

      {/* Generate Button */}
      <Box className={styles.generateSection}>
        <Button variant="contained" color="primary" fullWidth onClick={handleGenerate}>
          Generate
          <Box className={styles.currency}>
            <CurrencyIcon />
            <Typography>50</Typography>
          </Box>
        </Button>
      </Box>
    </Box>
  );
};

export default CharacterGalleryCreate;
