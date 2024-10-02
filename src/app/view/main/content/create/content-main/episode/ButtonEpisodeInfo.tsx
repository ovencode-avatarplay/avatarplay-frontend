import React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'; 
import PersonIcon from '@mui/icons-material/Person';
import Style from './ButtonEpisodeInfo.module.css'; 

interface Props {
    chapterName: string; 
    episodeName: string; 
    onDrawerOpen: () => void; 
}

const ButtonEpisodeInfo: React.FC<Props> = ({ chapterName, episodeName, onDrawerOpen }) => {
    return (
    <Box className={Style.chapterInfo}>
        <PersonIcon fontSize="large" />

        <Box display="flex" flexDirection="column" className={Style.chapterDetails}>
            <Typography variant="subtitle1">{chapterName}</Typography>
            <Typography variant="h6">{episodeName}</Typography>
        </Box>

        <IconButton
            onClick={onDrawerOpen}
            className={Style.arrowButton}
        >
            <ArrowForwardIcon />
        </IconButton>
    </Box>
    );
};

export default ButtonEpisodeInfo;