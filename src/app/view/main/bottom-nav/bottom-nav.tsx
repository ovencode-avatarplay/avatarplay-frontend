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
import { useNavigate } from 'react-router-dom';

import BottomNav from 'data/navigation/bottom-nav.json'

export default function SimpleBottomNavigation() {
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const navigate = useNavigate(); // 
    
    const handleNavigationChange = (event: React.SyntheticEvent, newValue: number) => {
        setSelectedIndex(newValue);
        navigate(BottomNav[newValue].link); // 선택된 index에 맞는 링크로 이동
    };

    // 아이콘 문자열을 JSX.Element로 변환하는 함수
    const getIconComponent = (iconName: string) => {
        switch (iconName) {
            case '<HomeIcon />':
                return <HomeIcon />;
            case '<ExploreIcon />':
                return <ExploreIcon />;
            case '<CreateIcon />':
                return <CreateIcon />;
            case '<ContentIcon />':
                return <ContentIcon />;
            case '<GameIcon />':
                return <GameIcon />;
            default:
                return <HomeIcon />; // 정의되지 않은 아이콘은 null로 반환
        }
    };
    
    return (
        <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
            <Box sx={{ width: '100%' }}>
                <BottomNavigation
                    showLabels
                    value={selectedIndex}
                    onChange={handleNavigationChange}
                >
                    {BottomNav.map((button, index) => (
                        <BottomNavigationAction key={index} label={button.label} icon={getIconComponent(button.icon)} />
                    ))}
                </BottomNavigation>
            </Box>
        </Paper>
    );
}