import React, {useEffect, useState} from 'react';
import styles from './CharacterGallery.module.css';

import ImageUploadDialog from '../../main/content/create/story-main/episode/episode-ImageCharacter/ImageUploadDialog';
import {UploadMediaState, sendUpload, MediaUploadReq} from '@/app/NetWork/ImageNetwork';
import {GalleryCategory, galleryCategoryText} from './CharacterGalleryData';
import {GalleryImageInfo, SaveGalleryReq, sendSaveGallery} from '@/app/NetWork/CharacterNetwork';
import CharacterGalleryGrid from './CharacterGalleryGrid';
import LoadingOverlay from '@/components/create/LoadingOverlay';
import CharacterGalleryToggle from './CharacterGalleryToggle';
import {CharacterInfo} from '@/redux-store/slices/StoryInfo';
import SelectDrawer, {SelectDrawerItem} from '@/components/create/SelectDrawer';

interface CharacterGalleryProps {
  characterInfo: CharacterInfo;
  onCategorySelected: (category: GalleryCategory) => void;
  onCurrentSelected: (category: GalleryCategory, index: number | null) => void;
  onGenerateSelected: () => void;
  refreshCharacter: (id: number) => void;
  initialSelectedItem?: [GalleryCategory, number | null];
  selectedGalleryType: GalleryCategory;
  setSelectedGalleryType: React.Dispatch<React.SetStateAction<GalleryCategory>>;
  hideSelected?: boolean;
}

const CharacterGallery: React.FC<CharacterGalleryProps> = ({
  characterInfo,
  onCategorySelected,
  onCurrentSelected,
  onGenerateSelected,
  refreshCharacter,
  initialSelectedItem,
  selectedGalleryType,
  setSelectedGalleryType,
  hideSelected = false,
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

  // All 일때 upload
  const [galleryTypeDialogOpen, setGalleryTypeDialogOpen] = useState(false);

  const [loading, setloading] = useState(false);

  //#region handler

  const handleCategoryChange = (newCategory: GalleryCategory) => {
    if (newCategory !== category) {
      setCategory(newCategory);
    }
  };

  const handleSelectItem = (index: number | null) => {
    setSelectedItemIndex(index);

    onCurrentSelected(category, index);
  };
  const handleAddImageClick = () => {
    if (category === GalleryCategory.All) {
      setGalleryTypeDialogOpen(true);
    } else {
      setUploadModeDialogOpen(true);
    }
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
      const targetCategory = category === GalleryCategory.All ? selectedGalleryType : category;

      if (!targetCategory) {
        console.error('Target category is not selected.');
        return;
      }

      const req: MediaUploadReq = {
        mediaState: UploadMediaState.GalleryImage,
        fileList: [file],
      };

      // 파일 업로드 API 호출
      setloading(true);
      const response = await sendUpload(req);

      const uploadedImage = 'local uploaded image';

      if (response?.data) {
        const imgUrl: string = response.data.mediaUploadInfoList[0].url;

        console.log('Additional image URLs:', response.data.mediaUploadInfoList); // 추가할 이미지 URL

        let updatedGalleryUrls: string[] = [];
        updatedGalleryUrls = [imgUrl];

        const saveReq: SaveGalleryReq = {
          characterId: characterInfo.id,
          galleryType: targetCategory,
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
      setloading(false);
    }
  };

  // All 일때 업로드 타입 지정
  const handleSelectGalleryType = (type: GalleryCategory) => {
    setSelectedGalleryType(type);
    setGalleryTypeDialogOpen(false);
    setUploadModeDialogOpen(true);
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
    if (category === GalleryCategory.All) {
      const allUrls = [...(portraitUrl || []), ...(poseUrl || []), ...(expressionUrl || [])];
      setItemUrl(allUrls);
      setSelectedItemIndex(0);
    } else if (category === GalleryCategory.Portrait) {
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
  const selectCategoryItems: SelectDrawerItem[] = [
    {
      name: 'Portrait',
      onClick: () => {
        handleSelectGalleryType(GalleryCategory.Portrait);
      },
    },
    {
      name: 'Pose',
      onClick: () => {
        handleSelectGalleryType(GalleryCategory.Pose);
      },
    },
    {
      name: 'Expression',
      onClick: () => {
        handleSelectGalleryType(GalleryCategory.Expression);
      },
    },
  ];

  const selectUploadModeItems: SelectDrawerItem[] = [
    {
      name: 'Upload Image',
      onClick: () => {
        handleImageUploadClick();
      },
    },
    {
      name: `${galleryCategoryText[category === GalleryCategory.All ? selectedGalleryType : category]} Create`,
      onClick: onGenerateSelected,
    },
  ];

  return (
    <div className={styles.container}>
      <CharacterGalleryToggle category={category} onCategoryChange={handleCategoryChange} />

      <CharacterGalleryGrid
        itemUrl={itemUrl}
        selectedItemIndex={selectedItemIndex}
        onSelectItem={handleSelectItem}
        onAddImageClick={handleAddImageClick}
        category={category}
        hideSelected={hideSelected}
      />

      <SelectDrawer
        items={selectCategoryItems}
        isOpen={galleryTypeDialogOpen}
        onClose={() => setGalleryTypeDialogOpen(false)}
        selectedIndex={0}
      />

      <SelectDrawer
        items={selectUploadModeItems}
        isOpen={uploadModeDialogOpen}
        onClose={handleUploadModeDialogClose}
        selectedIndex={0}
      />
      <ImageUploadDialog
        isOpen={imageUploadDialogOpen}
        onClose={handleImageUploadDialogClose}
        onFileSelect={handleUploadImage}
      />
      <LoadingOverlay loading={loading} />
    </div>
  );
};

export default CharacterGallery;
