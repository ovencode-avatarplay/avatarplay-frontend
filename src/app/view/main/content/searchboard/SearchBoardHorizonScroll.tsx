import React, { useEffect, useState } from 'react';
import { Box, Typography} from '@mui/material';
import Style from './SearchBoardHorizonScroll.module.css'; // 스타일 파일 임포트
import ExploreCard from './ExploreCard'
import { parse } from 'path';
import { number } from 'valibot';
import { ExploreInfo } from '@/app/NetWork/exploreNetwork';
import { ExploreCardProps } from '@/types/apps/explore-card-type';

interface Props
{
  title : string;
  data : ExploreInfo[];
}

const SearchBoardHorizonScroll: React.FC<Props> = ({ title ,data }) => {

  const DefaultImage = '/Images/001.png'
  const [content, setContent] = useState<ExploreCardProps[]>([]);

  useEffect(() => {
    if (data) {
      const mappedData: ExploreCardProps[] = data.map(explore => ({
        characterId: explore.characterId,
        thumbnail: explore.thumbnail,
        shortsId: explore.shortsId || "",
      }));
      setContent(mappedData);
    }
  }, [data]);

  return (
    <Box sx={{ padding: '16px' }}>
      <Typography variant="h5" sx={{ fontWeight: 'bold', marginBottom: '8px' }}>
        {title}
      </Typography>

      {/* Horizontal scrollable ExploreCard list */}
      <Box className={Style.scrollBox}>
        {content.map((explore, index) => (
            <ExploreCard 
            key={index}
            characterId={explore.characterId}
            shortsId={explore.shortsId}
            thumbnail={explore.thumbnail}
            />
        ))}
      </Box>
    </Box>
  );
};

export default SearchBoardHorizonScroll;
