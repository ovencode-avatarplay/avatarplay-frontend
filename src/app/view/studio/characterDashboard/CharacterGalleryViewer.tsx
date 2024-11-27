import React, {useState} from 'react';
import {Box, Typography, IconButton, Button} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ShareIcon from '@mui/icons-material/Share';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import InfoIcon from '@mui/icons-material/Info';
import DeleteIcon from '@mui/icons-material/Delete';
import {Swiper, SwiperSlide} from 'swiper/react';
import 'swiper/css';
import styles from './CharacterGalleryViewer.module.css';

interface CharacterGalleryViewerProps {
  imageUrls: string[];
  categoryType: string;
  onBack: () => void;
  onShare: () => void;
  onThumbnail: () => void;
  onInfo: () => void;
  onDelete: () => void;
}

const CharacterGalleryViewer: React.FC<CharacterGalleryViewerProps> = ({
  imageUrls,
  categoryType,
  onBack,
  onShare,
  onThumbnail,
  onInfo,
  onDelete,
}) => {
  const [currentBackground, setCurrentBackground] = useState(imageUrls[0]);

  const handleSwipeChange = (swiper: any) => {
    setCurrentBackground(imageUrls[swiper.activeIndex]);
  };

  return (
    <Box sx={{display: 'flex', flexDirection: 'column', height: '100vh'}}>
      {/* Thumbnail Area */}
      <Box
        className={styles.thumbnailArea}
        style={{
          backgroundImage: `url(${currentBackground})`,
        }}
      >
        {/* Back Button */}
        <IconButton onClick={onBack} className={`${styles.thumbnailButton} ${styles.backButton}`}>
          <ArrowBackIcon />
        </IconButton>

        {/* Menu Button */}
        <IconButton className={`${styles.thumbnailButton} ${styles.menuButton}`}>
          <Typography variant="caption">•••</Typography>
        </IconButton>

        {/* Label */}
        <Typography variant="h6" className={styles.label}>
          {categoryType}
        </Typography>
      </Box>

      {/* Control Area */}
      <Box className={styles.controlArea}>
        {/* Thumbnail Navigation */}
        <Swiper
          slidesPerView={4}
          spaceBetween={10}
          centeredSlides={true}
          onSlideChange={handleSwipeChange}
          className={styles.thumbnailSwiper}
        >
          {imageUrls.map((url, index) => (
            <SwiperSlide key={index}>
              <Box className={styles.thumbnailSlide} style={{backgroundImage: `url(${url})`}} />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Control Button Area */}
        <Box className={styles.controlButtonArea}>
          <Button onClick={onShare} className={styles.controlButton} startIcon={<ShareIcon />}>
            Share
          </Button>
          <Button onClick={onThumbnail} className={styles.controlButton} startIcon={<PhotoLibraryIcon />}>
            Thumbnail
          </Button>
          <Button onClick={onInfo} className={styles.controlButton} startIcon={<InfoIcon />}>
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
