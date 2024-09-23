import React from 'react';
import { Box, Typography, Card, CardContent } from '@mui/material';
import './SearchBoardHorizonScroll.css'; // 스타일 파일 임포트

const SearchBoardHorizonScroll: React.FC = () => {
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
          <Card key={index} className="story-card">
            <CardContent>
              <Typography variant="h6" align="center">
                {story}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default SearchBoardHorizonScroll;
