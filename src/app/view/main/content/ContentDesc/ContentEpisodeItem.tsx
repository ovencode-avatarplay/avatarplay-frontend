import React from 'react';
import styles from './ContentEpisodeItem.module.css';
import {Box, Typography} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ImageIcon from '@mui/icons-material/Image';
import LockIcon from '@mui/icons-material/Lock';
import {useDispatch} from 'react-redux';
import {setDrawerEpisodeId} from '@/redux-store/slices/DrawerContentDescSlice';
import {EpisodeCardProps} from './ContentDescType';

const ContentEpisodeItem: React.FC<EpisodeCardProps> = ({
  episodeId,
  intimacy,
  imageCount,
  thumbnail,
  name,
  desc,
  isLock,
}) => {
  const dispatch = useDispatch();

  const handleOpenEpisodeDrawer = () => {
    if (!isLock) {
      dispatch(setDrawerEpisodeId(episodeId));
    }
  };

  return (
    <Box className={`${styles.episodeCard} ${isLock ? styles.dimmed : ''}`} onClick={handleOpenEpisodeDrawer}>
      {/* 이미지 박스 */}
      <Box className={styles.imageBox}>
        <img src={thumbnail} alt={`Episode ${episodeId}`} className={styles.episodeImage} />
        <Box className={styles.imageOverlay}>
          <Box className={styles.iconInfo}>
            <FavoriteIcon color="error" />
            <Typography variant="body2" className={styles.iconText}>
              {Math.floor(intimacy)}%
            </Typography>
          </Box>
          <Box className={styles.iconInfo}>
            <ImageIcon color="action" />
            <Typography variant="body2" className={styles.iconText}>
              {imageCount}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* 텍스트 박스 */}
      <Box className={styles.textBox}>
        <Typography variant="h6" className={styles.title}>
          {name}
        </Typography>
        <Typography variant="body2" className={styles.description}>
          {desc}
        </Typography>
      </Box>

      {/* 잠김 아이콘 */}
      {isLock && (
        <Box className={styles.lockIconWrapper}>
          <LockIcon className={styles.lockIcon} />
        </Box>
      )}
    </Box>
  );
};

export default ContentEpisodeItem;
