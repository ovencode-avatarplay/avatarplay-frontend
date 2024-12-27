import React, {useEffect, useState} from 'react';
import {Modal, Box} from '@mui/material';
import styles from './ModifyCharacterModal.module.css';
import CreateCharacterTopMenu from '../../main/content/create/character/CreateCharacterTopMenu';
import CharacterCreate from '../../main/content/create/character/CreateCharacterSequence';
import PublishCharacter from '../../main/content/create/character/PublishCharacter';
import {CharacterInfo} from '@/redux-store/slices/EpisodeInfo';
import PublishCharacterBottom from '../../main/content/create/character/PublishCharacterBottom';
import {getLocaleUrl} from '@/configs/i18n';
import {getLocalizedLink} from '@/utils/UrlMove';

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
    <Modal open={open} onClose={onClose}>
      <Box className={styles.modalContent}>
        <CreateCharacterTopMenu
          backButtonAction={handleCloseClick}
          lastUrl={getLocalizedLink('/lang/studio/Character')}
          contentTitle={isModify ? 'Modify Character' : 'Create Character'}
          blockStudioButton={true}
        />
        {isModifying ? (
          <CharacterCreate
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

            <Box className={styles.buttonContainer}>
              <PublishCharacterBottom
                onPrevClick={handlePrevClick}
                onPublishClick={() => {
                  setPublishClick(true);
                }}
              />
            </Box>
          </div>
        ) : (
          <div>character is not available</div>
        )}
      </Box>
    </Modal>
  );
};

export default ModifyCharacterModal;
