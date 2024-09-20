"use client";

import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import ReelsContent from './ReelsContent';
import './ReelsLayout.css';

// ReelData 인터페이스 정의
interface ReelData {
    image: string;
    text: string;
    link: string;
}

const ReelsLayout = () => {
    const [content, setContent] = useState<ReelData[]>([]);

    useEffect(() => {
        fetch('/ReelsTempData.json') // public 폴더에 있는 JSON 파일 경로
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then((data: ReelData[]) => {
                setContent(data);
            })
            .catch((error) => console.error('Error fetching JSON data:', error));
    }, []);

    return (
        <Box className="reels-container">
            {content.map((item, index) => (
                <ReelsContent key={index} item={item} index={index} />
            ))}
        </Box>
    );
};

export default ReelsLayout;
