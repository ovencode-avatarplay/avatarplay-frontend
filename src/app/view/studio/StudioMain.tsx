'use client';

import React from 'react';

import StudioTopMenu from './StudioTopMenu';
import {Box} from '@mui/material';

const StudioMain = () => {
  return (
    <div>
      <StudioTopMenu />
      <Box // 임시
        sx={{
          backgroundImage: 'url(/images/temp/StoryPlan.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          width: '100%',
          height: '100vh',
        }}
      ></Box>
    </div>
  );
};

export default StudioMain;
