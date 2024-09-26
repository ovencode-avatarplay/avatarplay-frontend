'use client'

import React, { useState } from 'react';
import { RootState } from '@/redux-store/ReduxStore';
import { useDispatch, useSelector } from 'react-redux';
import { Drawer, Button, Box, Typography, Select, MenuItem } from '@mui/material';
import { closeDrawerContentDesc } from '@/redux-store/slices/drawerContentDescSlice';
import Style from './DrawerContentDesc.module.css';

const DrawerContentDesc = () => {
  const [selectedOption, setSelectedOption] = useState('');
  const dispatch = useDispatch();
  const { open, id } = useSelector((state: RootState) => state.drawerContentDesc); 

  return (
    <Drawer
      anchor="bottom"
      open={open}
      onClose={() => dispatch(closeDrawerContentDesc())}
      PaperProps={{
        sx: {
          height: '90vh',
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          overflow: 'hidden',
        }
      }}
    >
      <div className={Style.header}>
        <Typography>
          컨텐츠 제목 {id}
        </Typography>
        <div>
          <Button variant="outlined" onClick={() => {/* Add upload functionality */}}>Upload</Button>
          <Button variant="outlined" onClick={() => dispatch(closeDrawerContentDesc())}>Close</Button>
        </div>
      </div>
      <main className={Style.content}>
        <Box className={Style.imageBackground}>

        </Box>
        
        <Box className={Style.descriptionBox}>
            제작자 ID, 채팅 횟수, 채팅 사용자 수
          </Box>
          
          <Box className={Style.descriptionBox}>
            퍼블리싱태그
          </Box>
          
          <Box className={Style.descriptionBox}>
            퍼블리싱 설명
          </Box>
          
          <Box className={Style.descriptionBox}>
            연관 컨텐츠 추천
          </Box>
      </main>
      <main className={Style.chatingControlPanel}>  
        <Box>
          <Typography variant="h6" >
            Chapter
          </Typography>
          <Select
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value as string)}
            displayEmpty
            fullWidth
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value={1}>Day 1</MenuItem>
            <MenuItem value={2}>Day 2</MenuItem>
            <MenuItem value={3}>Day 3</MenuItem>
          </Select>
          <Box className={Style.episodeList}>
            <Typography>
              에피소드 리스트 (가로 스크롤)
            </Typography>
          </Box>
          <Button variant="contained" fullWidth>
            Start new chat
          </Button>
        </Box>
      </main>
    </Drawer>
  );
};

export default DrawerContentDesc;
