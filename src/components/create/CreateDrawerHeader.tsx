import React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Style from './CreateDrawerHeader.module.css'; // 스타일을 위한 CSS 파일

interface Props {
    title: string
    onClose: () => void;
}

const CreateDrawerHeader: React.FC<Props> = ({title ,onClose }) => {
    return (
        <Box className={Style.header}>
            <IconButton onClick={onClose}>
                <ArrowBackIcon />
            </IconButton>
            <Typography variant="h6">{title}</Typography>
        </Box>
    );
};

export default CreateDrawerHeader;
