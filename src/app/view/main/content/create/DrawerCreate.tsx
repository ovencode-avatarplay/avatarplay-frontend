import React, { useState } from 'react';
import { Drawer, Button, Box, Typography } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import BookIcon from '@mui/icons-material/Book';
import PostAddIcon from '@mui/icons-material/PostAdd';
import './DrawerCreate.css'


interface Props {
    open: boolean;
    onClose: () => void;
  }

const DrawerCreate: React.FC<Props> = ({open, onClose}) => {

  return (
    <>
      <Drawer anchor="bottom" open={open} onClose={onClose} ModalProps={{
          BackdropProps: {
            style: { backgroundColor: 'transparent' }, // 배경을 투명하게 설정
          },
        }}
        PaperProps={{
            sx: {
              position: 'absolute', // BottomNavigation 위로 올라오지 않도록
              bottom: 56, // BottomNavigation의 높이만큼 여백
              zIndex: 50, // BottomNavigation보다 낮은 zIndex
            },
        }}>
        <Box className="drawer-create-box"
        >
          {/* Character Button */}
          <Box className="drawer-create-item">
            <Button>
              <PersonIcon fontSize="large" />
            </Button>
            <Typography>Character</Typography>
          </Box>

          {/* Story Button */}
          <Box className="drawer-create-item">
            <Button>
              <BookIcon fontSize="large" />
            </Button>
            <Typography>Story</Typography>
          </Box>

          {/* Post Button */}
          <Box className="drawer-create-item">
            <Button>
              <PostAddIcon fontSize="large" />
            </Button>
            <Typography>Post</Typography>
          </Box>
        </Box>
      </Drawer>
    </>
  );
};

export default DrawerCreate;
