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
import DrawerCreate from '../content/create/DrawerCreate';

import './bottom-nav.css';

export default function SimpleBottomNavigation() {
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const [drawerOpen, setDrawerOpen] = React.useState(false);
    const navigate = useNavigate(); 

    const toggleDrawer = (open: boolean) => {
        setDrawerOpen(open);
    };
    
    const handleNavigationChange = (event: React.SyntheticEvent, newValue: number) => {
        if (newValue !== 2)
        {
            setSelectedIndex(newValue);
            navigate(BottomNav[newValue].link); // 선택된 index에 맞는 링크로 이동
        }
        else
        {
            toggleDrawer(!drawerOpen)
        }
    };

    React.useEffect(() => {
        if (selectedIndex === 2)
        {
            toggleDrawer(true)
        }
        else 
        { 
            toggleDrawer(false) 
        }
    }, [selectedIndex]);


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
        <>
        <Paper className ="bottom-navigation" elevation={3}>
            <Box className ="bottom-navigation-box">
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
        <DrawerCreate open={drawerOpen} onClose={()=> toggleDrawer(false)} />
        </>
    );
}