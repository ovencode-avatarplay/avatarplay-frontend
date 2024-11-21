'use client';

import React, {useLayoutEffect, useState} from 'react';

// Components
import StudioTopMenu from '../StudioDashboardMenu';
import CharacterGrid from './CharacterGrid';
import CharacterDashboardFooter from '.././StudioDashboardFooter';
import CharacterItemData from './CharacterGrid';
import ModifyCharacterDrawer from './ModifyCharacterDrawer';

// MUI, Styles
import styles from './CharacterDashboard.module.css';
import StarIcon from '@mui/icons-material/Star';

import EditIcon from '@mui/icons-material/Edit';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import DeleteIcon from '@mui/icons-material/Delete';
import StudioFilter from '../StudioFilter';
import {GetCharacterListRes, sendGetCharacterList} from '@/app/NetWork/CharacterNetwork';
import {CharacterInfo} from '@/redux-store/slices/EpisodeInfo';
import {useDispatch} from 'react-redux';

const CharacterDashboard: React.FC = () => {
  const [selectedCharacterId, setSelectedCharacterId] = useState(-1);
  const [modifyOpen, setModifyOpen] = useState(false);
  const [isModifyMode, setIsModifyMode] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('filter1');
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  const filters = [
    {value: 'filter1', label: 'Filter 1'},
    {value: 'filter2', label: 'Filter 2'},
    {value: 'filter3', label: 'Filter 3'},
  ];

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

  // 렌더링 전에 Init 실행
  // useLayoutEffect(() => {
  //   Init();
  // }, []);

  // function Init() {
  //   getCharacterList();
  // }

  // 현재 유저가 가진 컨텐츠를 모두 가져옴 (DashBoard 에서 사용하기 위함)
  // const getCharacterList = async () => {
  //   setLoading(true);

  //   try {
  //     const response = await sendGetCharacterList();

  //     if (response.data.data) {
  //       const characterList: CharacterInfo[] = response.data.contentDashBoardList;

  //     } else {
  //       throw new Error(`No contentInfo in response for ID: `);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching content by user ID:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const handleCharacterSelect = (id: number) => {
    console.log('Selected Character ID:', id);
    setSelectedCharacterId(id);
  };

  const handleModifyClick = () => {
    if (selectedCharacterId === -1) {
      alert('Please select a character to modify.');
      return;
    }
    console.log(`Editing character ID: ${selectedCharacterId}`);
    setIsModifyMode(true);
    setModifyOpen(true);
  };

  const handleGallery = () => {
    if (selectedCharacterId === -1) {
      alert('Please select a character to view the gallery.');
      return;
    }
    console.log(`Opening gallery for character ID: ${selectedCharacterId}`);
  };

  const handleDelete = () => {
    if (selectedCharacterId === -1) {
      alert('Please select a character to delete.');
      return;
    }
    const characterName = characters.find(char => char.id === selectedCharacterId)?.name || 'Unknown';
    console.log(`Deleting character: ${characterName} (ID: ${selectedCharacterId})`);
  };

  const handleCloseModify = () => {
    setModifyOpen(false);
  };

  const handleCreateClick = () => {
    setIsModifyMode(false);
    setModifyOpen(true);
  };

  const handleFilterChange = (value: string) => {
    console.log('Selected filter:', value);
    setSelectedFilter(value);
  };

  const buttons = [
    {icon: <EditIcon />, text: 'Edit', onClick: handleModifyClick},
    {icon: <PhotoLibraryIcon />, text: 'Gallery', onClick: handleGallery},
    {icon: <DeleteIcon />, text: 'Delete', onClick: handleDelete},
  ];

  return (
    <div className={styles.dashboard}>
      <StudioTopMenu icon={<StarIcon />} text="Character" />

      <StudioFilter
        filters={filters}
        selectedFilter={selectedFilter}
        onFilterChange={handleFilterChange}
        onCreateClick={handleCreateClick}
      />
      <CharacterGrid characters={characters} onCharacterSelect={handleCharacterSelect} />
      <CharacterDashboardFooter buttons={buttons} />

      {/* ModifyCharacter Drawer */}
      <ModifyCharacterDrawer open={modifyOpen} onClose={handleCloseModify} isModify={isModifyMode} />
    </div>
  );
};

export default CharacterDashboard;
