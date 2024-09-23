import React from 'react';
import { Box, Typography} from '@mui/material';
import './SearchBoardHorizonScroll.css'; // 스타일 파일 임포트
import StoryCard from './StoryCard'



const SearchBoardHorizonScroll: React.FC = () => {

    const DefaultImage = '/Images/001.png'
  // Sample story data
  const stories = ['Story 1', 'Story 2', 'Story 3', 'Story 4', 'Story 5'];

  return (
    <Box sx={{ padding: '16px' }}>
      {/* Title */}
      <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: '8px' }}>
        Continue to Play
      </Typography>

      {/* Horizontal scrollable StoryCard list */}
      <Box className="horizontal-scroll-box">
        {stories.map((story, index) => (
            <StoryCard 
            key={index}
             title = {story}
            number1={1}
            number2={2}
            imageUrl={DefaultImage}
            />
        ))}
      </Box>
    </Box>
  );
};

export default SearchBoardHorizonScroll;
