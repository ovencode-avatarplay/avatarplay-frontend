import React, {useEffect, useState} from 'react';
import {Box, Typography, IconButton, Button, Paper} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShareIcon from '@mui/icons-material/Share';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import InfoIcon from '@mui/icons-material/Info';
import DeleteIcon from '@mui/icons-material/Delete';
import {Swiper, SwiperSlide} from 'swiper/react';
import 'swiper/css';
import styles from './CharacterGalleryViewer.module.css';
import {CharacterInfo, GalleryImageInfo} from '@/redux-store/slices/EpisodeInfo';
import {GalleryCategory, galleryCategoryText} from './CharacterGalleryData';
import {SelectImageReq, sendSelectImage} from '@/app/NetWork/CharacterNetwork';

interface CharacterGalleryViewerProps {
  characterInfo: CharacterInfo;
  selectedIndex: number | null;
  categoryType: GalleryCategory;
  onBack: () => void;
  onThumbnail: () => void;
  onInfo: () => void;
  onDelete: () => void;
  onSelectImage: (category: GalleryCategory, index: number) => void;
  onRefresh: () => void;
}

const CharacterGalleryViewer: React.FC<CharacterGalleryViewerProps> = ({
  characterInfo,
  selectedIndex,
  categoryType,
  onBack,
  onDelete,
  onSelectImage,
  onRefresh,
}) => {
  const [currentBackground, setCurrentBackground] = useState<string>('');
  const [imageUrls, setImageUrls] = useState<GalleryImageInfo[]>([]);
  const [currentInfo, setCurrentInfo] = useState<string>('');
  const [infoOpen, setInfoOpen] = useState<boolean>(false);

  // Function
  function getImageUrls(info: CharacterInfo, type: GalleryCategory) {
    let tmp: GalleryImageInfo[] = [];
    switch (type) {
      case GalleryCategory.All:
        tmp = [
          ...(info.portraitGalleryImageUrl || []),
          ...(info.poseGalleryImageUrl || []),
          ...(info.expressionGalleryImageUrl || []),
        ];
        break;

      case GalleryCategory.Portrait:
        tmp = info.portraitGalleryImageUrl || [];
        break;

      case GalleryCategory.Pose:
        tmp = info.poseGalleryImageUrl || [];
        break;

      case GalleryCategory.Expression:
        tmp = info.expressionGalleryImageUrl || [];
        break;

      default:
        console.error(`Unknown category type: ${type}`);
    }
    return tmp;
  }

  const closeInfo = () => {
    setInfoOpen(false);
  };

  // Hooks
  useEffect(() => {
    setImageUrls(getImageUrls(characterInfo, categoryType));
  }, [characterInfo, categoryType]);

  useEffect(() => {
    if (imageUrls != null && imageUrls.length > 0 && selectedIndex !== null) {
      setCurrentBackground(imageUrls[selectedIndex].imageUrl);
      setCurrentInfo(imageUrls[selectedIndex].promptParameter);
      onSelectImage(categoryType, selectedIndex);
    }
  }, [imageUrls, selectedIndex]);

  // Handler
  const handleSwipeChange = (swiper: any) => {
    if (imageUrls.length > 0) {
      const newIndex = swiper.activeIndex;
      setCurrentBackground(imageUrls[newIndex].imageUrl);
      onSelectImage(categoryType, newIndex);
    }
  };

  const handleOnShare = () => {
    if (imageUrls && selectedIndex !== null && imageUrls[selectedIndex]) {
      const imageUrl = imageUrls[selectedIndex].imageUrl;

      navigator.clipboard
        .writeText(imageUrl)
        .then(() => {
          console.log('Image URL copied to clipboard:', imageUrl);
          alert('Image URL copied to clipboard!');
        })
        .catch(err => {
          console.error('Failed to copy URL to clipboard:', err);
          alert('Failed to copy URL. Please try again.');
        });
    } else {
      console.error('No valid image URL found for the current selection.');
      alert('No image URL available to copy.');
    }
  };

  const handleOnThumbnail = async () => {
    if (selectedIndex !== null) {
      const payload: SelectImageReq = {
        characterImageId: imageUrls[selectedIndex].galleryImageId,
      };

      try {
        // API 호출
        const response = await sendSelectImage(payload);

        if (response) {
          alert(`캐릭터 썸네일이 변경되었습니다.`);
          onRefresh();
        }
      } catch (error) {
        console.error('Error select Image:', error);
      }
    }
  };

  const handleOnInfo = () => {
    setInfoOpen(true);
  };

  return (
    <Box sx={{display: 'flex', flexDirection: 'column', height: '100vh'}} onClick={() => infoOpen && closeInfo()}>
      <Box
        className={styles.thumbnailArea}
        style={{
          backgroundImage: `url(${currentBackground})`,
        }}
      >
        <Box className={styles.thumbnailButtonArea}>
          <IconButton onClick={onBack} className={styles.backButton}>
            <ArrowBackIcon />
          </IconButton>

          <IconButton className={styles.menuButton}>
            <Typography variant="caption">•••</Typography>
          </IconButton>
        </Box>

        {/* Label */}
        <Typography variant="h6" className={styles.label}>
          {galleryCategoryText[categoryType]}
        </Typography>
      </Box>

      {/* Control Area */}
      <Box className={styles.controlArea}>
        {/* Thumbnail Navigation */}
        <Swiper
          initialSlide={selectedIndex ?? 0}
          slidesPerView={4}
          spaceBetween={1}
          centeredSlides={true}
          onSlideChange={handleSwipeChange}
          className={styles.thumbnailSwiper}
        >
          {imageUrls.map((url, index) => (
            <SwiperSlide key={index}>
              <Box
                className={styles.thumbnailSlide}
                style={{
                  backgroundImage: `url(${url.imageUrl})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Info Popup */}
        {infoOpen && selectedIndex !== null && (
          <Paper className={styles.infoPopup}>
            <Typography variant="subtitle1">Info</Typography>
            <Typography variant="body2">{currentInfo || 'No promptParameter available'}</Typography>
          </Paper>
        )}

        {/* Control Button Area */}
        <Box className={styles.controlButtonArea}>
          <Button onClick={handleOnShare} className={styles.controlButton} startIcon={<ShareIcon />}>
            Share
          </Button>
          <Button onClick={handleOnThumbnail} className={styles.controlButton} startIcon={<PhotoLibraryIcon />}>
            Thumbnail
          </Button>
          <Button onClick={handleOnInfo} className={styles.controlButton} startIcon={<InfoIcon />}>
            Info
          </Button>
          <Button onClick={onDelete} className={styles.controlButton} startIcon={<DeleteIcon />}>
            Delete
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default CharacterGalleryViewer;
