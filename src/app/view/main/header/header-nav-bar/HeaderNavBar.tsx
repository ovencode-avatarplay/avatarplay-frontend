"use client";

import React from 'react';
import { Button } from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Avatar from '@mui/material/Avatar';
import './HeaderNavBar.css';

const HeaderNavBar = () => {
  return (
    <header className="header-nav-bar">
      <div className="logo">Avatar Play</div>
      <div className="right-section">
        <Button>
          <NotificationsIcon />
        </Button>
        <div className="user-profile">  {/* 원래는 SideBar를 여는 역할이지만 SideBar가 기획쪽에서 논의할 내용이 있기 때문에 임시처리로 UserDataEdit 로 넘김 */}
          <Avatar alt="User Profile" src="/path/to/user/image.jpg" />
          <div className="notification-dot"></div>
        </div>
      </div>
    </header>
  );
};

export default HeaderNavBar;
