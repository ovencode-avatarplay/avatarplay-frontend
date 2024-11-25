import React, {useEffect, useState} from 'react';
import {Box, Button, Dialog, DialogContent, MenuItem, Typography} from '@mui/material';
import {styled} from '@mui/system';
import SpeedDial from '@mui/material/SpeedDial';
import CreateIcon from '@mui/icons-material/Create';
import ImageIcon from '@mui/icons-material/Image';

import styles from './EpisodeImageUpload.module.css';

import {useDispatch, useSelector} from 'react-redux';
import {setCurrentEpisodeBackgroundImage} from '@/redux-store/slices/EpisodeInfo';
import {RootState} from '@/redux-store/ReduxStore';

import {MediaState, MediaUploadReq, sendUploadImage} from '@/app/NetWork/ImageNetwork';
import LoadingOverlay from '@/components/create/LoadingOverlay';
import ImageUploadDialog from './ImageUploadDialog';

interface Props {
  onClickEasyCreate: () => void;
  onClickAdvanceCreate: () => void;
  uploadImageState: boolean;
  onClickUploadImage: () => void;
  onCloseUploadImage: () => void;
}

const EpisodeImageUpload: React.FC<Props> = ({
  onClickEasyCreate,
  onClickAdvanceCreate,
  uploadImageState: uploadImageOpen,
  onClickUploadImage,
  onCloseUploadImage,
}) => {
  const editedEpisodeInfo = useSelector((state: RootState) => state.episode);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState(false);

  const dispatch = useDispatch();

  useEffect(() => {
    const checkMobileDevice = () => {
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(isMobileDevice);
    };

    checkMobileDevice();
  }, []);

  const handleSpeedDialClick = () => {
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
  };
  const handleImageUpload = async (file: File) => {
    setLoading(true); // 로딩 상태 활성화
    try {
      // Upload 객체 생성
      const req: MediaUploadReq = {
        mediaState: MediaState.BackgroundImage, // 적절한 MediaState 설정
        file,
      };

      // 파일 업로드 API 호출
      const response = await sendUploadImage(req);

      if (response?.data) {
        const imgUrl: string = response.data.url; // 메인 이미지 URL
        setImagePreview(imgUrl); // 미리보기 업데이트
        dispatch(setCurrentEpisodeBackgroundImage(imgUrl)); // Redux 상태 업데이트

        console.log('Image URLs:', response.data.imageUrlList); // 추가 이미지 URL 로그 출력
      } else {
        throw new Error('Unexpected API response: No data');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setLoading(false); // 로딩 상태 비활성화
    }
  };

  useEffect(() => {
    setImagePreview(editedEpisodeInfo?.currentEpisodeInfo?.backgroundImageUrl);
  }, [editedEpisodeInfo]);

  return (
    <div className={styles.imageBox}>
      <Typography>Episode Background</Typography>
      <Box className={styles.imageArea}>
        <Box className={styles.imageIcon} display="flex" alignItems="center">
          <ImageIcon fontSize="large" />
          <Typography variant="h6" marginLeft={1}>
            Image
          </Typography>
        </Box>

        {imagePreview ? (
          <img src={imagePreview} alt="Episode Setup" className={styles.setupImage} />
        ) : (
          <Typography variant="body1" color="textSecondary">
            No image selected. Please upload an image.
          </Typography>
        )}

        <SpeedDial
          className={styles.uploadButton}
          ariaLabel="SpeedDial openIcon"
          icon={<CreateIcon />}
          onClick={handleSpeedDialClick}
        />

        <Dialog open={dialogOpen} onClose={handleClose} className={styles.dialogContent}>
          <DialogContent dividers className={styles.dialogContent}>
            <MenuItem onClick={onClickUploadImage}>Upload Background Image</MenuItem>
          </DialogContent>
        </Dialog>

        <ImageUploadDialog isOpen={uploadImageOpen} onClose={onCloseUploadImage} onFileSelect={handleImageUpload} />
      </Box>

      <LoadingOverlay loading={loading} />
    </div>
  );
};

export default EpisodeImageUpload;
