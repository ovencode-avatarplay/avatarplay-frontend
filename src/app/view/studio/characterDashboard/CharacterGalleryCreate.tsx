import React, {useEffect, useState} from 'react';
import {Box, Typography, Button} from '@mui/material';
import CurrencyIcon from '@mui/icons-material/AttachMoney';
import styles from './CharacterGalleryCreate.module.css';
import {Swiper, SwiperSlide} from 'swiper/react';
import {GalleryCategory, galleryCategoryText} from './CharacterGalleryData';
import {CharacterInfo} from '@/redux-store/slices/ContentInfo';
import CustomButton from '@/components/layout/shared/CustomButton';
import {BoldRuby, LineCheck} from '@ui/Icons';

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
    <div className={styles.container}>
      <div className={styles.editArea}>
        <div className={styles.basePortraitArea}>
          <h2 className={styles.title}>Base Portrait</h2>
          <div className={styles.basePortraitItem}>
            <div
              className={styles.portraitImage}
              style={{
                backgroundImage: `url(${characterInfo.mainImageUrl})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            />
            <CustomButton size="Small" type="Tertiary" state="Normal">
              Change
            </CustomButton>
          </div>
        </div>

        {/* Swiper Section */}
        <div className={styles.swiperSection}>
          <h2 className={styles.title}>Select {galleryCategoryText[category]}</h2>
          <Swiper
            spaceBetween={6}
            slidesPerView="auto"
            centeredSlides={true}
            onSlideChange={swiper => setSelectedItemIndex(swiper.activeIndex)} // 슬라이드 변경 시 활성화된 인덱스 업데이트
            onSwiper={swiper => setSelectedItemIndex(swiper.activeIndex)} // Swiper 초기화 시 활성화된 인덱스 설정
            className={styles.swiper}
          >
            {selectionImages.map((url, index) => (
              <SwiperSlide
                key={index}
                style={{
                  width: '138px',
                }}
              >
                <div
                  className={`${styles.swiperItem}  ${selectedItemIndex === index ? styles.selected : ''}`}
                  style={{
                    backgroundImage:
                      selectedItemIndex === index
                        ? `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${url})`
                        : `url(${url})`,
                  }}
                >
                  <img className={styles.checkIcon} src={LineCheck.src} />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
      <div className={styles.generateSection}>
        <CustomButton
          size="Large"
          state="Normal"
          type="Primary"
          onClick={handleGenerate}
          customClassName={[styles.generateButton]}
        >
          Generate
          <div className={styles.currency}>
            <img src={BoldRuby.src} />
            <Typography>50</Typography>
          </div>
        </CustomButton>
      </div>
    </div>
  );
};

export default CharacterGalleryCreate;
