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

import {MediaState, MediaUploadReq, sendUpload} from '@/app/NetWork/ImageNetwork';
import EpisodeStarringArtist from './EpisodeStarringCharacter';
import EpisodeTempArtist from './EpisodeTempCharacter';
import EpisodeStarringCharacter from './EpisodeStarringCharacter';
import LoadingOverlay from '@/components/create/LoadingOverlay';

const EpisodeUploadCharacter: React.FC = () => {
  const editedEpisodeInfo = useSelector((state: RootState) => state.episode);

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [openTempArtist, onClickTempArtist] = useState(false);
  const [openSelectArtist, onClickSelectArtist] = useState(false);
  const dispatch = useDispatch();

  const handleSpeedDialClick = () => {
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
  };

  const handleTempArtistClick = () => {
    onClickTempArtist(true); // 24/11/05 임시 블락
    handleClose();
  };

  const handleSelectArtistClick = () => {
    onClickSelectArtist(true);
    handleClose();
  };

  const [loading, setLoading] = useState<boolean>(false);
  const [uploadImageList, setUploadImageList] = useState<File[]>([]);

  const handleImageUpload = (images: File[]) => {
    setUploadImageList(images);
    const uploadImg: File = images[0];
    GetImageUrlByFile(uploadImg);
  };

  const GetImageUrlByFile = async (image: File) => {
    setLoading(true); // 로딩 상태 활성화

    try {
      // Upload 객체 생성
      const req: MediaUploadReq = {
        mediaState: MediaState.BackgroundImage, // 적절한 MediaState 설정
        file: image,
      };

      // 파일 업로드 API 호출
      const response = await sendUpload(req);

      if (response?.data) {
        const imgUrl: string = response.data.url; // 업로드된 메인 이미지 URL
        setImagePreview(imgUrl); // 미리보기 업데이트
        dispatch(setCurrentEpisodeBackgroundImage(imgUrl)); // Redux 상태 업데이트

        console.log('Additional image URLs:', response.data.imageUrlList); // 추가 이미지 URL 출력
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
    if (editedEpisodeInfo?.currentEpisodeInfo?.characterInfo)
      setImagePreview(editedEpisodeInfo?.currentEpisodeInfo?.characterInfo?.mainImageUrl);
  }, [editedEpisodeInfo]);

  return (
    <div className={styles.imageBox}>
      <Typography>Starring Artist</Typography>
      <Box className={styles.imageArea}>
        <Box className={styles.imageIcon} display="flex" alignItems="center">
          <ImageIcon fontSize="large" />
          <Typography variant="h6" marginLeft={1}>
            Image
          </Typography>
          <Dialog open={dialogOpen} onClose={handleClose} className={styles.dialogContent}>
            <DialogContent dividers className={styles.dialogContent}>
              <MenuItem onClick={handleTempArtistClick}>No Artist. Temporary</MenuItem>
              <MenuItem onClick={handleSelectArtistClick}>Select Artist</MenuItem>
            </DialogContent>
          </Dialog>
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
        {openTempArtist && <EpisodeTempArtist open={openTempArtist} closeModal={() => onClickTempArtist(false)} />}
        {openSelectArtist && (
          <EpisodeStarringCharacter open={openSelectArtist} closeModal={() => onClickSelectArtist(false)} />
        )}
      </Box>

      <LoadingOverlay loading={loading} />
    </div>
  );
};

export default EpisodeUploadCharacter;
