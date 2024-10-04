import React, { useEffect, useRef, useState } from 'react';
import { Drawer, Box, Button, Select, MenuItem } from '@mui/material';
import CreateDrawerHeader from '@/components/create/CreateDrawerHeader';
import ContentItem from './ContentItem';
import Style from './ContentDashboard.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/redux-store/ReduxStore';

interface Props {
  open: boolean;
  onClose: () => void;
  onSelectItem: (id: number) => void;
}

const ContentDashboard: React.FC<Props> = ({ open, onClose, onSelectItem }) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const contentInfo = useSelector((state: RootState) => state.content.contentInfo ?? []);
  
  const handleItemClick = (index: number) => {
    setSelectedIndex(index);
  };

  const dispatch = useDispatch();

  useEffect(() => {
    if (selectedIndex !== null && open && listRef.current) {
      const selectedItem = listRef.current.children[selectedIndex];
      if (selectedItem) {
        selectedItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [selectedIndex, open]);

  const handleEditClick = () => {
    if (selectedIndex !== null) {
      const selectedItemId = contentInfo[selectedIndex]?.id;
      if (selectedItemId) {
        onSelectItem(selectedItemId);
      }
    }
    onClose();
  };

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
        <CreateDrawerHeader title="Content Dashboard" onClose={onClose} />

        {/* Filter section */}
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

        {/* Content list */}
        <Box className={Style.list} ref={listRef}>
          {contentInfo.map((item, index) => (
            <div key={index} onClick={() => handleItemClick(index)}>
              <ContentItem
                thumbnailSrc={item.publishInfo.thumbnail}
                createdDate=""
                title={item.id + '/' + item.publishInfo.contentName}
                talkCount={0}
                peopleCount={0}
                isSelected={selectedIndex === index}
              />
            </div>
          ))}
        </Box>

        {/* Action buttons */}
        <Box className={Style.buttonContainer}>
          <Button 
            variant="outlined" 
            onClick={handleEditClick} 
            disabled={selectedIndex === null}
          >
            Edit
          </Button>
          <Button variant="outlined">Preview</Button>
          <Button variant="outlined">Delete</Button>
        </Box>
      </Box>
    </Drawer>
  );
};

export default ContentDashboard;
