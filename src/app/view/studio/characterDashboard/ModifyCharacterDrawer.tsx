import React from 'react';
import {Drawer, Box} from '@mui/material';
import styles from './ModifyCharacterDrawer.module.css';
import CreateCharacterTopMenu from '../../main/content/create/character/CreateCharacterTopMenu';
import CharacterCreate from '../../main/content/create/character/CreateCharacterSequence';

interface ModifyCharacterProps {
  open: boolean;
  onClose: () => void;
  isModify: boolean;
}

const ModifyCharacterDrawer: React.FC<ModifyCharacterProps> = ({open, onClose, isModify}) => {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {width: '100vw', maxWidth: '500px', height: '100vh'},
      }}
    >
      <Box className={styles.characterMain}>
        <CreateCharacterTopMenu
          backButtonAction={onClose}
          contentTitle={isModify ? 'Modify Character' : 'Create Character'}
        />
        <CharacterCreate closeAction={onClose} isModify={isModify} />
      </Box>
    </Drawer>
  );
};

export default ModifyCharacterDrawer;
