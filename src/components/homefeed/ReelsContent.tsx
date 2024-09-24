"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Box, Typography, IconButton, Container, Avatar, Card, CardContent, } from '@mui/material';
import { FavoriteBorder, ChatBubbleOutline, Send, MoreHoriz, ArrowForward, ArrowForwardIos } from '@mui/icons-material';
import './ReelsContent.css';
import MoreVert from '@mui/icons-material/MoreVert';

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


                <Box className='top-box'>
                    <Avatar></Avatar>
                    <Box className='info-box'>
                        <div className='typo-type1' >
                            0.01% Alpha Male Simulator
                        </div>
                        <div className='typo-type2'>
                            5 Days ago
                        </div>
                    </Box>
                    <IconButton>
                        <MoreVert sx={{ fontSize: 35 }}></MoreVert>
                    </IconButton>
                </Box>


                <Typography color='black' fontSize={14} variant="body1">
                    My first uni's outing become extremely excited when I was bumping into her...{' '}
                    <Typography fontSize={14} component="span" variant="body1" color="primary">
                        Read more
                    </Typography>
                </Typography>
                {/* 이미지가 있을 경우 가로 스크롤을 사용하여 배치 */}
                {
                    hasImages ? (
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
                    )
                }
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
                    {/* <IconButton>
                        <Send />
                    </IconButton>
                    <Box className="post-icons-space"></Box>
                    <IconButton>
                        <MoreHoriz />
                    </IconButton> */}
                </Box>


                <Card variant="outlined" sx={{ borderRadius: '16px', display: 'flex', alignItems: 'center', padding: 2, justifyContent: 'space-between' }}>
                    <Avatar sx={{ width: 30, height: 30, borderRadius: '10px' }} />
                    <span style={{ flexGrow: 1, textAlign: 'center' }}>Go swimming with her</span>
                    <ArrowForwardIos />
                </Card>


            </Container >
        </Box >
    );
};

export default ReelsContent;
