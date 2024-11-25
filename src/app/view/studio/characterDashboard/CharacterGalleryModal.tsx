import React, {useEffect, useState} from 'react';
import {Modal, Box, Button, Typography} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import PreviewIcon from '@mui/icons-material/Preview';
import DeleteIcon from '@mui/icons-material/Delete';
import styles from './CharacterGalleryModal.module.css';
import CreateCharacterTopMenu from '../../main/content/create/character/CreateCharacterTopMenu';
import {CharacterInfo} from '@/redux-store/slices/EpisodeInfo';
import CharacterGallery from './CharacterGallery';
import CharacterGalleryCreateSlide from './CharacterGalleryCreateSlide';
import FullViewImage, {FullViewImageData} from '@/components/layout/shared/FullViewImage';
import CharacterCreate from '../../main/content/create/character/CreateCharacterSequence';

interface CharacterGalleryModalProps {
  open: boolean;
  onClose: () => void;
  characterData: CharacterInfo;
  updateCharacter: (newinfo: CharacterInfo) => void;
}

const CharacterGalleryModal: React.FC<CharacterGalleryModalProps> = ({
  open,
  onClose,
  characterData,
  updateCharacter,
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

  useEffect(() => {
    setCharacterInfo(characterData);
  }, [characterData]);

  const [isRegenerateOpen, setIsRegenerateOpen] = useState(false);
  const [isModifyOpen, setIsModifyOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<[string, number | null]>(['Portrait', null]); //카테고리가 섞여 있을 가능성도 있다고 했기 때문에 번거롭지만 pair data로
  const [selectedCategory, setSelectedCategory] = useState<string>('Portrait');

  const [characterInfo, setCharacterInfo] = useState<CharacterInfo>(characterData);

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

  const handleSelectItem = (category: string, index: number | null) => {
    setSelectedItem([category, index]);
  };

  const handleRegenerateItem = () => {
    if (!selectedItem[0] || selectedItem[1] === null || selectedItem[1] === undefined) {
      if (selectedCategory === 'Portrait') setIsModifyOpen(true);
      else {
        setIsRegenerateOpen(true);
      }
    } else {
    }
  };

  const handleViewItem = () => {
    if (!selectedItem[0] || selectedItem[1] === null || selectedItem[1] === undefined) {
      console.error('Invalid selection: ', selectedItem);
      return;
    }

    let imageData: FullViewImageData = {url: '', parameter: ''};

    switch (selectedItem[0]) {
      case 'Portrait':
        if (characterInfo.portraitGalleryImageUrl && characterInfo.portraitGalleryImageUrl[selectedItem[1]]) {
          imageData.url = characterInfo.portraitGalleryImageUrl[selectedItem[1]];
          imageData.parameter = `${selectedItem[1]}`;
        } else {
          console.error('Portrait URL not found for index:', selectedItem[1]);
        }
        break;

      case 'Poses':
        if (characterInfo.poseGalleryImageUrl && characterInfo.poseGalleryImageUrl[selectedItem[1]]) {
          imageData.url = characterInfo.poseGalleryImageUrl[selectedItem[1]];
          imageData.parameter = `${selectedItem[1]}`;
        } else {
          console.error('Pose URL not found for index:', selectedItem[1]);
        }
        break;

      case 'Expression':
        if (characterInfo.expressionGalleryImageUrl && characterInfo.expressionGalleryImageUrl[selectedItem[1]]) {
          imageData.url = characterInfo.expressionGalleryImageUrl[selectedItem[1]];
          imageData.parameter = `${selectedItem[1]}`;
        } else {
          console.error('Expression URL not found for index:', selectedItem[1]);
        }
        break;

      default:
        console.error('Unknown category: ', selectedItem[0]);
        break;
    }

    if (imageData.url) {
      setFullscreenImage(imageData);
      console.log(`View Clicked: ${selectedItem[0]} / ${selectedItem[1]}`);
    } else {
      console.error('Failed to set fullscreen image: No valid URL.');
    }
  };

  const handleDeleteItem = () => {
    console.log('Delete Clicked' + selectedItem[0] + '/' + selectedItem[1]);
  };

  const [fullscreenImage, setFullscreenImage] = useState<FullViewImageData | null>(null); // Add fullscreen image state

  return (
    <Modal open={open} onClose={handleOnClose}>
      <Box className={styles.modalContent}>
        <Box className={styles.container}>
          {isRegenerateOpen ? (
            <>
              <CreateCharacterTopMenu
                backButtonAction={handleRegenerateClose}
                lastUrl=":/lang/studio/Character"
                contentTitle={`${characterInfo.name}'s generate`}
                blockStudioButton={true}
              />
              <CharacterGalleryCreateSlide
                open={isRegenerateOpen}
                onClose={handleRegenerateClose}
                category={characterInfo.name}
              />
            </>
          ) : isModifyOpen ? (
            <>
              <CreateCharacterTopMenu
                backButtonAction={handleModifyClose}
                lastUrl=":/lang/studio/Character"
                contentTitle={'Modify Character'}
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
                updateCharacter={updateCharacter}
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
        {fullscreenImage && (
          <FullViewImage
            imageData={fullscreenImage}
            onClick={() => {
              setFullscreenImage(null);
            }}
          />
        )}
      </Box>
    </Modal>
  );
};

export default CharacterGalleryModal;
