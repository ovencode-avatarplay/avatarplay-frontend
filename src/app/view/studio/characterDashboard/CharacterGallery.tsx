import React, {useEffect, useState} from 'react';
import {Box, ToggleButton, ToggleButtonGroup, Dialog, DialogContent, Button} from '@mui/material';
import styles from './CharacterGallery.module.css';

import {CharacterInfo, GalleryImageInfo} from '@/redux-store/slices/EpisodeInfo';
import CharacterGalleryItem from './CharacterGalleryItem';

import ImageUploadDialog from '../../main/content/create/content-main/episode/episode-ImageCharacter/ImageUploadDialog';
import {MediaState, sendUpload, MediaUploadReq} from '@/app/NetWork/ImageNetwork';
import {GalleryCategory} from './CharacterGalleryData';
import {SaveGalleryReq, sendSaveGallery} from '@/app/NetWork/CharacterNetwork';
import CharacterGalleryGrid from './CharacterGalleryGrid';

interface CharacterGalleryProps {
  characterInfo: CharacterInfo;
  onCategorySelected: (category: GalleryCategory) => void;
  onCurrentSelected: (category: GalleryCategory, index: number | null) => void;
  onGenerateSelected: () => void;
  refreshCharacter: (id: number) => void;
  initialSelectedItem?: [GalleryCategory, number | null];
}

const CharacterGallery: React.FC<CharacterGalleryProps> = ({
  characterInfo,
  onCategorySelected,
  onCurrentSelected,
  onGenerateSelected,
  refreshCharacter,
  initialSelectedItem,
}) => {
  // 카테고리
  const [category, setCategory] = useState<GalleryCategory>(GalleryCategory.Portrait);

  // list에 올릴 이미지 url
  const [portraitUrl, setPortraitUrl] = useState<GalleryImageInfo[] | null>(null);
  const [poseUrl, setPoseUrl] = useState<GalleryImageInfo[] | null>(null);
  const [expressionUrl, setExpressionUrl] = useState<GalleryImageInfo[] | null>(null);

  const [itemUrl, setItemUrl] = useState<GalleryImageInfo[] | null>(null);

  // 현재 선택된 아이템
  const [selectedItemIndex, setSelectedItemIndex] = useState<number | null>(null);

  const [currentCharacterInfo, setCurrentCharacterInfo] = useState<CharacterInfo>(characterInfo);

  // upload
  const [uploadModeDialogOpen, setUploadModeDialogOpen] = useState(false);
  const [imageUploadDialogOpen, setImageUploadDialogOpen] = useState(false);

  //#region handler
  const handleCategoryChange = (_: any, newCategory: GalleryCategory) => {
    if (newCategory !== null) setCategory(newCategory);
  };

  const handleSelectItem = (index: number | null) => {
    setSelectedItemIndex(index);

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
        triggerImageList: [],
      };

      // 파일 업로드 API 호출
      const response = await sendUpload(req);

      const uploadedImage = 'local uploaded image';

      if (response?.data) {
        const imgUrl: string = response.data.url;

        console.log('Additional image URLs:', response.data.url); // 추가할 이미지 URL

        let updatedGalleryUrls: string[] = [];
        updatedGalleryUrls = [imgUrl];

        const saveReq: SaveGalleryReq = {
          characterId: characterInfo.id,
          galleryType: category,
          galleryImageUrls: updatedGalleryUrls,
          debugParameter: uploadedImage,
        };

        const responseGallery = await sendSaveGallery(saveReq);

        console.log('save gallery success' + responseGallery.resultCode);
        refreshCharacter(characterInfo.id);
      } else {
        throw new Error('Unexpected API response: No data');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      console.log('final');
    }
  };
  //#endregion

  //#region  hook
  useEffect(() => {
    if (initialSelectedItem) {
      const [initialCategory, initialIndex] = initialSelectedItem;
      setCategory(initialCategory);
      setSelectedItemIndex(initialIndex);
    }
  }, [initialSelectedItem]);

  useEffect(() => {
    setPortraitUrl(currentCharacterInfo.portraitGalleryImageUrl);
    setPoseUrl(currentCharacterInfo.poseGalleryImageUrl);
    setExpressionUrl(currentCharacterInfo.expressionGalleryImageUrl);
  }, []);

  useEffect(() => {
    setCurrentCharacterInfo(characterInfo);
  }, [characterInfo]);

  useEffect(() => {
    setPortraitUrl(currentCharacterInfo.portraitGalleryImageUrl);
    setPoseUrl(currentCharacterInfo.poseGalleryImageUrl);
    setExpressionUrl(currentCharacterInfo.expressionGalleryImageUrl);
  }, [currentCharacterInfo]);

  useEffect(() => {
    // 카테고리 전환 시 아이템, 인덱스 갱신
    if (category === GalleryCategory.Portrait) {
      setItemUrl(portraitUrl);
      setSelectedItemIndex(0);
    } else if (category === GalleryCategory.Pose) {
      setItemUrl(poseUrl);
      setSelectedItemIndex(0);
    } else if (category === GalleryCategory.Expression) {
      setItemUrl(expressionUrl);
      setSelectedItemIndex(0);
    }
    onCategorySelected(category);
  }, [category, portraitUrl, poseUrl, expressionUrl]);
  //#endregion

  return (
    <Box className={styles.container}>
      <ToggleButtonGroup value={category} exclusive onChange={handleCategoryChange} className={styles.toggleButtons}>
        <ToggleButton value={GalleryCategory.Portrait} className={styles.toggleButton}>
          Portrait
        </ToggleButton>
        <ToggleButton value={GalleryCategory.Pose} className={styles.toggleButton}>
          Poses
        </ToggleButton>
        <ToggleButton value={GalleryCategory.Expression} className={styles.toggleButton}>
          Expression
        </ToggleButton>
      </ToggleButtonGroup>

      <CharacterGalleryGrid
        itemUrl={itemUrl}
        selectedItemIndex={selectedItemIndex}
        onSelectItem={handleSelectItem}
        onAddImageClick={handleAddImageClick}
      />

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
