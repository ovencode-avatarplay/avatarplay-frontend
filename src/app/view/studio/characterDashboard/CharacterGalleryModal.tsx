import React, {useState} from 'react';
import {Modal, Box, Button, Typography} from '@mui/material';
import StarIcon from '@mui/icons-material/Star';
import styles from './CharacterGalleryModal.module.css';
import CreateCharacterTopMenu from '../../main/content/create/character/CreateCharacterTopMenu';
import {CharacterInfo} from '@/redux-store/slices/EpisodeInfo';
import CharacterGallery from './CharacterGallery';
import CharacterGalleryCreateSlide from './CharacterGalleryCreateSlide';

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
      onClick: () => {
        setIsDrawerOpen(true);
      },
    },
    {icon: <StarIcon />, text: 'View', onClick: () => console.log('View Clicked')},
    {icon: <StarIcon />, text: 'Delete', onClick: () => console.log('Delete Clicked')},
  ];

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleDrawerClose = () => {
    setIsDrawerOpen(false);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box className={styles.modalContent}>
        <Box className={styles.container}>
          {isDrawerOpen ? (
            <>
              <CreateCharacterTopMenu
                backButtonAction={handleDrawerClose}
                lastUrl=":/lang/studio/Character"
                contentTitle={`${characterData.name}'s generate`}
                blockStudioButton={true}
              />
              <CharacterGalleryCreateSlide
                open={isDrawerOpen}
                onClose={handleDrawerClose}
                category={characterData.name}
              />
            </>
          ) : (
            <>
              <CreateCharacterTopMenu
                backButtonAction={onClose}
                lastUrl=":/lang/studio/Character"
                contentTitle={`${characterData.name}'s Gallery`}
                blockStudioButton={true}
              />
              <CharacterGallery characterInfo={characterData} />
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
      </Box>
    </Modal>
  );
};

export default CharacterGalleryModal;
