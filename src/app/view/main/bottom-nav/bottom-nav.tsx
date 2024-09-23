import * as React from 'react';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import { Paper } from '@mui/material';

import HomeIcon from '@mui/icons-material/Home';
import ExploreIcon from '@mui/icons-material/Explore';
import CreateIcon from '@mui/icons-material/AddCircleOutline';
import ContentIcon from '@mui/icons-material/DynamicFeed';
import GameIcon from '@mui/icons-material/SportsEsports';

export default function SimpleBottomNavigation() {
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const buttons = [
        { label: 'Home', icon: <HomeIcon /> },
        { label: 'Explore', icon: <ExploreIcon /> },
        { label: 'Create', icon: <CreateIcon /> },
        { label: 'Content', icon: <ContentIcon /> },
        { label: 'Game', icon: <GameIcon /> }
    ];

    return (
        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
            <Box sx={{ width: '100%' }}>
                <BottomNavigation
                    showLabels
                    value={selectedIndex}
                    onChange={(event, newValue) => {
                        setSelectedIndex(newValue);
                    }}
                >
                    {buttons.map((button, index) => (
                        <BottomNavigationAction key={index} label={button.label} icon={button.icon} />
                    ))}
                </BottomNavigation>
            </Box>
        </Paper>
    );
}