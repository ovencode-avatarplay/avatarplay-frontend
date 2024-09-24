"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, IconButton, Container, Avatar, Card, CardContent } from '@mui/material';
import { FavoriteBorder, ChatBubbleOutline, Send, MoreHoriz, ArrowForwardIos } from '@mui/icons-material';
import './ReelsContent.css';
import MoreVert from '@mui/icons-material/MoreVert';
import { useDispatch } from 'react-redux';
import { openDrawerContentDesc } from '@/redux-store/slices/drawerContentDescSlice';

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
    const [isTextExpanded, setIsTextExpanded] = useState(false); // 텍스트 펼침 여부
    const scrollContainerRef = useRef<HTMLDivElement | null>(null);

    const hasImages = item.images && item.images.length > 0;

    const dispatch = useDispatch();

    const handleOpenDrawer = () => {
        dispatch(openDrawerContentDesc(String(item.link))); // ID 값을 전달하여 Drawer 열기
    };

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

    // 'Read more' 클릭 시 텍스트 펼치기/접기
    const toggleTextExpansion = () => {
        setIsTextExpanded(prevState => !prevState);
    };

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

                <Box className='top-box'>
                    <Avatar></Avatar>
                    <Box className='info-box'>
                        <div className='typo-type1'>
                            0.01% Alpha Male Simulator
                        </div>
                        <div className='typo-type2'>
                            5 Days ago
                        </div>
                    </Box>
                    <IconButton>
                        <MoreVert sx={{ fontSize: 35 }} />
                    </IconButton>
                </Box>

                {/* 텍스트 표시 및 'Read more' 버튼 */}
                <Typography
                    className={`post-text ${isTextExpanded ? 'expanded' : ''}`}
                    color='black'
                    fontSize={14}
                    variant="body1"
                >
                    {item.text}
                </Typography>

                {/* 텍스트가 길 경우 Read more 표시 */}
                {item.text.length > 100 && (
                    <Typography
                        fontSize={14}
                        component="span"
                        variant="body1"
                        color="primary"
                        onClick={toggleTextExpansion}
                        style={{ cursor: 'pointer' }}
                    >
                        {isTextExpanded ? 'Read less' : 'Read more'}
                    </Typography>
                )}

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

                {/* 이미지 인덱스를 ●○로 표시 */}
                <Box className="image-index">
                    {renderDots()}
                </Box>

                <Box className="post-icons">
                    <IconButton>
                        <FavoriteBorder />
                        <div className='typo-type3'>100k</div>
                    </IconButton>
                    <IconButton>
                        <ChatBubbleOutline />
                        <div className='typo-type3'>100k</div>
                    </IconButton>
                </Box>
                <Card variant="outlined" sx={{ borderRadius: '16px', display: 'flex', alignItems: 'center', padding: 2, justifyContent: 'space-between' }} onClick={handleOpenDrawer}>
                    <Avatar sx={{ width: 30, height: 30, borderRadius: '10px' }} />
                    <span style={{ flexGrow: 1, textAlign: 'center' }}>Go swimming with her</span>
                    <ArrowForwardIos />
                </Card>
            </Container>
        </Box>
    );
};

export default ReelsContent;
