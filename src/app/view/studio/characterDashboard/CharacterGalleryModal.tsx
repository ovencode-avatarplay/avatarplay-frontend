import React, {useEffect, useState} from 'react';

// mui, css
import {Modal, Box, Button, Typography, Snackbar, Alert, Drawer} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import PreviewIcon from '@mui/icons-material/Preview';
import DeleteIcon from '@mui/icons-material/Delete';
import styles from './CharacterGalleryModal.module.css';

// redux
import {CharacterInfo, GalleryImageInfo} from '@/redux-store/slices/ContentInfo';

// Network
import {DeleteGalleryReq, sendDeleteGallery} from '@/app/NetWork/CharacterNetwork';

// Components
import CreateCharacterTopMenu from '../../main/content/create/character/CreateCharacterTopMenu';
import CharacterGallery from './CharacterGallery';
import CharacterGalleryCreate from './CharacterGalleryCreate';
import CharacterGalleryViewer from './CharacterGalleryViewer';
import {GalleryCategory, galleryCategoryText} from './CharacterGalleryData';
import ModifyCharacterModal from './ModifyCharacterModal';
import LoadingOverlay from '@/components/create/LoadingOverlay';
import {getLocalizedLink} from '@/utils/UrlMove';
import CreateDrawerHeader from '@/components/create/CreateDrawerHeader';

interface CharacterGalleryModalProps {
  open: boolean;
  onClose: () => void;
  characterData: CharacterInfo;
  refreshCharacter: (id: number) => void;
  refreshCharacterList: () => void;
}

const CharacterGalleryModal: React.FC<CharacterGalleryModalProps> = ({
  open,
  onClose,
  characterData,
  refreshCharacter,
  refreshCharacterList,
}) => {
  const buttons = [
    {
      icon: <StarIcon />,
      text: 'Regenerate',
      onClick: () => handleRegenerateItem(),
    },
    {icon: <PreviewIcon />, text: 'View', onClick: () => handleViewItem()},
    {icon: <DeleteIcon />, text: 'Delete', onClick: () => handleDeleteItem()},
  ];

  const [selectedCategory, setSelectedCategory] = useState<GalleryCategory>(GalleryCategory.Portrait);
  const [isRegenerateOpen, setIsRegenerateOpen] = useState(false);
  const [isModifyOpen, setIsModifyOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<[GalleryCategory, number | null]>([GalleryCategory.Portrait, null]); //카테고리가 섞여 있을 가능성도 있다고 했기 때문에 번거롭지만 pair data로

  const [characterInfo, setCharacterInfo] = useState<CharacterInfo>(characterData);
  const [viewerOpen, setViewerOpen] = useState(false);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setloading] = useState(false);

  const handleOnClose = () => {
    onClose();
    setIsRegenerateOpen(false);
    setIsModifyOpen(false);
    setViewerOpen(false);
  };

  const handleRegenerateClose = () => {
    setIsRegenerateOpen(false);
  };

  const handleModifyClose = () => {
    setIsModifyOpen(false);
  };

  const handleSelectItem = (category: GalleryCategory, index: number | null) => {
    setSelectedItem([category, index]);
  };

  const handleRegenerateItem = () => {
    if (selectedItem[0] !== null && selectedItem[1] !== null && selectedItem[1] !== undefined) {
      if (selectedCategory === GalleryCategory.Portrait) setIsModifyOpen(true);
      else {
        setIsRegenerateOpen(true);
      }
    }
  };

  useEffect(() => {
    setCharacterInfo(characterData);
  }, [characterData]);

  const handleViewItem = () => {
    if (selectedCategory !== selectedItem[0] || selectedItem[1] === null || selectedItem[1] === undefined) {
      console.error('Invalid selection: ', selectedItem);
      return;
    }

    let imageUrls: {url: string; category: GalleryCategory}[] = []; // URL과 카테고리 정보를 함께 저장

    switch (selectedItem[0] as GalleryCategory) {
      case GalleryCategory.All:
        const allUrls = [
          ...(characterInfo.portraitGalleryImageUrl || []).map(img => ({
            url: img.imageUrl,
            category: GalleryCategory.Portrait,
          })),
          ...(characterInfo.poseGalleryImageUrl || []).map(img => ({
            url: img.imageUrl,
            category: GalleryCategory.Pose,
          })),
          ...(characterInfo.expressionGalleryImageUrl || []).map(img => ({
            url: img.imageUrl,
            category: GalleryCategory.Expression,
          })),
        ];

        if (allUrls[selectedItem[1]]) {
          imageUrls = allUrls;
        } else {
          console.error('URL not found for index in All category:', selectedItem[1]);
        }
        break;

      case GalleryCategory.Portrait:
        if (characterInfo.portraitGalleryImageUrl && characterInfo.portraitGalleryImageUrl[selectedItem[1]]) {
          imageUrls = characterInfo.portraitGalleryImageUrl.map(img => ({
            url: img.imageUrl,
            category: GalleryCategory.Portrait,
          }));
        } else {
          console.error('Portrait URL not found for index:', selectedItem[1]);
        }
        break;

      case GalleryCategory.Pose:
        if (characterInfo.poseGalleryImageUrl && characterInfo.poseGalleryImageUrl[selectedItem[1]]) {
          imageUrls = characterInfo.poseGalleryImageUrl.map(img => ({
            url: img.imageUrl,
            category: GalleryCategory.Pose,
          }));
        } else {
          console.error('Pose URL not found for index:', selectedItem[1]);
        }
        break;

      case GalleryCategory.Expression:
        if (characterInfo.expressionGalleryImageUrl && characterInfo.expressionGalleryImageUrl[selectedItem[1]]) {
          imageUrls = characterInfo.expressionGalleryImageUrl.map(img => ({
            url: img.imageUrl,
            category: GalleryCategory.Expression,
          }));
        } else {
          console.error('Expression URL not found for index:', selectedItem[1]);
        }
        break;

      default:
        console.error('Unknown category: ', selectedItem[0]);
        break;
    }
    if (imageUrls.length > 0) {
      setViewerOpen(true);
    } else {
      console.error('No valid URLs found for the selected category');
    }
  };

  const handleDeleteItem = async () => {
    console.log('Delete Clicked' + selectedItem[0] + '/' + selectedItem[1]);

    if (selectedItem[0] === GalleryCategory.Portrait && selectedItem[1] === 0) {
      setErrorMessage('The main portrait (index 0) cannot be deleted.');
      return;
    }

    if (selectedItem[1] !== null && selectedItem[1] !== undefined) {
      let galleryImageId = 0;

      let targetCategory: GalleryCategory | null = null;
      let adjustedIndex = selectedItem[1];

      // All 일때 해당하는 삭제 요청 받은 아이템 찾기
      if (selectedItem[0] === GalleryCategory.All) {
        const portraitLength = characterInfo.portraitGalleryImageUrl?.length || 0;
        const poseLength = characterInfo.poseGalleryImageUrl?.length || 0;

        if (adjustedIndex < portraitLength) {
          targetCategory = GalleryCategory.Portrait;
        } else if (adjustedIndex < portraitLength + poseLength) {
          targetCategory = GalleryCategory.Pose;
          adjustedIndex -= portraitLength;
        } else {
          targetCategory = GalleryCategory.Expression;
          adjustedIndex -= portraitLength + poseLength;
        }
      } else {
        targetCategory = selectedItem[0];
      }

      const selectedData = (() => {
        switch (targetCategory) {
          case GalleryCategory.Portrait:
            return characterInfo.portraitGalleryImageUrl[adjustedIndex];
          case GalleryCategory.Pose:
            return characterInfo.poseGalleryImageUrl[adjustedIndex];
          case GalleryCategory.Expression:
            return characterInfo.expressionGalleryImageUrl[adjustedIndex];
          default:
            return null;
        }
      })();

      if (selectedData) {
        galleryImageId = selectedData.galleryImageId;

        const req: DeleteGalleryReq = {
          galleryImageId: galleryImageId,
        };

        const response = await sendDeleteGallery(req);
        setloading(true);
        if (response.data) {
          console.log('Image deleted successfully:', galleryImageId);

          // 삭제 후 데이터 갱신
          refreshCharacter(characterInfo.id);

          // 삭제 후 selectedItem 업데이트
          const currentCategoryUrls = (() => {
            switch (targetCategory) {
              case GalleryCategory.Portrait:
                return characterInfo.portraitGalleryImageUrl;
              case GalleryCategory.Pose:
                return characterInfo.poseGalleryImageUrl;
              case GalleryCategory.Expression:
                return characterInfo.expressionGalleryImageUrl;
              default:
                return [];
            }
          })();

          const newLength = currentCategoryUrls.length - 1; // 삭제된 후 길이
          if (newLength === 0) {
            // 해당 카테고리가 비어있으면 viewer를 close
            setViewerOpen(false);
          } else {
            // 마지막 항목이면 selectedItem을 이전 인덱스로 설정
            setSelectedItem([selectedItem[0], Math.min(selectedItem[1], newLength - 1)]);
          }
        } else {
          console.error('Failed to delete image with ID:', galleryImageId);
        }
      } else {
        console.error('Failed to delete image: Selected data is invalid');
      }
    } else {
      console.error('Selected item is invalid:', selectedItem);
    }
    setloading(false);
  };

  const handleImageSelect = (category: GalleryCategory, index: number) => {
    setSelectedItem([category, index]);
  };

  function getSelectedImageData(): GalleryImageInfo | undefined {
    if (selectedItem[1] === null || selectedItem[1] === undefined) {
      return undefined; // 선택되지 않은 경우 처리
    }

    switch (selectedItem[0]) {
      case GalleryCategory.All:
        return characterInfo.portraitGalleryImageUrl[selectedItem[1]];

      case GalleryCategory.Portrait:
        return characterInfo.portraitGalleryImageUrl[selectedItem[1]];

      case GalleryCategory.Pose:
        return characterInfo.poseGalleryImageUrl[selectedItem[1]];

      case GalleryCategory.Expression:
        return characterInfo.expressionGalleryImageUrl[selectedItem[1]];

      default:
        console.error(`Unknown category: ${selectedItem[0]}`);
        return undefined;
    }
  }

  const handleOnBackButtonClick = () => {
    if (isRegenerateOpen) {
      handleRegenerateClose();
    } else if (isModifyOpen) {
      handleModifyClose();
    } else if (viewerOpen) {
    } else {
      onClose();
    }
  };

  return (
    <Drawer anchor="bottom" open={open} onClose={handleOnClose}>
      <div className={styles.modalContent}>
        <div className={styles.container}>
          <CreateDrawerHeader
            title={`${characterInfo.name} 's ${galleryCategoryText[selectedCategory]}`}
            onClose={handleOnBackButtonClick}
          />
          {isRegenerateOpen ? (
            <>
              <CharacterGalleryCreate
                open={isRegenerateOpen}
                onClose={handleRegenerateClose}
                category={selectedCategory}
                characterInfo={characterInfo}
              />
            </>
          ) : isModifyOpen ? (
            <>
              <ModifyCharacterModal
                open={isModifyOpen}
                onClose={handleModifyClose}
                isModify={isModifyOpen}
                characterInfo={characterInfo}
                refreshCharacterList={refreshCharacterList}
              />
            </>
          ) : viewerOpen ? (
            <CharacterGalleryViewer
              characterInfo={characterInfo}
              selectedIndex={selectedItem[1]}
              categoryType={selectedCategory}
              onBack={() => setViewerOpen(false)}
              onThumbnail={() => console.log('Thumbnail clicked')}
              onInfo={() => console.log('Info clicked')}
              onDelete={handleDeleteItem}
              onSelectImage={handleImageSelect}
              onRefresh={refreshCharacterList}
            />
          ) : (
            <>
              <CharacterGallery
                characterInfo={characterInfo}
                onCategorySelected={setSelectedCategory}
                onCurrentSelected={handleSelectItem}
                onGenerateSelected={handleRegenerateItem}
                refreshCharacter={refreshCharacter}
                initialSelectedItem={selectedItem}
              />
              {/* <div className={styles.footer}>
                {buttons.map((button, index) => (
                  <Button key={index} className={styles.button} startIcon={button.icon} onClick={button.onClick}>
                    <Typography>{button.text}</Typography>
                  </Button>
                ))}
              </div> */}
            </>
          )}
        </div>

        <Snackbar
          open={!!errorMessage}
          autoHideDuration={6000}
          onClose={() => setErrorMessage(null)}
          anchorOrigin={{vertical: 'top', horizontal: 'center'}}
        >
          <Alert onClose={() => setErrorMessage(null)} severity="error" sx={{width: '100%'}}>
            {errorMessage}
          </Alert>
        </Snackbar>
        <LoadingOverlay loading={loading} />
      </div>
    </Drawer>
  );
};

export default CharacterGalleryModal;
