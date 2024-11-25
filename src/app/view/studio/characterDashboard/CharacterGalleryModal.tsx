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
}

const CharacterGalleryModal: React.FC<CharacterGalleryModalProps> = ({open, onClose, characterData}) => {
  const buttons = [
    {
      icon: <StarIcon />,
      text: 'Regenerate',
      onClick: () => handleRegenerateItem(),
    },
    {icon: <PreviewIcon />, text: 'View', onClick: () => handleViewItem()},
    {icon: <DeleteIcon />, text: 'Delete', onClick: () => handleDeleteItem()},
  ];

  // const tmpPortraitUrl = [
  //   'https://avatar-play.s3.ap-northeast-2.amazonaws.com/image/cb8ddc8c-fa68-4f49-a366-7f8c6ad49122.jpg',
  //   'https://avatar-play.s3.ap-northeast-2.amazonaws.com/image/952d5dc6-7e03-4f41-bce2-b9e75f998e90.jpeg',
  //   'https://avatar-play.s3.ap-northeast-2.amazonaws.com/image/9375e557-2c4d-47c8-b148-b6686848e54f.jfif',
  //   'https://avatar-play.s3.ap-northeast-2.amazonaws.com/image/cb8ddc8c-fa68-4f49-a366-7f8c6ad49122.jpg',
  //   'https://avatar-play.s3.ap-northeast-2.amazonaws.com/image/cb8ddc8c-fa68-4f49-a366-7f8c6ad49122.jpg',
  //   'https://avatar-play.s3.ap-northeast-2.amazonaws.com/image/cb8ddc8c-fa68-4f49-a366-7f8c6ad49122.jpg',
  //   'https://avatar-play.s3.ap-northeast-2.amazonaws.com/image/cb8ddc8c-fa68-4f49-a366-7f8c6ad49122.jpg',
  // ];

  // const tmpPoseUrl = [
  //   'https://avatar-play.s3.ap-northeast-2.amazonaws.com/image/840fbf94-d337-4e82-9a19-31f19ad41022.png',
  //   'https://avatar-play.s3.ap-northeast-2.amazonaws.com/image/edf6157d-ac7e-4360-8691-f28dfd75c0c0.png',
  // ];

  // const tmpExpressionUrl: string[] = [];

  useEffect(() => {
    setCharacterInfo(characterData);
    // characterData.portraitGalleryImageUrl = tmpPortraitUrl;
    // characterData.poseGalleryImageUrl = tmpPoseUrl;
    // characterData.expressionGalleryImageUrl = tmpExpressionUrl;
  }, [characterData]);

  const [isRegenerateOpen, setIsRegenerateOpen] = useState(false);
  const [isModifyOpen, setIsModifyOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<[string, number | null]>(['Portrait', null]);

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
    if (
      (!selectedItem[0] || selectedItem[1] === null || selectedItem[1] === undefined) &&
      selectedItem[0] === 'Portrait'
    ) {
      setIsModifyOpen(true);
    } else {
      setIsRegenerateOpen(true);
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
              <CharacterGallery characterInfo={characterInfo} onCurrentSelected={handleSelectItem} />
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
