import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import BookIcon from '@mui/icons-material/Book';
import PostAddIcon from '@mui/icons-material/PostAdd';

import ButtonSetupDrawer from '@/components/create/ButtonSetupDrawer';

import Style from './ContentBottom.module.css';

interface Props{
  onGimmickOpen : () => void;
  onPublishingOpen : () => void;
}


const ContentBottom: React.FC<Props> = ({onGimmickOpen, onPublishingOpen}) => {
  return (
      <Box className={Style.contentBottom}>
          <div className={Style.setupButtons}>
              <Box>
                  <ButtonSetupDrawer icon={<PersonIcon />} label="Gimmick Setup" onClick={onGimmickOpen} />
              </Box>
          </div>

      {/* ButtonBox */}
      <Box className={Style.buttonBox}>
        <Button className={Style.actionButton}>
          <PostAddIcon />
          <Typography>Save Draft</Typography>
        </Button>
        <Button className={Style.actionButton}>
          <PostAddIcon />
          <Typography>Preview</Typography>
        </Button>
        <Button className={Style.actionButton} onClick={onPublishingOpen}>
          <PostAddIcon />
          <Typography>Submit</Typography>
        </Button>
      </Box>
    </Box>
  );
};

export default ContentBottom;
