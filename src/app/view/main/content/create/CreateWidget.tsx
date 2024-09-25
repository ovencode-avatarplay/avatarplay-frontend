import React, { useState } from 'react';
import { Drawer, Button, Box, Typography } from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import BookIcon from '@mui/icons-material/Book';
import PostAddIcon from '@mui/icons-material/PostAdd';
import Style from './CreateWidget.module.css'
import { useNavigate } from 'react-router-dom';


interface Props {
    open: boolean;
    onClose: () => void;
  }

const CreateWidget: React.FC<Props> = ({ open, onClose }) => {

  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
      navigate(path);
      onClose(); // Drawer를 닫습니다.
  };

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
        <Box className={Style.drawerBox}>
                    {/* Character Navigation */}
                    <Box className={Style.drawerItem} onClick={() => handleNavigation("/create")}>
                        <PersonIcon fontSize="large" />
                        <Typography>Character</Typography>
                    </Box>

                    {/* Story Navigation */}
                    <Box className={Style.drawerItem} onClick={() => handleNavigation("/create")}>
                        <BookIcon fontSize="large" />
                        <Typography>Story</Typography>
                    </Box>

                    {/* Post Navigation */}
                    <Box className={Style.drawerItem} onClick={() => handleNavigation("/create")}>
                        <PostAddIcon fontSize="large" />
                        <Typography>Post</Typography>
                    </Box>
                </Box>
      </Drawer>
    </>
  );
};

export default CreateWidget;
