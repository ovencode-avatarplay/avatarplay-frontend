import React from 'react';
import {Box, Button, Typography} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import PostAddIcon from '@mui/icons-material/PostAdd';

import ButtonSetupDrawer from '@/components/create/ButtonSetupDrawer';

import styles from './ContentBottom.module.css';

interface Props {
  onLLMOpen: () => void;
  onPublishingOpen: () => void;
}

const ContentBottom: React.FC<Props> = ({onLLMOpen, onPublishingOpen}) => {
  return (
    <Box className={styles.contentBottom}>
      <div className={styles.setupButtons}>
        <Box>
          {/*TODO : Move AI Model Setup from Episode Setting to here */}
          <ButtonSetupDrawer icon={<PersonIcon />} label="LLM Setup" onClick={onLLMOpen} />
        </Box>
      </div>

      {/* ButtonBox */}
      <Box className={styles.buttonBox}>
        <Button className={styles.actionButton}>
          <PostAddIcon />
          <Typography>Save Draft</Typography>
        </Button>
        <Button className={styles.actionButton}>
          <PostAddIcon />
          <Typography>Preview</Typography>
        </Button>
        <Button className={styles.actionButton} onClick={onPublishingOpen}>
          <PostAddIcon />
          <Typography>Submit</Typography>
        </Button>
      </Box>
    </Box>
  );
};

export default ContentBottom;
