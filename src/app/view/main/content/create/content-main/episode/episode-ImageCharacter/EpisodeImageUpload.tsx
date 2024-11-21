import React, {useEffect, useState} from 'react';
import {Box, Button, Dialog, DialogContent, MenuItem, Typography} from '@mui/material';
import {styled} from '@mui/system';
import SpeedDial from '@mui/material/SpeedDial';
import CreateIcon from '@mui/icons-material/Create';
import ImageIcon from '@mui/icons-material/Image';

import styles from './EpisodeImageUpload.module.css';

import {useDispatch, useSelector} from 'react-redux';
import {setCurrentEpisodeBackgroundImage} from '@/redux-store/slices/EpisodeInfo';
import {RootState, AppDispatch} from '@/redux-store/ReduxStore';

import {UploadImageReq, sendUploadImage} from '@/app/NetWork/ImageNetwork';
import ImageUploadDialog from '../episode-imagesetup/EpisodeImageUpload';
import LoadingOverlay from '@/components/create/LoadingOverlay';

const Input = styled('input')({
  display: 'none',
});

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
  const [isMobile, setIsMobile] = useState(false); // 모바일 여부 확인
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [secondDialogOpen, setSecondDialogOpen] = useState(false); // 두 번째 다이얼로그 상태

  const dispatch = useDispatch();
  useEffect(() => {
    // 모바일 디바이스 감지
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

  const handleEasyCreateClick = () => {
    onClickEasyCreate(); // 24/11/05 임시 블락
    handleClose();
  };

  const handleAdvancedAIClick = () => {
    onClickAdvanceCreate();
    handleClose();
  };
  const openPhotoDialog = () => {
    if (isMobile) {
      // 모바일인 경우 다이얼로그 열기
      setSecondDialogOpen(true);
    } else {
      // 모바일이 아닌 경우 Take Photo 실행
      handleTakePhoto();
    }
  };

  const handleUploadImageClick = () => {
    if (isMobile) {
      // 모바일인 경우 다이얼로그 열기
      setSecondDialogOpen(true);
    } else {
      // 모바일이 아닌 경우 Take Photo 실행
      handleTakePhoto();
    }
    setDialogOpen(false); // 기존 다이얼로그 닫기
  };

  const handleSecondDialogClose = () => {
    setSecondDialogOpen(false); // 새 다이얼로그 닫기
  };

  const handlePhotoLibrary = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = event => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        GetImageUrlByFile(file); // 파일 선택 후 이미지 URL 생성 및 업데이트
      }
    };
    input.click();
    setSecondDialogOpen(false); // 다이얼로그 닫기
  };

  const handleTakePhoto = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment'; // 후면 카메라
    input.onchange = event => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        GetImageUrlByFile(file); // 파일 선택 후 이미지 URL 생성 및 업데이트
      }
    };
    input.click();
    setSecondDialogOpen(false); // 다이얼로그 닫기
  };

  const handleChooseFile = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = event => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        GetImageUrlByFile(file); // 파일 선택 후 이미지 URL 생성 및 업데이트
      }
    };
    input.click();
    setSecondDialogOpen(false); // 다이얼로그 닫기
  };

  const [loading, setLoading] = useState<boolean>(false);

  const handleImageUpload = (images: File[]) => {
    const uploadImg: File = images[0];
    GetImageUrlByFile(uploadImg);
  };

  const GetImageUrlByFile = async (image: File) => {
    setLoading(true);

    try {
      const req: UploadImageReq = {file: image};
      const response = await sendUploadImage(req);

      if (response?.data) {
        const imgUrl: string = response.data;
        setImagePreview(imgUrl);
        dispatch(setCurrentEpisodeBackgroundImage(imgUrl));
      } else {
        throw new Error(`No response for file`);
      }
    } catch (error) {
      console.error('Error fetching content info:', error);
      throw error; // 에러를 상위로 전달
    } finally {
      setLoading(false);
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
          <Dialog open={dialogOpen} onClose={handleClose} className={styles.dialogContent}>
            <DialogContent dividers className={styles.dialogContent}>
              <MenuItem onClick={handleUploadImageClick}>Upload Background Image</MenuItem>
            </DialogContent>
          </Dialog>

          {/* 모바일 환경에서만 표시되는 두 번째 다이얼로그 */}
          {isMobile && (
            <Dialog open={secondDialogOpen} onClose={() => setSecondDialogOpen(false)}>
              <DialogContent dividers>
                <MenuItem onClick={handlePhotoLibrary}>Photo Library</MenuItem>
                <MenuItem onClick={handleTakePhoto}>Take Photo</MenuItem>
                <MenuItem onClick={handleChooseFile}>Choose File</MenuItem>
              </DialogContent>
            </Dialog>
          )}
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
        {uploadImageOpen && (
          <ImageUploadDialog isOpen={uploadImageOpen} onClose={onCloseUploadImage} onUpload={handleImageUpload} />
        )}
      </Box>

      <LoadingOverlay loading={loading} />
    </div>
  );
};

export default EpisodeImageUpload;
