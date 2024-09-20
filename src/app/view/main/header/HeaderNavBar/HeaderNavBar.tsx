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
        <div className="user-profile">
          <Avatar alt="User Profile" src="/path/to/user/image.jpg" />
          <div className="notification-dot"></div>
        </div>
      </div>
    </header>
  );
};

export default HeaderNavBar;
