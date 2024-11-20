'use client';

import React from 'react';

// Components
import StudioTopMenu from '../StudioDashboardMenu';
import CharacterGrid from './CharacterGrid';
import CharacterDashboardFooter from '.././StudioDashboardFooter';

// MUI, Styles
import styles from './CharacterDashboard.module.css';
import StarIcon from '@mui/icons-material/Star';

const CharacterDashboard: React.FC = () => {
  return (
    <div className={styles.dashboard}>
      <StudioTopMenu icon={<StarIcon />} text="Character" />
      <CharacterGrid />
      <CharacterDashboardFooter />
    </div>
  );
};

export default CharacterDashboard;
