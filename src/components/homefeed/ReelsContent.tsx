"use client";

import React from 'react';
import { Box, Typography, IconButton, Container } from '@mui/material';
import { FavoriteBorder, ChatBubbleOutline, Send, MoreHoriz } from '@mui/icons-material';
import './ReelsContent.css';

interface ReelData {
    image: string;
    text: string;
    link: string;
}

interface ReelsContentProps {
    item: ReelData;
    index: number;
}

const ReelsContent: React.FC<ReelsContentProps> = ({ item, index }) => {
    return (
        <Box key={index} className="reel">
            <Container className="box-group">

                <Box className="post-header">
                    나중에 버튼 등 뭐 그러넉
                </Box>

                {/* 게시물 이미지 */}
                <Box
                    component="img"
                    src={item.image}
                    alt={`Reel ${index}`}
                    className="post-image"
                />

                {/* 좋아요, 댓글, 공유, 더보기 아이콘 */}
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
                    <Box className="post-icons-space"></Box> {/* 가운데 공간 */}
                    <IconButton>
                        <MoreHoriz />
                    </IconButton>
                </Box>

                {/* 게시물 설명 및 텍스트 */}
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
