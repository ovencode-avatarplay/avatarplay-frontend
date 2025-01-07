'use client';

import React, {useState, useEffect} from 'react';
import {Box} from '@mui/material';
import ReelsContent from './ReelsContent';
import {sendGetHomeFeedShorts} from '@/app/NetWork/ShortsNetwork';
import styles from './ReelsLayout.module.css'; // CSS 모듈로 변경

// ReelData 인터페이스 정의
interface ReelData {
  images: string[]; // 여러 이미지를 처리할 수 있게 수정
  text: string;
  link: string;
}

const ReelsLayout = () => {
  const [content, setContent] = useState<ReelData[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await sendGetHomeFeedShorts();

        if (response.resultCode === 0 && response.data) {
          const mappedData: ReelData[] = response.data.map(short => ({
            images: Array.isArray(short.thumbnailList) ? short.thumbnailList : [],
            text: short.summary || '',
            link: `link_to_shorts/${short.shortsId}`,
          }));

          setContent(mappedData);
        } else {
          console.error(`Error: ${response.resultMessage}`);
        }
      } catch (error) {
        console.error('Error fetching shorts data:', error);
      }
    };

    fetchData();
  }, []);
  console.log(content);
  return (
    <Box className={styles.reels_container}>
      {' '}
      {/* 수정된 부분 */}
      {content.map((item, index) => (
        <ReelsContent key={index} />
      ))}
    </Box>
  );
};

export default ReelsLayout;
