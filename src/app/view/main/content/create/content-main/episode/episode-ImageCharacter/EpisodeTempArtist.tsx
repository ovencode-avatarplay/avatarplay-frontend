import React, {useEffect, useState} from 'react';
import {Box, Button, Dialog, DialogContent, DialogTitle, MenuItem, TextField, Typography} from '@mui/material';
import {styled} from '@mui/system';
import SpeedDial from '@mui/material/SpeedDial';
import CreateIcon from '@mui/icons-material/Create';
import ImageIcon from '@mui/icons-material/Image';

import styles from './EpisodeTempArtist.module.css';

import {useDispatch, useSelector} from 'react-redux';
import {setCurrentEpisodeThumbnail} from '@/redux-store/slices/EpisodeInfo';
import {RootState, AppDispatch} from '@/redux-store/ReduxStore';

import {UploadImageReq, sendUploadImage} from '@/app/NetWork/ImageNetwork';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';

const Input = styled('input')({
  display: 'none',
});

interface Props {
  open: boolean; // 모달 열림 상태
  closeModal: () => void; // 모달 닫기 함수
}

const EpisodeTempArtist: React.FC<Props> = ({open, closeModal}) => {
  const editedEpisodeInfo = useSelector((state: RootState) => state.episode);

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [secondDialogOpen, setSecondDialogOpen] = useState(false); // 두 번째 다이얼로그 상태
  const dispatch = useDispatch();
  const [isMobile, setIsMobile] = useState(false); // 모바일 여부 확인

  useEffect(() => {
    // 모바일 디바이스 감지
    const checkMobileDevice = () => {
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(isMobileDevice);
    };

    checkMobileDevice();
  }, []);

  const openPhotoDialog = () => {
    if (isMobile) {
      // 모바일인 경우 다이얼로그 열기
      setSecondDialogOpen(true);
    } else {
      // 모바일이 아닌 경우 Take Photo 실행
      handleTakePhoto();
    }
  };

  const handleSpeedDialClick = () => {
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
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

  const [characterDescription, setCharacterDescription] = useState<string>(
    /* currentEpisodeInfo.episodeDescription.characterDescription || '',*/ '',
  );
  const onChangeCharacterDescription = (description: string) => {
    setCharacterDescription(description);
  };

  const [characterName, setCharacterName] = useState<string>(
    /* currentEpisodeInfo.episodeDescription.characterDescription || '',*/ '',
  );
  const onChangeCharacterName = (name: string) => {
    setCharacterName(name);
  };
  const handleFileSelection = (file: File) => {
    const reader = new FileReader();
    reader.onload = event => {
      if (event.target && typeof event.target.result === 'string') {
        setImagePreview(event.target.result); // Base64 URL로 변환된 이미지 저장
      }
    };
    reader.readAsDataURL(file); // 파일을 Base64로 변환
  };

  const handlePhotoLibrary = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = event => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        handleFileSelection(file); // 파일 선택 후 이미지 URL 생성 및 업데이트
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
        handleFileSelection(file); // 파일 선택 후 이미지 URL 생성 및 업데이트
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
        handleFileSelection(file); // 파일 선택 후 이미지 URL 생성 및 업데이트
      }
    };
    input.click();
    setSecondDialogOpen(false); // 다이얼로그 닫기
  };

  useEffect(() => {
    setImagePreview(editedEpisodeInfo?.currentEpisodeInfo?.thumbnail);
  }, [editedEpisodeInfo]);

  return (
    <Dialog
      closeAfterTransition={false}
      open={open}
      onClose={closeModal}
      fullScreen
      className={styles.modalBody}
      disableAutoFocus={true}
      disableEnforceFocus={true}
    >
      <DialogTitle className={styles['modal-header']}>
        <div className={styles.modalTitle}>
          <Button onClick={closeModal} className={styles['close-button']}>
            <ArrowBackIosIcon />
          </Button>

          <Typography variant="h6" marginLeft={1}>
            Starring Artist
          </Typography>
        </div>
      </DialogTitle>
      <div className={styles.imageBox}>
        <Box className={styles.imageArea}>
          <Box className={styles.imageIcon} display="flex" alignItems="center">
            <ImageIcon fontSize="large" />
            <Typography variant="h6" marginLeft={1}>
              Image
            </Typography>
            <Dialog open={dialogOpen} onClose={handleClose} className={styles.dialogContent}>
              <DialogContent dividers className={styles.dialogContent}>
                <MenuItem onClick={handleUploadImageClick}>Upload Image</MenuItem>
                <MenuItem onClick={handleClose}>AI Image Generation</MenuItem>
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
            <div
              className={styles.setupImage}
              style={{
                backgroundImage: `url(${imagePreview})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                width: '100%',
                height: '200px',
              }}
            ></div>
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
        </Box>
      </div>
      <Box className={styles.dialogContent}>
        <TextField
          label="name"
          variant="outlined"
          fullWidth
          margin="normal"
          multiline
          rows={1}
          value={characterName}
          onChange={e => onChangeCharacterName(e.target.value)}
        />
        <TextField
          label="Personality"
          variant="outlined"
          fullWidth
          margin="normal"
          multiline
          rows={4}
          value={characterDescription}
          onChange={e => onChangeCharacterDescription(e.target.value)}
        />
      </Box>
      <Box
        sx={{
          display: 'flex', // Flexbox 활성화
          justifyContent: 'center', // 가로 중앙 정렬
          alignItems: 'center', // 세로 중앙 정렬
        }}
        className={styles.buttonBox}
      >
        <Button
          sx={{
            m: 1,
            color: 'black',
            borderColor: 'gray',
            width: '100px',
          }}
          variant="outlined"
        >
          Confirm
        </Button>
      </Box>
    </Dialog>
  );
};

export default EpisodeTempArtist;