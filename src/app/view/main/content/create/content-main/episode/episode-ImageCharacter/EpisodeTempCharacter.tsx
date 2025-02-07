import React, {useEffect, useState} from 'react';
import {Box, Button, Dialog, DialogContent, DialogTitle, MenuItem, TextField, Typography} from '@mui/material';
import {styled} from '@mui/system';
import SpeedDial from '@mui/material/SpeedDial';
import CreateIcon from '@mui/icons-material/Create';
import ImageIcon from '@mui/icons-material/Image';

import styles from './EpisodeTempCharacter.module.css';

import {useDispatch} from 'react-redux';
import {setCharacterInfo, TriggerInfo} from '@/redux-store/slices/ContentInfo';

import {UploadMediaState, MediaUploadReq, sendUpload} from '@/app/NetWork/ImageNetwork';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import EpisodeAiImageGeneration from './EpisodeAiImageGeneration';
import LoadingOverlay from '@/components/create/LoadingOverlay';
import ImageUploadDialog from './ImageUploadDialog';

import emptyContent from '@/data/create/empty-content-info-data.json';
const Input = styled('input')({
  display: 'none',
});

interface Props {
  open: boolean; // 모달 열림 상태
  closeModal: () => void; // 모달 닫기 함수
  isTrigger?: boolean;
  setTriggerInfo?: React.Dispatch<React.SetStateAction<TriggerInfo>>;
}

const EpisodeTempCharacter: React.FC<Props> = ({open, closeModal, isTrigger, setTriggerInfo}) => {
  const [imagePreview, setImagePreview] = useState<string | undefined>();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [isLoading, setLoading] = useState(false);
  const [secondDialogOpen, setSecondDialogOpen] = useState(false); // 두 번째 다이얼로그 상태
  const dispatch = useDispatch();
  const [isMobile, setIsMobile] = useState(false); // 모바일 여부 확인
  const [isAiModalOpen, setIsAiModalOpen] = useState(false); // AI 모달 상태 추가
  const [tempCharacterInfo, setTempCharacterInfo] = useState(
    emptyContent.data.contentInfo.chapterInfoList[0].episodeInfoList[0].characterInfo,
  );

  const handleChange = (key: keyof typeof tempCharacterInfo, value: any) => {
    setTempCharacterInfo(prev => ({
      ...prev,
      [key]: value, // 특정 필드 업데이트
    }));
  };

  const handleOpenAiModal = () => {
    setIsAiModalOpen(true); // AI 모달 열기
    setDialogOpen(false);
  };

  const handleCloseAiModal = () => {
    setIsAiModalOpen(false); // AI 모달 닫기
  };

  const handleSpeedDialClick = () => {
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
  };
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
  const handleFileSelection = async (file: File) => {
    setLoading(true);
    try {
      const req: MediaUploadReq = {
        mediaState: UploadMediaState.CharacterImage,
        file: file,
      };
      const response = await sendUpload(req);
      if (response?.data) {
        const imgUrl: string = response.data.url;
        const reader = new FileReader();
        reader.onload = event => {
          if (event.target && typeof event.target.result === 'string') {
            setTempCharacterInfo(prev => ({
              ...prev,
              mainImageUrl: imgUrl, // API로 받은 URL을 업데이트
            }));
          }
        };
        reader.readAsDataURL(file);
      } else {
        throw new Error('Unexpected API response: No data');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectUrl = async (url: string) => {
    setLoading(true);
    try {
      if (url) {
        setTempCharacterInfo(prev => ({
          ...prev,
          mainImageUrl: url, // API로 받은 URL을 업데이트
        }));
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
  const handleConfirm = () => {
    if (isTrigger && setTriggerInfo) {
      setTriggerInfo(prev => ({
        ...prev,
        actionCharacterInfo: tempCharacterInfo,
      }));
    } else {
      dispatch(setCharacterInfo(tempCharacterInfo));
    }
    closeModal(); // 모달 닫기
  };

  useEffect(() => {
    if (tempCharacterInfo.mainImageUrl) setImagePreview(tempCharacterInfo.mainImageUrl);
  }, [tempCharacterInfo.mainImageUrl]);

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
                <MenuItem onClick={handleOpenAiModal}>AI Image Generation</MenuItem>
              </DialogContent>
            </Dialog>
            <ImageUploadDialog
              isOpen={secondDialogOpen}
              onClose={() => setSecondDialogOpen(false)}
              onFileSelect={handleFileSelection}
            />
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
          value={tempCharacterInfo.name}
          onChange={e =>
            setTempCharacterInfo(prev => ({
              ...prev,
              name: e.target.value, // 입력 필드의 값을 name에 업데이트
            }))
          }
        />
        <TextField
          label="Personality"
          variant="outlined"
          fullWidth
          margin="normal"
          multiline
          rows={4}
          value={tempCharacterInfo.description}
          onChange={e =>
            setTempCharacterInfo(prev => ({
              ...prev,
              description: e.target.value, // 입력 필드의 값을 name에 업데이트
            }))
          }
        />
      </Box>

      <Box>
        <Button
          className={styles.confirmButton}
          variant="outlined"
          onClick={() => {
            handleConfirm();
          }}
        >
          Confirm
        </Button>
      </Box>
      {/* EpisodeAiImageGeneration 모달 */}
      <EpisodeAiImageGeneration open={isAiModalOpen} closeModal={handleCloseAiModal} uploadImage={handleSelectUrl} />

      <LoadingOverlay loading={isLoading} />
    </Dialog>
  );
};

export default EpisodeTempCharacter;
