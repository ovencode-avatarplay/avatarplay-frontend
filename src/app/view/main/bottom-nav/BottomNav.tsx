'use client';

import * as React from 'react';

// style, mui
import './BottomNav.css';
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import {Paper, SpeedDial} from '@mui/material';

import HomeIcon from '@mui/icons-material/Home';
import ExploreIcon from '@mui/icons-material/Explore';
import RewardIcon from '@mui/icons-material/Redeem';
import ContentIcon from '@mui/icons-material/DynamicFeed';
import PersonIcon from '@mui/icons-material/Person';
import CreateIcon from '@mui/icons-material/AddCircleOutline';

import BottomNavData from 'data/navigation/bottom-nav.json';
import profileData from 'data/profile/profile-data.json';

// components
import Link from 'next/link';
import CreateWidget from '../content/create/CreateWidget';
import SelectProfileWidget from '../../profile/SelectProfileWidget';
import {getLocalizedLink} from '@/utils/UrlMove';
import {setSkipContentInit} from '@/redux-store/slices/ContentSelection';
import {useDispatch} from 'react-redux';

export default function BottomNav() {
  const dispatch = useDispatch();
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [profileDrawerOpen, setProfileDrawerOpen] = React.useState(false);
  const [timer, setTimer] = React.useState<NodeJS.Timeout | null>(null);

  const toggleDrawer = (open: boolean) => {
    setDrawerOpen(open);
  };

  const handleNavigationChange = (event: React.SyntheticEvent, newValue: number) => {
    setSelectedIndex(newValue);
  };

  const handleClick = (index: number) => {
    setSelectedIndex(index);
  };

  const toggleProfileDrawer = (open: boolean) => {
    setProfileDrawerOpen(open);
  };

  const handleLongPressStart = () => {
    const timeout = setTimeout(() => {
      toggleProfileDrawer(true); // 2초 후 DrawerSelectProfile 열기
    }, 2000); // 2초
    setTimer(timeout);
  };
  const handleLongPressEnd = () => {
    if (timer) {
      clearTimeout(timer); // 버튼을 누르다 떼면 타이머 초기화
    }
    setTimer(null);
  };

  // 아이콘 문자열을 JSX.Element로 변환하는 함수
  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case '<HomeIcon />':
        return <HomeIcon />;
      case '<ExploreIcon />':
        return <ExploreIcon />;
      case '<RedeemIcon />':
        return <RewardIcon />;
      case '<ContentIcon />':
        return <ContentIcon />;
      case '<PersonIcon />':
        return <PersonIcon />;
      default:
        return <PersonIcon />;
    }
  };

  return (
    <footer>
      <Paper className="bottomNav" elevation={3} sx={{maxWidth: '402px', margin: '0 auto'}}>
        <Box className="bottomNavBox">
          <BottomNavigation showLabels value={selectedIndex} onChange={handleNavigationChange}>
            {BottomNavData.map((button, index) => (
              <BottomNavigationAction
                key={index}
                label={button.label}
                icon={getIconComponent(button.icon)}
                component={Link}
                href={getLocalizedLink(button.link)}
                onClick={index !== BottomNavData.length - 1 ? () => handleClick(index) : undefined}
                onMouseDown={index === BottomNavData.length - 1 ? handleLongPressStart : undefined}
                onMouseUp={index === BottomNavData.length - 1 ? handleLongPressEnd : undefined}
                onMouseLeave={index === BottomNavData.length - 1 ? handleLongPressEnd : undefined}
                // 모바일 대응
                onTouchStart={index === BottomNavData.length - 1 ? handleLongPressStart : undefined}
                onTouchEnd={index === BottomNavData.length - 1 ? handleLongPressEnd : undefined}
                onTouchCancel={index === BottomNavData.length - 1 ? handleLongPressEnd : undefined}
                showLabel
              />
            ))}
          </BottomNavigation>
        </Box>
        <SpeedDial
          ariaLabel="Create SpeedDial"
          sx={{
            position: 'fixed',
            bottom: 80,
            right: 16,
          }}
          icon={<CreateIcon />}
          onClick={() => {
            dispatch(setSkipContentInit(false));
            toggleDrawer(!drawerOpen);
          }}
        />
        <CreateWidget open={drawerOpen} onClose={() => toggleDrawer(false)} />
        <SelectProfileWidget
          open={profileDrawerOpen}
          onClose={() => toggleProfileDrawer(false)}
          profiles={profileData}
          isEditing={true}
        />
      </Paper>
    </footer>
  );
}
