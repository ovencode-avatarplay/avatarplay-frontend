// Drawer

import React from 'react';
import { Drawer, Box, Button, Typography } from '@mui/material';
import Style from './ChapterBoard.module.css';
import CreateDrawerHeader from '@/components/create/CreateDrawerHeader';

interface Props {
    open: boolean;
    onClose: () => void;
}

const ChapterBoard: React.FC<Props> = ({ open, onClose }) => {
    return (
        <Drawer
            anchor="right"
            open={open}
            onClose={onClose}
            PaperProps={{
                sx: { width: '100vw', height: '100vh' },
            }}
        >
            <Box className={Style.drawerContainer}>
                {/* Drawer Header */}
                <CreateDrawerHeader title='ChapterBoard' onClose={onClose} />

                {/* Create Chapter 이미지 버튼 */}
                <Box className={Style.imageButtonContainer}>
                    <Button className={Style.imageButton}>
                        <img src="/Images/create-chapter.png" alt="Create Chapter" className={Style.buttonImage} />
                        <Typography>Create Chapter</Typography>
                    </Button>
                </Box>

                <Box className={Style.contentBox}>
                    
                </Box>

                {/* Create Episode 이미지 버튼 */}
                <Box className={Style.imageButtonContainer}>
                    <Button className={Style.imageButton}>
                        <img src="/Images/create-episode.png" alt="Create Episode" className={Style.buttonImage} />
                        <Typography>Create Episode</Typography>
                    </Button>
                </Box>
            </Box>
        </Drawer>
    );
};

export default ChapterBoard;
