import React, { useState } from 'react';
import { RootState } from '@/redux-store/ReduxStore'

import { useDispatch, useSelector } from 'react-redux';
import { Drawer, Button, Box, Typography, Select, MenuItem } from '@mui/material';
import { closeDrawerContentDesc } from '@/redux-store/slices/drawerContentDescSlice';

const DrawerContentDesc = () => {
  const [selectedOption, setSelectedOption] = useState('');

  const dispatch = useDispatch();
  const { open, id } = useSelector((state: RootState) => state.drawerContentDesc); // RootState 타입 사용


  return (
      <Drawer
        anchor="bottom"
        open={open}
        onClose={() => dispatch(closeDrawerContentDesc())}
        PaperProps={{
          sx: {
            height: '90vh', // Set drawer height
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            overflow: 'hidden',
          }
        }}
      >
        <div className='top-area'>
          <Typography>
            TODO 일단 아무 정보나 집어넣었음 {id}
          </Typography>
          <button>
            upload
          </button>
          <button>
            close
          </button>          
        </div>
        <Box
          sx={{
            height: '100%',
            backgroundImage: 'url(/Images/001.png)', // Replace with your image
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'relative'
          }}
        >
        </Box><Box sx={{ padding: 3, }}>
          {/* Title */}
          <Typography variant="h6" sx={{ marginBottom: 2 }}>
            Chapter
          </Typography>

          {/* ComboBox */}
          <Select
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value as string)}
            displayEmpty
            fullWidth
            sx={{ marginBottom: 2 }}
          >
            <MenuItem value="">
              <em>None</em>
            </MenuItem>
            <MenuItem value={1}>Day 1</MenuItem>
            <MenuItem value={2}>Day 2</MenuItem>
            <MenuItem value={3}>Day 3</MenuItem>
          </Select>

          {/* Box */}
          <Box
            sx={{
              height: '100px',
              border: '1px solid #ccc',
              borderRadius: 4,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: 2
            }}
          >
            <Typography>Some content here</Typography>
          </Box>

          {/* Button */}
          <Button variant="contained" fullWidth>
            Submit
          </Button>
        </Box>
      </Drawer>
  );
};

export default DrawerContentDesc;
