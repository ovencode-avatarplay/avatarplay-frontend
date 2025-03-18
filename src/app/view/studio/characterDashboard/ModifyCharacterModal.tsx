import React, {useEffect, useState} from 'react';
import {Drawer} from '@mui/material';
import styles from './ModifyCharacterModal.module.css';
import {CharacterInfo} from '@/redux-store/slices/StoryInfo';
import CreateDrawerHeader from '@/components/create/CreateDrawerHeader';
import CreateCharacterMain from '../../main/content/create/character/CreateCharacterMain';

interface ModifyCharacterProps {
  open: boolean;
  onClose: () => void;
  isModify: boolean;
  characterInfo: CharacterInfo | undefined;
  refreshCharacterList: () => void;
  onDelete?: () => void;
}

const ModifyCharacterModal: React.FC<ModifyCharacterProps> = ({
  open,
  onClose,
  isModify,
  characterInfo,
  refreshCharacterList,
  onDelete,
}) => {
  const [isModifying, setIsModifying] = useState(false);

  const [publishClick, setPublishClick] = useState(Boolean);
  const [publishReqested, setPublishReqested] = useState(Boolean);

  const handlePrevClick = () => {
    setIsModifying(true);
  };

  const handleCloseClick = () => {
    if (isModifying) {
      setIsModifying(false);
    } else {
      onClose();
    }
  };

  const handlePublishFinishAction = () => {
    setIsModifying(false);
    onClose();
    refreshCharacterList();
  };

  useEffect(() => {
    if (publishClick) {
      setPublishReqested(true);
    }
  }, [publishClick]);

  return (
    <Drawer anchor="bottom" open={open} onClose={onClose}>
      <div className={styles.drawerContent}>
        <CreateDrawerHeader title="Modify Character" onClose={onClose} />

        <CreateCharacterMain characterInfo={characterInfo} onClose={handleCloseClick} />
      </div>
    </Drawer>
  );
};

export default ModifyCharacterModal;
