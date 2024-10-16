import React, {useState} from 'react';
import {Box, Button, Dialog, DialogContent, MenuItem, Typography} from '@mui/material';
import {styled} from '@mui/system';
import Style from './EpisodeImageUpload.module.css';
import SpeedDial from '@mui/material/SpeedDial';
import CreateIcon from '@mui/icons-material/Create';
import ImageIcon from '@mui/icons-material/Image';

const Input = styled('input')({
  display: 'none',
});

interface Props {
  onClickEasyCreate: () => void;
  onClickAdvanceCreate: () => void;
  onClickUploadImage: () => void;
}

const EpisodeImageUpload: React.FC<Props> = ({onClickEasyCreate, onClickAdvanceCreate, onClickUploadImage}) => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

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
    </Box>
  );
};

export default EpisodeImageUpload;
