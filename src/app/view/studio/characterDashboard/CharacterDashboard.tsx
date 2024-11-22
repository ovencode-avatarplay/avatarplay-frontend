'use client';

import React, {useLayoutEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {CharacterInfo} from '@/redux-store/slices/EpisodeInfo';

// Components
import StudioTopMenu from '../StudioDashboardMenu';
import CharacterGrid from './CharacterGrid';
import CharacterDashboardFooter from '.././StudioDashboardFooter';
import ModifyCharacterDrawer from './ModifyCharacterDrawer';
import StudioFilter from '../StudioFilter';

// MUI, Styles
import styles from './CharacterDashboard.module.css';
import StarIcon from '@mui/icons-material/Star';

import EditIcon from '@mui/icons-material/Edit';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import DeleteIcon from '@mui/icons-material/Delete';

// Network
import {DeleteCharacterReq, sendDeleteCharacter, sendGetCharacterList} from '@/app/NetWork/CharacterNetwork';

// Link
import {useRouter, useSearchParams} from 'next/navigation';

const CharacterDashboard: React.FC = () => {
  const [selectedCharacterId, setSelectedCharacterId] = useState(-1);
  const [modifyOpen, setModifyOpen] = useState(false);
  const [isModifyMode, setIsModifyMode] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('filter1');
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();
  const searchParam = useSearchParams();

  const filters = [
    {value: 'filter1', label: 'Filter 1'},
    {value: 'filter2', label: 'Filter 2'},
    {value: 'filter3', label: 'Filter 3'},
  ];

  const [characters, setCharacters] = useState<CharacterInfo[] | undefined>();

  // 렌더링 전에 Init 실행
  useLayoutEffect(() => {
    Init();
  }, []);

  function Init() {
    getCharacterList();
  }

  // 현재 유저가 가진 캐릭터를 모두 가져옴
  const getCharacterList = async () => {
    setLoading(true);

    try {
      const response = await sendGetCharacterList({});

      if (response.data) {
        const characterInfoList: CharacterInfo[] = response.data?.characterInfoList;
        setCharacters(characterInfoList);
      } else {
        throw new Error(`No contentInfo in response for ID: `);
      }
    } catch (error) {
      console.error('Error fetching content by user ID:', error);
    } finally {
      setLoading(false);
    }
  };
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

  const handleDelete = async () => {
    if (selectedCharacterId === -1) {
      alert('Please select a character to delete.');
      return;
    }

    const characterName = characters?.find(char => char.id === selectedCharacterId)?.name || 'Unknown';

    const payload: DeleteCharacterReq = {
      characterId: selectedCharacterId,
    };

    try {
      // 네트워크 요청 전 사용자 확인
      const confirmDelete = window.confirm(
        `Are you sure you want to delete the character: ${characterName} (ID: ${selectedCharacterId})?`,
      );

      if (!confirmDelete) return;

      // API 호출
      const response = await sendDeleteCharacter(payload);

      if (response) {
        console.log(`Character deleted successfully: ${characterName} (ID: ${selectedCharacterId})`);

        // UI에서 삭제된 캐릭터 제거
        setCharacters(prev => prev?.filter(char => char.id !== selectedCharacterId));
        setSelectedCharacterId(-1);
        alert(`Character "${characterName}" deleted successfully.`);
      }
    } catch (error) {
      console.error('Error deleting character:', error);
      alert(`Failed to delete character "${characterName}". Please try again.`);
    }
  };

  const handleCloseModify = () => {
    setModifyOpen(false);
  };

  const handleCreateClick = () => {
    const currentLang = searchParam.get(':lang') || 'en';
    router.push(`/${currentLang}/create/character`);
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
      <CharacterGrid characters={characters ? characters : undefined} onCharacterSelect={handleCharacterSelect} />
      <CharacterDashboardFooter buttons={buttons} />

      {/* ModifyCharacter Drawer */}
      <ModifyCharacterDrawer open={modifyOpen} onClose={handleCloseModify} isModify={isModifyMode} />
    </div>
  );
};

export default CharacterDashboard;
