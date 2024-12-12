import React, {useEffect, useState} from 'react';
import {Box, Button, Dialog, DialogContent, MenuItem, Typography} from '@mui/material';
import SpeedDial from '@mui/material/SpeedDial';
import CreateIcon from '@mui/icons-material/Create';
import ImageIcon from '@mui/icons-material/Image';

import styles from './ContentImageUpload.module.css';

import {useDispatch, useSelector} from 'react-redux';
import {setThumbnail} from '@/redux-store/slices/PublishInfo';
import {RootState} from '@/redux-store/ReduxStore';

import {MediaState, MediaUploadReq, sendUpload} from '@/app/NetWork/ImageNetwork';
import LoadingOverlay from '@/components/create/LoadingOverlay';
import ImageUploadDialog from '../episode/episode-ImageCharacter/ImageUploadDialog';
import {AltRoute} from '@mui/icons-material';

interface Props {
  uploadImageState: boolean;
  initImage: string;
  onClickUploadImage: () => void;
  onCloseUploadImage: () => void;
}

const ContentImageUpload: React.FC<Props> = ({
  uploadImageState: uploadImageOpen,
  initImage,
  onClickUploadImage,
  onCloseUploadImage,
}) => {
  const editedContentInfo = useSelector((state: RootState) => state.content);
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
  useEffect(() => {
    if (!imagePreview && initImage) {
      console.log('Force setting imagePreview');
      setImagePreview(initImage);
    }
  }, [initImage, imagePreview]);
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
        mediaState: MediaState.ContentImage, // 적절한 MediaState 설정
        file,
      };

      // 파일 업로드 API 호출
      const response = await sendUpload(req);

      if (response?.data) {
        const imgUrl: string = response.data.url; // 메인 이미지 URL
        setImagePreview(imgUrl); // 미리보기 업데이트
        dispatch(setThumbnail(imgUrl)); // Redux 상태 업데이트

        console.log('Image URLs:', response.data.imageUrlList); // 추가 이미지 URL 로그 출력

        setDialogOpen(false);
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
    setImagePreview(editedContentInfo?.curEditingContentInfo.publishInfo.thumbnail);
  }, [editedContentInfo]);
  return (
    <div className={styles.imageBox}>
      <Typography>Story Thumbnail</Typography>
      <Box className={styles.imageArea}>
        <Box className={styles.imageIcon} display="flex" alignItems="center">
          <ImageIcon fontSize="large" />
          <Typography variant="h6" marginLeft={1}>
            Image
          </Typography>
        </Box>

        {imagePreview ? (
          <img src={imagePreview} alt="Publish Setup" className={styles.setupImage} />
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
            <MenuItem onClick={onClickUploadImage}>Upload Thumbnail Image</MenuItem>
          </DialogContent>
        </Dialog>

        <ImageUploadDialog isOpen={uploadImageOpen} onClose={onCloseUploadImage} onFileSelect={handleImageUpload} />
      </Box>

      <LoadingOverlay loading={loading} />
    </div>
  );
};

export default ContentImageUpload;
