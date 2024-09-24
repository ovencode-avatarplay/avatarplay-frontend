"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, IconButton, Container } from '@mui/material';
import { FavoriteBorder, ChatBubbleOutline, Send, MoreHoriz } from '@mui/icons-material';
import './ReelsContent.css';

interface ReelData {
    images: string[];
    text: string;
    link: string;
}

interface ReelsContentProps {
    item: ReelData;
}

const ReelsContent: React.FC<ReelsContentProps> = ({ item }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollContainerRef = useRef<HTMLDivElement | null>(null);

    const hasImages = item.images && item.images.length > 0;

    // 스크롤 이벤트로 현재 보고 있는 이미지 인덱스를 계산
    const handleScroll = () => {
        if (scrollContainerRef.current && hasImages) {
            const scrollLeft = scrollContainerRef.current.scrollLeft;
            const width = scrollContainerRef.current.offsetWidth;
            const newIndex = Math.round(scrollLeft / width);
            setCurrentIndex(newIndex);
        }
    };

    useEffect(() => {
        const scrollContainer = scrollContainerRef.current;
        if (scrollContainer) {
            scrollContainer.addEventListener('scroll', handleScroll);
            return () => scrollContainer.removeEventListener('scroll', handleScroll);
        }
    }, [hasImages]);

    const renderDots = () => {
        return item.images.map((_, index) => (
            <span
                key={index}
                className={index === currentIndex ? 'dot active' : 'dot'}

            >
                {index === currentIndex ? '●' : '○'}
            </span>
        ));
    };

    return (
        <Box className="reel">
            <Container className="box-group">
                <Box className="post-header">
                    {/* 헤더 내용 */}
                </Box>

                {/* 이미지가 있을 경우 가로 스크롤을 사용하여 배치 */}
                {hasImages ? (
                    <Box className="image-scroll-container" ref={scrollContainerRef}>
                        {item.images.map((image, index) => (
                            <Box
                                key={index}
                                component="img"
                                src={image}
                                alt={`Reel ${index}`}
                                className="post-image"
                            />
                        ))}
                    </Box>
                ) : (
                    <Typography variant="body2" className="no-image-text">
                        이미지가 없습니다.
                    </Typography>
                )}

                <Box className="post-icons">
                    <IconButton>
                        <FavoriteBorder />
                    </IconButton>
                    <IconButton>
                        <ChatBubbleOutline />
                    </IconButton>
                    <IconButton>
                        <Send />
                    </IconButton>
                    <Box className="post-icons-space"></Box>
                    <IconButton>
                        <MoreHoriz />
                    </IconButton>
                </Box>

                {/* 이미지 인덱스를 ●○로 표시 */}
                <Box className="image-index">
                    {renderDots()}
                </Box>

                <Box className="post-details">
                    <Typography variant="body1" className="post-text">
                        {item.text}
                    </Typography>
                    <Typography variant="body2" className="post-link">
                        <a href={item.link}>더 알아보기</a>
                    </Typography>
                </Box>
            </Container>
        </Box>
    );
};

export default ReelsContent;
