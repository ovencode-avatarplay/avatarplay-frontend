// modal

import {Button, Dialog, DialogTitle} from '@mui/material';
import styles from './EpisodeImageSetup.module.css';
import React, {useEffect} from 'react';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import CharacterCreateSequence from '../../../character/CreateCharacterSequence';
import {EpisodeInfo, setCurrentEpisodeInfo} from '@/redux-store/slices/EpisodeInfo';
import {useDispatch} from 'react-redux';

interface EpisodeImageSetupProps {
  open: boolean;
  onClose: () => void;
  episodeInfo: EpisodeInfo;
}

const EpisodeImageSetup: React.FC<EpisodeImageSetupProps> = ({open, onClose, episodeInfo}) => {
  const dispatch = useDispatch();
  useEffect(() => {
    if (open) {
      dispatch(setCurrentEpisodeInfo(episodeInfo));
    }
  }, [episodeInfo]);
  return (
    <Dialog
      closeAfterTransition={false}
      open={open}
      onClose={onClose}
      // fullScreen
      classes={{paper: styles['modal-body']}}
      disableAutoFocus={true}
      disableEnforceFocus={true} // disableEnforceFocus 속성 사용
      sx={{
        width: 'var(--full-width)',
        margin: '0 auto',
      }}
    >
      <DialogTitle className={styles['modal-header']}>
        <Button onClick={onClose} className={styles['close-button']}>
          <ArrowBackIosIcon />
        </Button>
        <span className={styles['modal-title']}>EpisodeImageSetup</span>
      </DialogTitle>
      <CharacterCreateSequence closeAction={onClose} isModify={false} />
    </Dialog>
  );
};

export default EpisodeImageSetup;
