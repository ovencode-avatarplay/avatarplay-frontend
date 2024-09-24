import React from 'react';
import { Box, Button, Typography } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import BookIcon from '@mui/icons-material/Book';
import PostAddIcon from '@mui/icons-material/PostAdd';

import ButtonSetupDrawer from '@/components/create/ButtonSetupDrawer';

import './ContentBottom.css';

const ContentBottom: React.FC = () => {
  const handleDrawerOpen = () => {
    // Drawer 열기 로직
  };

  return (
      <Box className="content-bottom">
          <div className="setup-buttons">
              <Box>
                  <ButtonSetupDrawer icon={<PersonIcon />} label="Setup 1" onClick={handleDrawerOpen} />
                  <ButtonSetupDrawer icon={<BookIcon />} label="Setup 2" onClick={handleDrawerOpen} />
              </Box>
          </div>

      {/* ButtonBox */}
      <Box className="button-box">
        <Button className="action-button">
          <PostAddIcon />
          <Typography>Action 1</Typography>
        </Button>
        <Button className="action-button">
          <PostAddIcon />
          <Typography>Action 2</Typography>
        </Button>
        <Button className="action-button">
          <PostAddIcon />
          <Typography>Action 3</Typography>
        </Button>
      </Box>
    </Box>
  );
};

export default ContentBottom;
