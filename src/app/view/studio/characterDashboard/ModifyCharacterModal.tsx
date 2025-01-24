import React, {useEffect, useState} from 'react';
import {Box, Drawer} from '@mui/material';
import styles from './ModifyCharacterModal.module.css';
import CharacterCreateSequence from '../../main/content/create/character/CreateCharacterSequence';
import PublishCharacter from '../../main/content/create/character/PublishCharacter';
import {CharacterInfo} from '@/redux-store/slices/ContentInfo';
import PublishCharacterBottom from '../../main/content/create/character/PublishCharacterBottom';
import CreateDrawerHeader from '@/components/create/CreateDrawerHeader';

interface ModifyCharacterProps {
  open: boolean;
  onClose: () => void;
  isModify: boolean;
  characterInfo: CharacterInfo | undefined;
  refreshCharacterList: () => void;
}

const ModifyCharacterModal: React.FC<ModifyCharacterProps> = ({
  open,
  onClose,
  isModify,
  characterInfo,
  refreshCharacterList,
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

        {isModifying ? (
          <CharacterCreateSequence
            closeAction={handleCloseClick}
            isModify={isModify}
            characterInfo={characterInfo}
            publishFinishAction={handlePublishFinishAction}
          />
        ) : characterInfo ? (
          <div className={styles.createBox}>
            <PublishCharacter
              characterInfo={characterInfo}
              publishRequested={publishReqested}
              publishRequestedAction={() => {
                setPublishClick(false);
                setPublishReqested(false);
              }}
              debugparam={''}
              publishFinishAction={handlePublishFinishAction}
            />

            <div className={styles.buttonContainer}>
              <PublishCharacterBottom
                onPrevClick={handlePrevClick}
                onPublishClick={() => {
                  setPublishClick(true);
                }}
              />
            </div>
          </div>
        ) : (
          <div>character is not available</div>
        )}
      </div>
    </Drawer>
  );
};

export default ModifyCharacterModal;
