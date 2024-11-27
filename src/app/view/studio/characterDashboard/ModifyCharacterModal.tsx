import React from 'react';
import {Modal, Box, Backdrop} from '@mui/material';
import styles from './ModifyCharacterModal.module.css';
import CreateCharacterTopMenu from '../../main/content/create/character/CreateCharacterTopMenu';
import CharacterCreate from '../../main/content/create/character/CreateCharacterSequence';

interface ModifyCharacterProps {
  open: boolean;
  onClose: () => void;
  isModify: boolean;
}

const ModifyCharacterModal: React.FC<ModifyCharacterProps> = ({open, onClose, isModify}) => {
  return (
    <Modal open={open} onClose={onClose}>
      <Box className={styles.modalContent}>
        <CreateCharacterTopMenu
          backButtonAction={onClose}
          lastUrl=":/lang/studio/Character"
          contentTitle={isModify ? 'Modify Character' : 'Create Character'}
          blockStudioButton={true}
        />
        <CharacterCreate closeAction={onClose} isModify={isModify} />
      </Box>
    </Modal>
  );
};

export default ModifyCharacterModal;
