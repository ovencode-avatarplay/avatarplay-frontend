import React, {useEffect, useState} from 'react';

// mui, css
import {Snackbar, Alert, Drawer} from '@mui/material';
import styles from './CharacterGalleryModal.module.css';

// redux
import {CharacterInfo} from '@/redux-store/slices/StoryInfo';

// Network
import {
  DeleteGalleryReq,
  GalleryImageInfo,
  SaveGalleryReq,
  sendDeleteGallery,
  sendSaveGallery,
} from '@/app/NetWork/CharacterNetwork';

// Components
import CharacterGallery from './CharacterGallery';
import CharacterGalleryCreate from './CharacterGalleryCreate';
import CharacterGalleryViewer from './CharacterGalleryViewer';
import {GalleryCategory, galleryCategoryText} from './CharacterGalleryData';
import ModifyCharacterModal from './ModifyCharacterModal';
import LoadingOverlay from '@/components/create/LoadingOverlay';
import CreateDrawerHeader from '@/components/create/CreateDrawerHeader';
import CustomPopup from '@/components/layout/shared/CustomPopup';

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
  const [selectedCategory, setSelectedCategory] = useState<GalleryCategory>(GalleryCategory.Portrait);
  const [isRegenerateOpen, setIsRegenerateOpen] = useState(false);
  const [isModifyOpen, setIsModifyOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<[GalleryCategory, number | null]>([GalleryCategory.Portrait, null]); //카테고리가 섞여 있을 가능성도 있다고 했기 때문에 번거롭지만 pair data로

  const [characterInfo, setCharacterInfo] = useState<CharacterInfo>(characterData);
  const [viewerOpen, setViewerOpen] = useState(false);

  const [selectedPortrait, setSelectedPortrait] = useState<string>(characterInfo.mainImageUrl);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setloading] = useState(false);

  const [popupOpen, setPopupOpen] = useState(false);

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

  // const handleSelectItem = (category: GalleryCategory, index: number | null) => {
  //   if (category === GalleryCategory.Portrait && index !== null) {
  //     setSelectedPortrait(characterData.portraitGalleryImageUrl[index].imageUrl);
  //   }
  //   setSelectedItem([category, index]);
  // };

  useEffect(() => {
    console.log(characterData.mainImageUrl);
    setSelectedPortrait(characterData.mainImageUrl);
  }, [characterData, characterData.mainImageUrl]);

  const handleRegenerateItem = () => {
    if (selectedCategory === GalleryCategory.Portrait) setIsModifyOpen(true);
    else {
      setIsRegenerateOpen(true);
    }
  };

  // 이미지들을 갤러리로 업로드 함
  const handleUploadImages = async (category: GalleryCategory, urls: string[], parameter: string = '') => {
    try {
      const targetCategory = category;

      if (!targetCategory) {
        console.error('Target category is not selected.');
        return;
      }
      let updatedGalleryUrls: string[] = [];
      updatedGalleryUrls = urls;

      const saveReq: SaveGalleryReq = {
        characterId: characterInfo.id,
        galleryType: targetCategory,
        galleryImageUrls: updatedGalleryUrls,
        debugParameter: parameter,
      };

      const responseGallery = await sendSaveGallery(saveReq);

      console.log('save gallery success' + responseGallery.resultCode);
      refreshCharacter(characterInfo.id);
      setIsRegenerateOpen(false);
    } catch (error) {
      console.error('Error uploading images:', error);
    }
  };

  const handleViewItem = (category: GalleryCategory, index: number | null) => {
    if (index === null) {
      console.error('Invalid selection: ', selectedItem);
      return;
    }

    setSelectedItem([category, index]);

    let imageUrls: {url: string; category: GalleryCategory}[] = []; // URL과 카테고리 정보를 함께 저장

    switch (category) {
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

        if (allUrls[index]) {
          imageUrls = allUrls;
        } else {
          console.error('URL not found for index in All category:', selectedItem[1]);
        }
        break;

      case GalleryCategory.Portrait:
        if (characterInfo.portraitGalleryImageUrl && characterInfo.portraitGalleryImageUrl[index]) {
          imageUrls = characterInfo.portraitGalleryImageUrl.map(img => ({
            url: img.imageUrl,
            category: GalleryCategory.Portrait,
          }));
        } else {
          console.error('Portrait URL not found for index:', selectedItem[1]);
        }
        break;

      case GalleryCategory.Pose:
        if (characterInfo.poseGalleryImageUrl && characterInfo.poseGalleryImageUrl[index]) {
          imageUrls = characterInfo.poseGalleryImageUrl.map(img => ({
            url: img.imageUrl,
            category: GalleryCategory.Pose,
          }));
        } else {
          console.error('Pose URL not found for index:', selectedItem[1]);
        }
        break;

      case GalleryCategory.Expression:
        if (characterInfo.expressionGalleryImageUrl && characterInfo.expressionGalleryImageUrl[index]) {
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

  const handleDeleteClick = () => {
    setPopupOpen(true);
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
    setPopupOpen(false);
  };

  const handleImageSelect = (category: GalleryCategory, index: number) => {
    setSelectedItem([category, index]);
  };

  const handleOnBackButtonClick = () => {
    if (isRegenerateOpen) {
      handleRegenerateClose();
    } else if (isModifyOpen) {
      handleModifyClose();
    } else if (viewerOpen) {
      // empty
    } else {
      onClose();
    }
  };

  useEffect(() => {
    setCharacterInfo(characterData);
    setSelectedPortrait(characterData.mainImageUrl);
  }, [characterData]);

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

  const handleRefreshCharacter = () => {
    refreshCharacterList();
    refreshCharacter(characterInfo.id);
  };

  return (
    <Drawer
      PaperProps={{
        sx: {
          background: 'var(--White, #FFF)',
          overflow: 'hidden',
          bottom: '0px',
          width: 'var(--full-width)',
          margin: '0 auto',
        },
      }}
      anchor="bottom"
      open={open}
      onClose={handleOnClose}
    >
      <div className={styles.modalContent}>
        <div className={styles.container}>
          {!viewerOpen && (
            <CreateDrawerHeader
              title={`${characterInfo.name} 's ${galleryCategoryText[selectedCategory]}`}
              onClose={handleOnBackButtonClick}
            />
          )}
          {isRegenerateOpen ? (
            <>
              <CharacterGalleryCreate
                open={isRegenerateOpen}
                onClose={handleRegenerateClose}
                category={selectedCategory}
                // characterInfo={characterInfo}
                selectedPortraitUrl={selectedPortrait}
                onUploadGalleryImages={handleUploadImages}
              />
            </>
          ) : isModifyOpen ? (
            <>
              <ModifyCharacterModal
                open={isModifyOpen}
                onClose={handleModifyClose}
                isModify={isModifyOpen}
                characterInfo={characterInfo}
                refreshCharacterList={handleRefreshCharacter}
              />
            </>
          ) : viewerOpen ? (
            <CharacterGalleryViewer
              characterInfo={characterInfo}
              selectedIndex={selectedItem[1]}
              categoryType={selectedCategory}
              onBack={() => setViewerOpen(false)}
              onDelete={handleDeleteClick}
              onSelectImage={handleImageSelect}
              onRefresh={handleRefreshCharacter}
            />
          ) : (
            <>
              <CharacterGallery
                characterInfo={characterInfo}
                onCategorySelected={setSelectedCategory}
                // onCurrentSelected={handleSelectItem}
                onCurrentSelected={handleViewItem}
                onGenerateSelected={handleRegenerateItem}
                refreshCharacter={refreshCharacter}
                initialSelectedItem={selectedItem}
                selectedGalleryType={selectedCategory}
                setSelectedGalleryType={setSelectedCategory}
                hideSelected={true}
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
        {popupOpen && (
          <CustomPopup
            type="alert"
            title="Are you sure?"
            description="Delete item is irreversible"
            buttons={[
              {
                label: 'Cancel',
                onClick: () => {
                  setPopupOpen(false);
                },
                isPrimary: false,
              },
              {
                label: 'Delete',
                onClick: handleDeleteItem,
                isPrimary: true,
              },
            ]}
          />
        )}
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
