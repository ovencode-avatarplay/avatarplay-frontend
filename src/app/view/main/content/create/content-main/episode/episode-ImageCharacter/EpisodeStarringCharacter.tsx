import React from 'react';
import styles from './EpisodeStarringCharacter.module.css'; // CSS Module import
import {Dialog, DialogTitle, Button, IconButton, Box, Typography} from '@mui/material';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import {useDispatch} from 'react-redux'; // Redux useDispatch import
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';

interface EpisodeStarringCharacterProps {
  open: boolean; // 모달 열림 상태
  closeModal: () => void; // 모달 닫기 함수
}

const EpisodeStarringCharacter: React.FC<EpisodeStarringCharacterProps> = ({open, closeModal}) => {
  const dispatch = useDispatch(); // Redux dispatch hook 사용

  return (
    <Dialog
      closeAfterTransition={false}
      open={open}
      onClose={closeModal}
      fullScreen
      className={styles['modal-body']}
      disableAutoFocus={true}
      disableEnforceFocus={true} // disableEnforceFocus 속성 사용
    >
      <DialogTitle className={styles['modal-header']}>
        <Button onClick={closeModal} className={styles['close-button']}>
          <ArrowBackIosIcon />
        </Button>
        <span className={styles['modal-title']}>Episode Conversation Template</span>
      </DialogTitle>
      <Button
        sx={{
          m: 1,
          color: 'black',
          borderColor: 'gray',
        }}
        variant="outlined"
      >
        Confirm
      </Button>
      {/* <Box className={styles.artistInfo}>
        <FormatListBulletedIcon fontSize="large" />

        <Box display="flex" flexDirection="column" className={styles.artistDetails}>
          <Typography variant="subtitle1">asd</Typography>
          <Typography variant="h6">asd</Typography>
        </Box>

        <IconButton onClick={() => {}} className={styles.arrowButton}>
          <ChevronRightIcon fontSize="large" />
        </IconButton>
      </Box> */}
    </Dialog>
  );
};

export default EpisodeStarringCharacter;
