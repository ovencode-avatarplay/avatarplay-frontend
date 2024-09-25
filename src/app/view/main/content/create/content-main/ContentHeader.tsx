import React, { useState } from 'react';
import { Box, TextField, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import StudioIcon from '@mui/icons-material/VideoLibrary'; // 'Studio' 버튼에 사용할 아이콘
import Style from './ContentHeader.module.css';
import Link from 'next/link';

interface ContentHeaderProps {
    onBack: () => void; // 뒤로가기 버튼 클릭 시 호출될 함수
    onOpenDrawer: () => void; // 스튜디오 버튼 클릭 시 호출될 함수
}

const ContentHeader: React.FC<ContentHeaderProps> = ({ onBack, onOpenDrawer }) => {
    const [title, setTitle] = useState('Content Title Text'); // 수정 가능한 텍스트 상태

    return (
        <Box className={Style.contentHeader}>
        <Link href="./homefeed" passHref>
            <IconButton>
                <ArrowBackIcon />
            </IconButton>
        </Link>
            <Box className={Style.titleContainer}>
                <TextField
                    variant="standard"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <IconButton>
                                <EditIcon />
                            </IconButton>
                        ),
                    }}
                    placeholder="Content Title Text"
                    fullWidth
                />
            </Box>
            <div className={Style.studioButton}>
            <IconButton onClick={onOpenDrawer} >
                <StudioIcon />
            </IconButton>
            </div>
        </Box>
    );
};

export default ContentHeader;
