//Modal

import CreateDrawerHeader from '@/components/create/CreateDrawerHeader';
import { Box, Drawer } from '@mui/material';
import React from 'react';
import Style from './ContentPublishing.module.css'

interface Props {
    open: boolean;
    onClose: () => void;
}

const ContentPublishing: React.FC<Props> = ({ open, onClose }) => {
    return (
        <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{
            sx: { width: '100vw', height: '100vh' },
        }}>
            <Box className={Style.drawerContainer}>
                <CreateDrawerHeader title='Publishing Setup' onClose={onClose} />
            </Box>
            <div>
                ContentPublishing
            </div>
        </Drawer>)
}

export default ContentPublishing;