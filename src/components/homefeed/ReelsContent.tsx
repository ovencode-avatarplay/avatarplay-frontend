"use client";

import React from 'react';
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
    const hasImages = item.images && item.images.length > 0;

    return (
        <Box className="reel">
            <Container className="box-group">
                <Box className="post-header">
                    {/* 헤더 내용 */}
                </Box>

                {/* 이미지가 있을 경우 가로 스크롤을 사용하여 배치 */}
                {hasImages ? (
                    <Box className="image-scroll-container">
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
