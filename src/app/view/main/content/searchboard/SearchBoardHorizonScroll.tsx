import React from 'react';
import { Box, Typography} from '@mui/material';
import './SearchBoardHorizonScroll.css'; // 스타일 파일 임포트
import StoryCard from './StoryCard'
import StoryData from '@/data/story-cards.json'
import { parse } from 'path';
import { number } from 'valibot';


const SearchBoardHorizonScroll: React.FC = () => {

    const DefaultImage = '/Images/001.png'

  return (
    <Box sx={{ padding: '16px' }}>
      {/* Title */}
      <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: '8px' }}>
        Continue to Play
      </Typography>

      {/* Horizontal scrollable StoryCard list */}
      <Box className="horizontal-scroll-box">
        {StoryData.map((story, index) => (
            <StoryCard 
            key={index}
             title = {story.title}
            number1={parseInt(story.Count1, 10)}
            number2={parseInt(story.Count2, 10)}
            imageUrl={story.ImageUrl}
            />
        ))}
      </Box>
    </Box>
  );
};

export default SearchBoardHorizonScroll;
