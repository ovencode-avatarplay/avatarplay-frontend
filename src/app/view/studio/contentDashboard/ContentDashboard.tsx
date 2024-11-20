'use client';

import React from 'react';
import StudioTopMenu from '../StudioDashboardMenu'; // 상단 메뉴 컴포넌트
import ContentList from './ContentList';
import ContentDashboardFooter from '.././StudioDashboardFooter'; // 하단 버튼 컴포넌트
import styles from './ContentDashboard.module.css';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';

const ContentDashboard: React.FC = () => {
  return (
    <div className={styles.dashboard}>
      <StudioTopMenu icon={<AutoStoriesIcon />} text="Story" />
      <ContentList />
      <ContentDashboardFooter />
    </div>
  );
};

export default ContentDashboard;
