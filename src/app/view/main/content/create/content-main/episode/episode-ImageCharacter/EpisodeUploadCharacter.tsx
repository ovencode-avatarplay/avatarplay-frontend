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
import EpisodeStarringArtist from './EpisodeStarringCharacter';
import EpisodeTempArtist from './EpisodeTempCharacter';

const Input = styled('input')({
  display: 'none',
});

interface Props {
  uploadImageState: boolean;
}

const EpisodeCharacter: React.FC<Props> = ({uploadImageState: uploadImageOpen}) => {
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
    setImagePreview(editedEpisodeInfo?.currentEpisodeInfo?.characterInfo.mainImageUrl);
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
          <EpisodeStarringArtist open={openSelectArtist} closeModal={() => onClickSelectArtist(false)} />
        )}
      </Box>
    </div>
  );
};

export default EpisodeCharacter;
