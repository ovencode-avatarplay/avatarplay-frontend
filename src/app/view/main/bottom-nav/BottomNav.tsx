'use client';

import * as React from 'react';

// style, mui
import styles from './BottomNav.module.css';
import {SpeedDial} from '@mui/material';

import CreateIcon from '@mui/icons-material/AddCircleOutline';

import profileData from 'data/profile/profile-data.json';

// components
import Link from 'next/link';
import CreateWidget from '../content/create/CreateWidget';
import SelectProfileWidget from '../../profile/SelectProfileWidget';
import {getLocalizedLink} from '@/utils/UrlMove';
import {setSkipContentInit} from '@/redux-store/slices/ContentSelection';
import {useDispatch} from 'react-redux';
import {BoldContents, BoldExplore, BoldHome, BoldProfile, BoldReward} from '@ui/Icons';

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

  const buttonData = [
    {label: 'Home', icon: BoldHome.src, link: '/main/homefeed'},
    {label: 'Explore', icon: BoldExplore.src, link: '/main/explore'},
    {label: 'Reward', icon: BoldReward.src, link: '/main/game'},
    {label: 'Content', icon: BoldContents.src, link: '/main/mycontent'},
    {label: 'My', icon: BoldProfile.src, link: '/profile'},
  ];

  return (
    <footer>
      <div className={styles.bottomNav}>
        <div className={styles.bottomNavBox}>
          {buttonData.map((button, index) => (
            <Link href={getLocalizedLink(button.link)}>
              <button
                className={styles.navButton}
                onClick={index !== buttonData.length - 1 ? () => handleClick(index) : undefined}
              >
                <img className={styles.buttonIcon} src={button.icon} />
              </button>
            </Link>
          ))}
          {/* 
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
          </BottomNavigation> */}
        </div>
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
      </div>

      {/* <div className={styles.bottomNav}>
        <div className={styles.bottomNavBox}>
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
        </div>
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
      </div> */}
    </footer>
  );
}
