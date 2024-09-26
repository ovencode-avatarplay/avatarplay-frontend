import React, { useEffect, useRef, useState } from 'react';
import { Drawer, Box, Button, Select, MenuItem } from '@mui/material';
import CreateDrawerHeader from '@/components/create/CreateDrawerHeader';
import ContentItem from './ContentItem';
import ContentItemData from '@/data/content-items.json';
import Style from './ContentDashboard.module.css';

interface Props {
    open: boolean;
    onClose: () => void;
}

const ContentDashboard: React.FC<Props> = ({ open, onClose }) => {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const listRef = useRef<HTMLDivElement | null>(null);

    const handleItemClick = (index: number) => {
        setSelectedIndex(index);
    };

    useEffect(() => {
        if (selectedIndex !== null && open && listRef.current) {
            const selectedItem = listRef.current.children[selectedIndex];
            if (selectedItem) {
                selectedItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }, [selectedIndex, open]);

    return (
        <Drawer anchor="right" open={open} onClose={onClose} PaperProps={{
            sx: { width: '100vw', height: '100vh' }, 
        }}>
            <Box className={Style.drawerContainer}>
                <CreateDrawerHeader title='Content Dashboard' onClose={onClose} />
                
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
                
                <Box className={Style.list} ref={listRef}>
                    {ContentItemData.map((item, index) => (
                        <div 
                            key={index}
                            onClick={() => handleItemClick(index)}
                        >
                            <ContentItem
                                thumbnailSrc={item.thumbnailSrc}
                                createdDate={item.createdDate}
                                buttonShareText={item.buttonShareText}
                                title={item.title}
                                talkCount={item.talkCount}
                                peopleCount={item.peopleCount}
                                isSelected={selectedIndex === index} 
                            />
                        </div>
                    ))}
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
