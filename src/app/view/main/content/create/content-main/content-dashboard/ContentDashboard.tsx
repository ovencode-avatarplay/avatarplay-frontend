// Drawer

import React from 'react';
import { Drawer, Box, IconButton, Typography, Button, Select, MenuItem } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Style from './ContentDashboard.module.css';
import CreateDrawerHeader from '@/components/create/CreateDrawerHeader';

interface Props {
    open: boolean;
    onClose: () => void;
}

const ContentDashboard: React.FC<Props> = ({ open, onClose }) => {
    return (
        <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{
            sx: { width: '100vw', height: '100vh' }, 
        }}>
            <Box className={Style.drawerContainer}>
                <CreateDrawerHeader title='Content Dashboard' onClose={onClose}/>
                
                <Box className={Style.filterContainer}>
                    <Select className={Style.filterSelect}>
                        <MenuItem value="filter1">Filter 1</MenuItem>
                        <MenuItem value="filter2">Filter 2</MenuItem>
                        <MenuItem value="filter3">Filter 3</MenuItem>
                    </Select>
                    <Button variant="contained" className={Style.createButton}>
                        Create
                    </Button>
                </Box>
                
                <Box className={Style.list}>
                    {/* 나중에 리스트 내용 추가 */}
                </Box>

                <Box className={Style.buttonContainer}>
                    <Button variant="outlined">Edit</Button>
                    <Button variant="outlined">Preview</Button>
                    <Button variant="outlined">Delete</Button>
                </Box>
            </Box>
        </Drawer>
    );
};

export default ContentDashboard;
