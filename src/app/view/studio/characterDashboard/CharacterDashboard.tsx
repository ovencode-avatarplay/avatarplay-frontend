'use client';

import React, {useEffect, useLayoutEffect, useState} from 'react';
import {useDispatch} from 'react-redux';

// Components
import StudioTopMenu from '../StudioDashboardMenu';
import CharacterGrid from './CharacterGrid';
import CharacterDashboardFooter from '.././StudioDashboardFooter';
import StudioFilter from '../StudioFilter';

// MUI, Styles
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from '@mui/material';
import styles from './CharacterDashboard.module.css';
import StarIcon from '@mui/icons-material/Star';

import EditIcon from '@mui/icons-material/Edit';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import DeleteIcon from '@mui/icons-material/Delete';

// Network
import {
  CreateCharacterReq,
  DeleteCharacterReq,
  GetCharacterInfoReq,
  sendCreateCharacter,
  sendDeleteCharacter,
  sendGetCharacterInfo,
  sendGetCharacterList,
} from '@/app/NetWork/CharacterNetwork';

// Link
import {useRouter, useSearchParams} from 'next/navigation';
import ModifyCharacterModal from './ModifyCharacterModal';
import CharacterGalleryModal from './CharacterGalleryModal';
import {CharacterInfo} from '@/redux-store/slices/EpisodeInfo';

const CharacterDashboard: React.FC = () => {
  const [selectedCharacterId, setSelectedCharacterId] = useState<number | null>(null);
  const [modifyOpen, setModifyOpen] = useState(false);
  const [isModifyMode, setIsModifyMode] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('filter1');
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);

  const dispatch = useDispatch();
  const router = useRouter();
  const searchParam = useSearchParams();

  const filters = [
    {value: 'filter1', label: 'Filter 1'},
    {value: 'filter2', label: 'Filter 2'},
    {value: 'filter3', label: 'Filter 3'},
  ];

  const [characters, setCharacters] = useState<CharacterInfo[] | undefined>();
  const [currentSelectedCharacter, setCurrentSelectedCharacter] = useState<CharacterInfo | undefined>();

  // 렌더링 전에 Init 실행
  useLayoutEffect(() => {
    Init();
  }, []);

  function Init() {
    getCharacterList();
  }

  //#region  Data
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

  // Id로 캐릭터 정보를 가져옴
  const getCharacterInfo = async (id: number) => {
    setLoading(true);

    try {
      const req: GetCharacterInfoReq = {characterId: id};
      const response = await sendGetCharacterInfo(req);

      if (response.data) {
        const characterInfo: CharacterInfo = response.data?.characterInfo;
        setCurrentSelectedCharacter(characterInfo);
      } else {
        throw new Error(`No characterInfo in response : ${id}`);
      }
    } catch (error) {
      console.error('Error get Character Info by Id :', error);
    } finally {
      setLoading(false);
    }
  };

  // 현재 선택된 캐릭터의 정보를 수정함 (재생성 등)
  const updateCharacterInfo = async (newinfo: CharacterInfo, debugparam: string) => {
    setLoading(true);
    try {
      if (currentSelectedCharacter) {
        const req: CreateCharacterReq = {characterInfo: newinfo, debugParameter: debugparam /*, createOption: []*/};
        const response = await sendCreateCharacter(req);

        if (response.data) {
          const characterInfo: CharacterInfo = response.data?.characterInfo;
          setCurrentSelectedCharacter(characterInfo);
        } else {
          throw new Error(`No characterInfo in response `);
        }
      }
    } catch (error) {
      console.error('Error modify Character Info', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setCurrentSelectedCharacter(currentSelectedCharacter);
  }, [currentSelectedCharacter]);
  //#endregion

  //#region  handler

  const handleCharacterSelect = (id: number) => {
    setSelectedCharacterId(id);
  };

  //#region  Modify
  const handleModifyClick = async () => {
    if (selectedCharacterId === null || selectedCharacterId === -1) {
      alert('Please select a character to modify.');
      return;
    }

    alert('Modify is not working now');
    // Modify 용도의 api 생성 전까지 막아둠
    // await getCharacterInfo(selectedCharacterId);

    // setIsModifyMode(true);
    // setModifyOpen(true);
  };

  const handleCloseModify = () => {
    setModifyOpen(false);
  };
  //#endregion

  //#region  Gallery
  const handleGalleryClick = async () => {
    if (selectedCharacterId === null || selectedCharacterId === -1) {
      alert('Please select a character to view the gallery.');
      return;
    }

    await getCharacterInfo(selectedCharacterId);

    setGalleryOpen(true);
  };

  const handleCloseGallery = () => {
    setGalleryOpen(false);
  };
  //#endregion

  //#region  Delete
  const handleDeleteClick = () => {
    setIsDialogOpen(true); // 팝업 열기
  };

  const handleDeleteDialogClose = () => {
    setIsDialogOpen(false); // 팝업 닫기
    setSelectedCharacterId(null);
  };

  const handleConfirmDelete = async () => {
    if (selectedCharacterId === null) return;

    const characterName = characters?.find(char => char.id === selectedCharacterId)?.name || 'Unknown';

    const payload: DeleteCharacterReq = {
      characterId: selectedCharacterId ? selectedCharacterId : 0,
    };

    try {
      // API 호출
      const response = await sendDeleteCharacter(payload);

      if (response) {
        // UI에서 삭제된 캐릭터 제거
        setCharacters(prev => prev?.filter(char => char.id !== selectedCharacterId));
        setSelectedCharacterId(null);
        alert(`Character "${characterName}" deleted successfully.`);

        handleDeleteDialogClose();
      }
    } catch (error) {
      console.error('Error deleting character:', error);
      alert(`Failed to delete character "${characterName}". Please try again.`);
    }
  };
  //#endregion

  //#region  TopMenu
  const handleCreateClick = () => {
    const currentLang = searchParam.get(':lang') || 'en';
    router.push(`/${currentLang}/create/character`);
  };

  const handleFilterChange = (value: string) => {
    setSelectedFilter(value);
  };
  //#endregion

  //#endregion

  const buttons = [
    {icon: <EditIcon />, text: 'Edit', onClick: handleModifyClick},
    {icon: <PhotoLibraryIcon />, text: 'Gallery', onClick: handleGalleryClick},
    {icon: <DeleteIcon />, text: 'Delete', onClick: handleDeleteClick},
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

      {/* CharacterGallery */}
      {currentSelectedCharacter && (
        <CharacterGalleryModal
          open={galleryOpen}
          onClose={handleCloseGallery}
          characterData={currentSelectedCharacter}
          refreshCharacter={getCharacterInfo}
        />
      )}

      {/* ModifyCharacter Drawer */}
      <ModifyCharacterModal open={modifyOpen} onClose={handleCloseModify} isModify={isModifyMode} />

      {/* Dialog */}
      <Dialog open={isDialogOpen} onClose={handleDeleteDialogClose}>
        <DialogTitle>Discard Character '{currentSelectedCharacter?.name}'?</DialogTitle>
        <DialogContent sx={{justifyContent: 'center'}}>
          <DialogContentText>
            All Data of this character will be deleted.
            <br />
            Are you sure?
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{justifyContent: 'center'}}>
          <Button onClick={handleDeleteDialogClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error">
            Okay
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CharacterDashboard;
