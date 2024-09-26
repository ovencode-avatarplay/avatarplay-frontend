import React, { useState } from 'react';
import { Box, TextField, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EditIcon from '@mui/icons-material/Edit';
import StudioIcon from '@mui/icons-material/VideoLibrary'; // 'Studio' 버튼에 사용할 아이콘
import Style from './ContentHeader.module.css';
import Link from 'next/link';

interface ContentHeaderProps {
    lastUrl? : string
    onOpenDrawer: () => void; // 스튜디오 버튼 클릭 시 호출될 함수
}

const ContentHeader: React.FC<ContentHeaderProps> = ({ lastUrl, onOpenDrawer }) => {
    const [title, setTitle] = useState(''); 
    const defaultUrl = "./main/homefeed";

    return (
        <Box className={Style.contentHeader}>
        <Link href={lastUrl ? lastUrl : defaultUrl} passHref>
            <IconButton>
                <ArrowBackIcon />
            </IconButton>
        </Link>
            <Box className={Style.titleContainer}>
                <TextField
                    variant="standard"
                    value={title}
                    aria-placeholder='Content Title Text'
                    onChange={(e) => setTitle(e.target.value)}
                    InputProps={{
                        endAdornment: (
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
