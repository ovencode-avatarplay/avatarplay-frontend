import React from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward'; 
import PersonIcon from '@mui/icons-material/Person';
import Style from './ButtonEpisodeInfo.module.css'; 
import { useSelector } from 'react-redux';
import { RootState } from '@/redux-store/ReduxStore';

interface Props {
    onDrawerOpen: () => void; 
}

const ButtonEpisodeInfo: React.FC<Props> = ({ onDrawerOpen }) => {
    const curContentId = useSelector((state: RootState) => state.contentselection.contentID);
    const selectedChapterId = useSelector((state: RootState) => state.contentselection.selectedChapter);
    const selectedEpisodeId = useSelector((state: RootState) => state.contentselection.selectedEpisode);
    const contentInfo = useSelector((state: RootState) => state.content.contentInfo ?? []);
    const selectedContent = contentInfo.find(item => item.id === curContentId);

    if (!selectedContent) {
        return <Typography>No content available</Typography>; // 로딩 상태 처리
    }

    const chapterName = selectedContent?.chapterInfoList?.find(ch => ch.id === selectedChapterId)?.name || 'No Chapter Selected';
    const episodeName = selectedContent?.chapterInfoList
        ?.find(ch => ch.id === selectedChapterId)
        ?.episodeInfoList?.find(ep => ep.id === selectedEpisodeId)?.name || 'No Episode Selected';

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