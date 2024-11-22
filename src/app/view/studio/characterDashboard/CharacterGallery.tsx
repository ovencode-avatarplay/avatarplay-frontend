import React, {useEffect, useState} from 'react';
import {
  Box,
  ToggleButton,
  ToggleButtonGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from '@mui/material';
import CharacterGalleryItem from './CharacterGalleryItem';
import styles from './CharacterGallery.module.css';
import {CharacterInfo} from '@/redux-store/slices/EpisodeInfo';

interface CharacterGalleryProps {
  characterInfo: CharacterInfo;
}

const CharacterGallery: React.FC<CharacterGalleryProps> = ({characterInfo}) => {
  const [category, setCategory] = useState('Portrait');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);

  const handleCategoryChange = (_: any, newCategory: string) => {
    if (newCategory !== null) setCategory(newCategory);
  };

  const handleAddImageClick = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const [portraitUrl, setPortraitUrl] = useState<string[]>([]);
  const [poseUrl, setPoseUrl] = useState<string[]>([]);
  const [expressionUrl, setExpressionUrl] = useState<string[]>([]);

  const [itemUrl, setItemUrl] = useState<string[]>(portraitUrl);

  useEffect(() => {
    setPortraitUrl(characterInfo.portraitGalleryImageUrl);
    setPoseUrl(characterInfo.poseGalleryImageUrl);
    setExpressionUrl(characterInfo.expressionGalleryImageUrl);
  }, [characterInfo]);

  useEffect(() => {
    if (category === 'Portrait') {
      setItemUrl(portraitUrl);
    } else if (category === 'Poses') {
      setItemUrl(poseUrl);
    } else if (category === 'Expression') {
      setItemUrl(expressionUrl);
    }
  }, [category, portraitUrl, poseUrl, expressionUrl]);

  return (
    <Box className={styles.container}>
      <ToggleButtonGroup value={category} exclusive onChange={handleCategoryChange} className={styles.toggleButtons}>
        <ToggleButton value="Portrait" className={styles.toggleButton}>
          Portrait
        </ToggleButton>
        <ToggleButton value="Poses" className={styles.toggleButton}>
          Poses
        </ToggleButton>
        <ToggleButton value="Expression" className={styles.toggleButton}>
          Expression
        </ToggleButton>
      </ToggleButtonGroup>

      <Box className={styles.galleryContainer}>
        {itemUrl.map((item, index) => (
          <CharacterGalleryItem
            key={index}
            url={item}
            isSelected={selectedItemIndex === index}
            onSelect={() => setSelectedItemIndex(index)}
          />
        ))}
        <Button variant="contained" color="primary" onClick={handleAddImageClick} className={styles.addImageButton}>
          + Add Image
        </Button>
      </Box>

      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogContent>
          <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
            <Button variant="outlined">Upload Image</Button>
            <Button variant="outlined">{`${category} Create`}</Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default CharacterGallery;
