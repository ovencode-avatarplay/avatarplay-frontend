import React, {useEffect, useState} from 'react';

// mui, css
import {Modal, Box, Button, Typography, Snackbar, Alert} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import PreviewIcon from '@mui/icons-material/Preview';
import DeleteIcon from '@mui/icons-material/Delete';
import styles from './CharacterGalleryModal.module.css';

// redux
import {CharacterInfo} from '@/redux-store/slices/EpisodeInfo';

// Network
import {DeleteGalleryReq, sendDeleteGallery} from '@/app/NetWork/CharacterNetwork';

// Components
import CreateCharacterTopMenu from '../../main/content/create/character/CreateCharacterTopMenu';
import CharacterGallery from './CharacterGallery';
import CharacterGalleryCreate from './CharacterGalleryCreate';
import CharacterCreate from '../../main/content/create/character/CreateCharacterSequence';
import CharacterGalleryViewer from './CharacterGalleryViewer';
import {GalleryCategory, galleryCategoryText} from './CharacterGalleryData';

interface CharacterGalleryModalProps {
  open: boolean;
  onClose: () => void;
  characterData: CharacterInfo;
  refreshCharacter: (id: number) => void;
}

const CharacterGalleryModal: React.FC<CharacterGalleryModalProps> = ({
  open,
  onClose,
  characterData,
  refreshCharacter,
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
  const [viewerImages, setViewerImages] = useState<string[]>([]);

  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleOnClose = () => {
    onClose();
    setIsRegenerateOpen(false);
    setIsModifyOpen(false);
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
    if (!selectedItem[0] || selectedItem[1] === null || selectedItem[1] === undefined) {
    } else {
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
    if (!selectedItem[0] || selectedItem[1] === null || selectedItem[1] === undefined) {
      console.error('Invalid selection: ', selectedItem);
      return;
    }

    let imageUrls: string[] = [];

    switch (selectedItem[0] as GalleryCategory) {
      case GalleryCategory.All:
        const allUrls = [
          ...(characterInfo.portraitGalleryImageUrl || []),
          ...(characterInfo.poseGalleryImageUrl || []),
          ...(characterInfo.expressionGalleryImageUrl || []),
        ];
        if (allUrls[selectedItem[1]]) {
          imageUrls = allUrls.map(img => img.imageUrl) || [];
        } else {
          console.error('URL not found for index in All category:', selectedItem[1]);
        }
        break;

      case GalleryCategory.Portrait:
        if (characterInfo.portraitGalleryImageUrl && characterInfo.portraitGalleryImageUrl[selectedItem[1]]) {
          imageUrls = characterInfo.portraitGalleryImageUrl.map(img => img.imageUrl) || [];
        } else {
          console.error('Portrait URL not found for index:', selectedItem[1]);
        }
        break;

      case GalleryCategory.Pose:
        if (characterInfo.poseGalleryImageUrl && characterInfo.poseGalleryImageUrl[selectedItem[1]]) {
          imageUrls = characterInfo.poseGalleryImageUrl.map(img => img.imageUrl) || [];
        } else {
          console.error('Pose URL not found for index:', selectedItem[1]);
        }
        break;

      case GalleryCategory.Expression:
        if (characterInfo.expressionGalleryImageUrl && characterInfo.expressionGalleryImageUrl[selectedItem[1]]) {
          imageUrls = characterInfo.expressionGalleryImageUrl.map(img => img.imageUrl) || [];
        } else {
          console.error('Expression URL not found for index:', selectedItem[1]);
        }
        break;

      default:
        console.error('Unknown category: ', selectedItem[0]);
        break;
    }

    if (imageUrls.length > 0) {
      setViewerImages(imageUrls);
      setViewerOpen(true);
    } else {
      console.error('No valid URLs found for the selected category');
    }
  };

  const handleDeleteItem = async () => {
    console.log('Delete Clicked' + selectedItem[0] + '/' + selectedItem[1]);

    if (selectedItem[0] === GalleryCategory.Portrait && selectedItem[1] === 0) {
      setErrorMessage('The main portrait (index 0) cannot be deleted.');
    }
    if (selectedItem[1]) {
      let galleryImageId = 0;
      switch (selectedItem[0]) {
        case GalleryCategory.All:
          break;
        case GalleryCategory.Portrait:
          galleryImageId = characterInfo.portraitGalleryImageUrl[selectedItem[1]].galleryImageId;
          break;
        case GalleryCategory.Pose:
          galleryImageId = characterInfo.poseGalleryImageUrl[selectedItem[1]].galleryImageId;
          break;
        case GalleryCategory.Expression:
          galleryImageId = characterInfo.expressionGalleryImageUrl[selectedItem[1]].galleryImageId;
          break;
      }

      const req: DeleteGalleryReq = {
        galleryImageId: galleryImageId,
      };

      const response = await sendDeleteGallery(req);

      if (response.data) {
        console.log('Image deleted successfully:', galleryImageId);

        // 삭제 후 데이터 갱신
        refreshCharacter(characterInfo.id);
      } else {
        console.error('Failed to delete image with ID:', galleryImageId);
      }
    } else {
      console.error('Selected item is invalid:', selectedItem);
    }
  };

  return (
    <Modal open={open} onClose={handleOnClose}>
      <Box className={styles.modalContent}>
        {!viewerOpen && (
          <Box className={styles.container}>
            {isRegenerateOpen ? (
              <>
                <CreateCharacterTopMenu
                  backButtonAction={handleRegenerateClose}
                  lastUrl=":/lang/studio/Character"
                  contentTitle={`${characterInfo.name} 's ${galleryCategoryText[selectedCategory]} Creation`}
                  blockStudioButton={true}
                />
                <CharacterGalleryCreate
                  open={isRegenerateOpen}
                  onClose={handleRegenerateClose}
                  category={selectedCategory}
                  characterInfo={characterInfo}
                />
              </>
            ) : isModifyOpen ? (
              <>
                <CreateCharacterTopMenu
                  backButtonAction={handleModifyClose}
                  lastUrl=":/lang/studio/Character"
                  contentTitle={`Modify ${characterInfo.name}`}
                  blockStudioButton={true}
                />
                <CharacterCreate closeAction={handleModifyClose} isModify={true} />
              </>
            ) : (
              <>
                <CreateCharacterTopMenu
                  backButtonAction={onClose}
                  lastUrl=":/lang/studio/Character"
                  contentTitle={`${characterInfo.name}'s Gallery`}
                  blockStudioButton={true}
                />
                <CharacterGallery
                  characterInfo={characterInfo}
                  onCategorySelected={setSelectedCategory}
                  onCurrentSelected={handleSelectItem}
                  onGenerateSelected={handleRegenerateItem}
                  refreshCharacter={refreshCharacter}
                />
                <div className={styles.footer}>
                  {buttons.map((button, index) => (
                    <Button key={index} className={styles.button} startIcon={button.icon} onClick={button.onClick}>
                      <Typography>{button.text}</Typography>
                    </Button>
                  ))}
                </div>
              </>
            )}
          </Box>
        )}

        {/* Viewer */}
        {viewerOpen && (
          <CharacterGalleryViewer
            imageUrls={viewerImages}
            categoryType={galleryCategoryText[selectedCategory]}
            onBack={() => setViewerOpen(false)}
            onShare={() => console.log('Share clicked')}
            onThumbnail={() => console.log('Thumbnail clicked')}
            onInfo={() => console.log('Info clicked')}
            onDelete={() => console.log('Delete clicked')}
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
      </Box>
    </Modal>
  );
};

export default CharacterGalleryModal;
