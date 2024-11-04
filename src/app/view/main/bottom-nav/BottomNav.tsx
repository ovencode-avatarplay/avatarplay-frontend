'use client';

import * as React from 'react';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import {Paper} from '@mui/material';

import HomeIcon from '@mui/icons-material/Home';
import ExploreIcon from '@mui/icons-material/Explore';
import CreateIcon from '@mui/icons-material/AddCircleOutline';
import ContentIcon from '@mui/icons-material/DynamicFeed';
import GameIcon from '@mui/icons-material/SportsEsports';
// import { useNavigate } from 'react-router-dom';

import BottomNavData from 'data/navigation/bottom-nav.json';
import DrawerCreate from '../content/create/CreateWidget';

import Style from './BottomNav.css';
import Link from 'next/link';

export default function BottomNav() {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const toggleDrawer = (open: boolean) => {
    setDrawerOpen(open);
  };

  const handleNavigationChange = (event: React.SyntheticEvent, newValue: number) => {
    if (newValue !== 2) {
      setSelectedIndex(newValue);
    } else {
      toggleDrawer(!drawerOpen);
    }
  };

  const handleClick = (index: number) => {
    if (index === 2) {
      toggleDrawer(!drawerOpen); // 인덱스가 2일 때 드로어 열기/닫기
    } else {
      setSelectedIndex(index);
    }
  };

  React.useEffect(() => {
    if (selectedIndex === 2) {
      toggleDrawer(true);
    } else {
      toggleDrawer(false);
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
        return <HomeIcon />;
    }
  };

  return (
    <footer>
      <Paper className={Style.bottomNav} elevation={3}>
        <Box className={Style.bottomNavBox}>
          <BottomNavigation showLabels value={selectedIndex} onChange={handleNavigationChange}>
            {BottomNavData.map((button, index) =>
              index !== 2 ? (
                <BottomNavigationAction
                  key={index}
                  label={button.label}
                  icon={getIconComponent(button.icon)}
                  component={Link} // Link 컴포넌트를 component prop으로 전달
                  href={button.link} // Link에서 href 사용
                  onClick={() => handleClick(index)}
                  showLabel
                />
              ) : (
                <BottomNavigationAction
                  key={index}
                  label={button.label}
                  icon={getIconComponent(button.icon)}
                  onClick={() => handleClick(index)} // 클릭 시 handleClick 호출
                  showLabel
                />
              ),
            )}
          </BottomNavigation>
        </Box>
      </Paper>
      <DrawerCreate open={drawerOpen} onClose={() => toggleDrawer(false)} />
    </footer>
  );
}
