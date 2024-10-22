import React, {useEffect, useState} from 'react';
import {Box, Button, Dialog, DialogContent, MenuItem, Typography} from '@mui/material';
import {styled} from '@mui/system';
import Style from './EpisodeImageUpload.module.css';
import SpeedDial from '@mui/material/SpeedDial';
import CreateIcon from '@mui/icons-material/Create';
import ImageIcon from '@mui/icons-material/Image';
import {UploadImageReq, sendUploadImage} from '@/app/NetWork/ImageNetwork';
import ImageUploadDialog from './episode-imagesetup/EpisodeImageUpload';
import {useDispatch} from 'react-redux';
import {setCurrentEpisodeThumbnail} from '@/redux-store/slices/EpisodeInfo';
import {RootState, AppDispatch} from '@/redux-store/ReduxStore';

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
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const dispatch = useDispatch();

  const handleSpeedDialClick = () => {
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
  };

  const handleEasyCreateClick = () => {
    onClickEasyCreate();
    handleClose();
  };

  const handleAdvancedAIClick = () => {
    onClickAdvanceCreate();
    handleClose();
  };

  const handleUploadImageClick = () => {
    onClickUploadImage();
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
        dispatch(setCurrentEpisodeThumbnail(imgUrl));
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

  return (
    <Box className={Style.imageArea}>
      <Box className={Style.imageIcon} display="flex" alignItems="center">
        <ImageIcon fontSize="large" />
        <Typography variant="h6" marginLeft={1}>
          Image
        </Typography>
        <Dialog open={dialogOpen} onClose={handleClose} className={Style.dialogContent}>
          <DialogContent dividers className={Style.dialogContent}>
            <MenuItem onClick={handleEasyCreateClick}>Character Create</MenuItem>
            <MenuItem onClick={handleAdvancedAIClick}>Advanced AI Image</MenuItem>
            <MenuItem onClick={handleUploadImageClick}>Upload Image</MenuItem>
          </DialogContent>
        </Dialog>
      </Box>

      {imagePreview ? (
        <img src={imagePreview} alt="Episode Setup" className={Style.setupImage} />
      ) : (
        <Typography variant="body1" color="textSecondary">
          No image selected. Please upload an image.
        </Typography>
      )}

      <SpeedDial
        className={Style.uploadButton}
        ariaLabel="SpeedDial openIcon"
        icon={<CreateIcon />}
        onClick={handleSpeedDialClick}
      />
      {uploadImageOpen && (
        <ImageUploadDialog isOpen={uploadImageOpen} onClose={onCloseUploadImage} onUpload={handleImageUpload} />
      )}
    </Box>
  );
};

export default EpisodeImageUpload;
