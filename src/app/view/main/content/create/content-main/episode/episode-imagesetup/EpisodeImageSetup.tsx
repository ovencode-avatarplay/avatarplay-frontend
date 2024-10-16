// modal

import {Button, Dialog, DialogTitle} from '@mui/material';
import styles from './EpisodeImageSetup.module.css';
import React from 'react';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import CharacterCreate from './CharacterCreate';

interface EpisodeImageSetupProps {
  open: boolean;
  onClose: () => void;
}

const EpisodeImageSetup: React.FC<EpisodeImageSetupProps> = ({open, onClose}) => {
  return (
    <>
      <Dialog
        closeAfterTransition={false}
        open={open}
        onClose={onClose}
        fullScreen
        classes={{paper: styles['modal-body']}}
        disableAutoFocus={true}
        disableEnforceFocus={true} // disableEnforceFocus 속성 사용
      >
        <DialogTitle className={styles['modal-header']}>
          <Button onClick={onClose} className={styles['close-button']}>
            <ArrowBackIosIcon />
          </Button>
          <span className={styles['modal-title']}>EpisodeImageSetup</span>
        </DialogTitle>
        <CharacterCreate />
      </Dialog>
    </>
  );
};

export default EpisodeImageSetup;
