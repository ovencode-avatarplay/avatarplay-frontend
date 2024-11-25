import React, {useEffect, useState} from 'react';
import {Box, ToggleButton, ToggleButtonGroup, Dialog, DialogContent, Button} from '@mui/material';
import styles from './CharacterGallery.module.css';

import {CharacterInfo} from '@/redux-store/slices/EpisodeInfo';
import CharacterGalleryItem from './CharacterGalleryItem';

import ImageUploadDialog from '../../main/content/create/content-main/episode/episode-ImageCharacter/ImageUploadDialog';
import {MediaState, sendUploadImage, MediaUploadReq} from '@/app/NetWork/ImageNetwork';

interface CharacterGalleryProps {
  characterInfo: CharacterInfo;
  onCategorySelected: (category: string) => void;
  onCurrentSelected: (category: string, index: number | null) => void;
  onGenerateSelected: () => void;
  updateCharacter: (newinfo: CharacterInfo) => void;
}

const CharacterGallery: React.FC<CharacterGalleryProps> = ({
  characterInfo,
  onCategorySelected,
  onCurrentSelected,
  onGenerateSelected,
  updateCharacter,
}) => {
  // 카테고리
  const [category, setCategory] = useState('Portrait');
  const [categoryIndexes, setCategoryIndexes] = useState({
    Portrait: null as number | null,
    Poses: null as number | null,
    Expression: null as number | null,
  });

  // list에 올릴 이미지 url
  const [portraitUrl, setPortraitUrl] = useState<string[] | null>(null);
  const [poseUrl, setPoseUrl] = useState<string[] | null>(null);
  const [expressionUrl, setExpressionUrl] = useState<string[] | null>(null);
  const [itemUrl, setItemUrl] = useState<string[] | null>(portraitUrl);

  // 현재 선택된 아이템
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);

  const [currentCharacterInfo, setCurrentCharacterInfo] = useState<CharacterInfo>(characterInfo);

  // upload
  const [uploadModeDialogOpen, setUploadModeDialogOpen] = useState(false);
  const [imageUploadDialogOpen, setImageUploadDialogOpen] = useState(false);

  //#region handler
  const handleCategoryChange = (_: any, newCategory: string) => {
    if (newCategory !== null) setCategory(newCategory);
  };

  const handleSelectItem = (index: number | null) => {
    setSelectedItemIndex(index);
    setCategoryIndexes(prev => ({
      ...prev,
      [category]: index,
    }));

    onCurrentSelected(category, index);
  };

  const handleAddImageClick = () => {
    setUploadModeDialogOpen(true);
  };

  const handleUploadModeDialogClose = () => {
    setUploadModeDialogOpen(false);
  };

  const handleImageUploadClick = () => {
    setUploadModeDialogOpen(false);
    setImageUploadDialogOpen(true);
  };
  const handleImageUploadDialogClose = () => {
    setImageUploadDialogOpen(false);
  };

  // 이미지 하나를 업로드 함
  const handleUploadImage = async (file: File) => {
    try {
      const req: MediaUploadReq = {
        mediaState: MediaState.GalleryImage,
        file: file,
        imageList: [],
      };

      // 파일 업로드 API 호출
      const response = await sendUploadImage(req);

      if (response?.data) {
        const imgUrl: string = response.data.url;

        switch (category) {
          case 'Portrait':
            setCurrentCharacterInfo(prevState => ({
              ...prevState,
              portraitGalleryImageUrl: [...prevState.portraitGalleryImageUrl, imgUrl],
            }));

            updateCharacter({
              ...currentCharacterInfo,
              portraitGalleryImageUrl: [...currentCharacterInfo.portraitGalleryImageUrl, imgUrl],
            });
            break;

          case 'Poses':
            setCurrentCharacterInfo(prevState => ({
              ...prevState,
              poseGalleryImageUrl: [...prevState.poseGalleryImageUrl, imgUrl],
            }));

            updateCharacter({
              ...currentCharacterInfo,
              poseGalleryImageUrl: [...currentCharacterInfo.poseGalleryImageUrl, imgUrl],
            });
            break;

          case 'Expression':
            setCurrentCharacterInfo(prevState => ({
              ...prevState,
              expressionGalleryImageUrl: [...prevState.expressionGalleryImageUrl, imgUrl],
            }));

            updateCharacter({
              ...currentCharacterInfo,
              expressionGalleryImageUrl: [...currentCharacterInfo.expressionGalleryImageUrl, imgUrl],
            });
            break;

          default:
            console.error('Unknown category:', category);
            break;
        }
        console.log('Additional image URLs:', response.data.url); // 추가 이미지 URL 출력
      } else {
        throw new Error('Unexpected API response: No data');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
    }
  };
  //#endregion

  //#region  hook
  useEffect(() => {
    setPortraitUrl(characterInfo.portraitGalleryImageUrl);
    setPoseUrl(characterInfo.poseGalleryImageUrl);
    setExpressionUrl(characterInfo.expressionGalleryImageUrl);
    setCurrentCharacterInfo(characterInfo);
  }, [characterInfo]);

  useEffect(() => {
    // 카테고리 전환 시 아이템, 인덱스 갱신
    if (category === 'Portrait') {
      setItemUrl(portraitUrl);
      setSelectedItemIndex(categoryIndexes.Portrait);
    } else if (category === 'Poses') {
      setItemUrl(poseUrl);
      setSelectedItemIndex(categoryIndexes.Poses);
    } else if (category === 'Expression') {
      setItemUrl(expressionUrl);
      setSelectedItemIndex(categoryIndexes.Expression);
    }
    onCategorySelected(category);
  }, [category, categoryIndexes, portraitUrl, poseUrl, expressionUrl]);
  //#endregion

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
        {itemUrl?.map((item, index) => (
          <CharacterGalleryItem
            key={index}
            url={item}
            isSelected={selectedItemIndex === index}
            onSelect={() => handleSelectItem(index)}
          />
        ))}
        <Button variant="contained" color="primary" onClick={handleAddImageClick} className={styles.addImageButton}>
          + Add Image
        </Button>
      </Box>

      <Dialog open={uploadModeDialogOpen} onClose={handleUploadModeDialogClose}>
        <DialogContent>
          <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
            <Button variant="outlined" onClick={handleImageUploadClick}>
              Upload Image
            </Button>
            <Button variant="outlined" onClick={onGenerateSelected}>{`${category} Create`}</Button>
          </Box>
        </DialogContent>
      </Dialog>

      <ImageUploadDialog
        isOpen={imageUploadDialogOpen}
        onClose={handleImageUploadDialogClose}
        onFileSelect={handleUploadImage}
      />
    </Box>
  );
};

export default CharacterGallery;
