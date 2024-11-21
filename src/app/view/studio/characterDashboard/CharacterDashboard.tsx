'use client';

import React from 'react';

// Components
import StudioTopMenu from '../StudioDashboardMenu';
import CharacterGrid from './CharacterGrid';
import CharacterDashboardFooter from '.././StudioDashboardFooter';
import CharacterItemData from './CharacterGrid';

// MUI, Styles
import styles from './CharacterDashboard.module.css';
import StarIcon from '@mui/icons-material/Star';

const CharacterDashboard: React.FC = () => {
  const characters = [
    {
      id: 1,
      status: 'Publish',
      image: '/Images/001.png',
      name: 'Character 1',
      gender: 'Male',
    },
    {
      id: 2,
      status: 'Draft',
      image: '/Images/001.png',
      name: 'Character 2',
      gender: 'Female',
    },
    {
      id: 3,
      status: 'Draft',
      image: '/Images/001.png',
      name: 'Character 3',
      gender: 'Female',
    },
    {
      id: 4,
      status: 'Draft',
      image: '/Images/001.png',
      name: 'Character 4',
      gender: 'Female',
    },
    {
      id: 5,
      status: 'Draft',
      image: '/Images/001.png',
      name: 'Character 5',
      gender: 'Female',
    },
    {
      id: 6,
      status: 'Draft',
      image: '/Images/001.png',
      name: 'Character 6',
      gender: 'Female',
    },
    {
      id: 7,
      status: 'Draft',
      image: '/Images/001.png',
      name: 'Character 7',
      gender: 'Female',
    },
    {
      id: 8,
      status: 'Draft',
      image: '/Images/001.png',
      name: 'Character 8',
      gender: 'Female',
    },
  ];

  const handleCharacterSelect = (id: number) => {
    console.log('Selected Character ID:', id);
  };
  return (
    <div className={styles.dashboard}>
      <StudioTopMenu icon={<StarIcon />} text="Character" />
      <CharacterGrid characters={characters} onCharacterSelect={handleCharacterSelect} />
      <CharacterDashboardFooter />
    </div>
  );
};

export default CharacterDashboard;
