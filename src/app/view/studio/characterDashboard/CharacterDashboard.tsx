'use client';

import React, {useEffect, useLayoutEffect, useState} from 'react';

// Components
import CharacterGrid from './CharacterGrid';

//  Styles
import styles from './CharacterDashboard.module.css';
// Network
import {
  CreateCharacterReq,
  DeleteCharacterReq,
  GetCharacterInfoReq,
  GetCharacterListReq,
  sendCreateCharacter,
  sendDeleteCharacter,
  sendGetCharacterInfo,
  sendGetCharacterList,
} from '@/app/NetWork/CharacterNetwork';

// Link
import {useRouter} from 'next/navigation';
import ModifyCharacterModal from './ModifyCharacterModal';
import CharacterGalleryModal from './CharacterGalleryModal';
import LoadingOverlay from '@/components/create/LoadingOverlay';
import {getCurrentLanguage, pushLocalizedRoute} from '@/utils/UrlMove';
import {CharacterInfo} from '@/redux-store/slices/StoryInfo';
import CreateDrawerHeader from '@/components/create/CreateDrawerHeader';
import CustomButton from '@/components/layout/shared/CustomButton';
import {LinePlus} from '@ui/Icons';
import CreateFilterButton from '@/components/create/CreateFilterButton';
import SelectDrawer, {SelectDrawerItem} from '@/components/create/SelectDrawer';
const CharacterDashboard: React.FC = () => {
  const [selectedCharacterId, setSelectedCharacterId] = useState<number | null>(null);
  const [modifyOpen, setModifyOpen] = useState(false);
  const [isModifyMode, setIsModifyMode] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState('filter1');
  const [loading, setLoading] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);

  const router = useRouter();

  const [characters, setCharacters] = useState<CharacterInfo[] | undefined>();
  const [currentSelectedCharacter, setCurrentSelectedCharacter] = useState<CharacterInfo | undefined>();
  const [sortedCharacters, setSortedCharacters] = useState<CharacterInfo[] | undefined>(characters);
  const [resultCharacters, setResultCharacters] = useState<CharacterInfo[] | undefined>(characters);
  const [refreshReq, setRefreshReq] = useState<boolean>(false);

  const [filterPublishOpen, setFilterPublishOpen] = useState<boolean>(false);
  const [selectedPublish, setSelectedPublish] = useState<number>(0);

  const publishItems: SelectDrawerItem[] = [
    {
      name: 'All',
      onClick: () => {
        setSelectedPublish(0);
      },
    },
    {
      name: 'Private',
      onClick: () => {
        setSelectedPublish(1);
      },
    },
    {
      name: 'Unlisted',
      onClick: () => {
        setSelectedPublish(2);
      },
    },
    {
      name: 'Public',
      onClick: () => {
        setSelectedPublish(3);
      },
    },
  ];
  const [filterOptionOpen, setFilterOptionOpen] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<number>(0);

  const optionItems: SelectDrawerItem[] = [
    {
      name: 'Alphabetically',
      onClick: () => {
        console.log('Alphabetically Selected');
        setSelectedOption(0);
      },
    },
    {
      name: 'Last Modified',
      onClick: () => {
        console.log('Last Modified Selected');
        setSelectedOption(1);
      },
    },
    {
      name: 'Created On',
      onClick: () => {
        console.log('Created On Selected');
        setSelectedOption(2);
      },
    },
  ];

  const getFilteredAndSortedCharacter = () => {
    let filtered = characters;

    // 필터링 (publishType에 따른 필터링)
    if (selectedPublish === 1) {
      filtered = filtered?.filter(item => item.visibilityType === 0); // Private
    } else if (selectedPublish === 2) {
      filtered = filtered?.filter(item => item.visibilityType === 1); // Unlisted
    } else if (selectedPublish === 3) {
      filtered = filtered?.filter(item => item.visibilityType === 2); // Public
    }

    // 정렬 적용
    if (selectedOption === 0) {
      filtered = filtered?.sort((a, b) => a.name.localeCompare(b.name)); // 알파벳 순서
    } else if (selectedOption === 1) {
      filtered = filtered?.sort((a, b) => {
        // updateAt이 null인 경우를 처리 null이면 가장 작은 값
        const dateA = a.updateAt ? new Date(a.updateAt).getTime() : -Infinity;
        const dateB = b.updateAt ? new Date(b.updateAt).getTime() : -Infinity;
        return dateB - dateA; // 수정일 역순
      });
    } else if (selectedOption === 2) {
      filtered = filtered?.sort((a, b) => {
        // createAt이 null인 경우를 처리 null이면 가장 작은 값
        const dateA = a.createAt ? new Date(a.createAt).getTime() : -Infinity;
        const dateB = b.createAt ? new Date(b.createAt).getTime() : -Infinity;
        return dateB - dateA; // 생성일 역순
      });
    }

    return filtered;
  };

  useEffect(() => {
    if (filterOptionOpen == false && filterPublishOpen == false) {
      const filteredAndSorted = getFilteredAndSortedCharacter();
      setSortedCharacters(filteredAndSorted);
      setRefreshReq(true);
    }
  }, [filterOptionOpen, filterPublishOpen, characters]);

  useEffect(() => {
    if (refreshReq) {
      setResultCharacters(sortedCharacters);
      setRefreshReq(false);
    }
  }, [refreshReq]);

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
      const characterListreq: GetCharacterListReq = {
        languageType: getCurrentLanguage(),
      };
      const response = await sendGetCharacterList(characterListreq);

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
      const req: GetCharacterInfoReq = {languageType: getCurrentLanguage(), characterId: id};
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
        const req: CreateCharacterReq = {
          languageType: getCurrentLanguage(),
          characterInfo: newinfo,
          debugParameter: debugparam /*, createOption: []*/,
        };
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

  const handleCharacterSelect = async (id: number) => {
    setSelectedCharacterId(id);

    await getCharacterInfo(id);

    setGalleryOpen(true);
  };

  //#region  Modify
  const handleModifyClick = async (id: number) => {
    setSelectedCharacterId(id);

    if (id === null || id === -1) {
      alert('Please select a character to modify.');
      return;
    }

    // alert('Modify is not working now');
    // Modify 용도의 api 생성 전까지 막아둠

    // Page 이동으로 수정
    pushLocalizedRoute(`/update/character/${id}`, router);

    // Page 이동으로 수정
    // await getCharacterInfo(id);

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

  const handleConfirmDelete = async (id: number) => {
    if (selectedCharacterId === null) return;

    const characterName = characters?.find(char => char.id === selectedCharacterId)?.name || 'Unknown';

    const payload: DeleteCharacterReq = {
      characterId: selectedCharacterId ? selectedCharacterId : 0,
    };

    try {
      // API 호출
      const response = await sendDeleteCharacter(payload);

      if (response) {
        if (response.resultCode === 1) {
          alert(`캐릭터 "${characterName}"가 에피소드에서 사용되고 있습니다. 에피소드를 먼저 지우세요`);
        } else {
          // UI에서 삭제된 캐릭터 제거
          setCharacters(prev => prev?.filter(char => char.id !== selectedCharacterId));
          setSelectedCharacterId(null);
          alert(`캐릭터 "${characterName}"가 성공적으로 지워졌습니다.`);
        }
        setSelectedCharacterId(null);
      }
    } catch (error) {
      console.error('Error deleting character:', error);
      alert(`캐릭터 "${characterName}" 삭제를 실패했습니다. 다시 해보고 리포트 해주세요`);
    }
  };
  //#endregion

  //#region  TopMenu
  const handleGoHomeClick = () => {
    //router.push(`/${currentLang}/create/character`);
    pushLocalizedRoute('/main/homefeed', router);
  };

  const handleCreateClick = () => {
    //router.push(`/${currentLang}/create/character`);
    pushLocalizedRoute('/create/character', router);
  };

  const handleFilterChange = (value: string) => {
    setSelectedFilter(value);
  };
  //#endregion

  //#endregion

  return (
    <div className={styles.dashboard}>
      {/* <StudioTopMenu icon={<StarIcon />} text="Character" /> */}

      <CreateDrawerHeader title="Character" onClose={handleGoHomeClick}>
        <CustomButton
          size="Small"
          type="Primary"
          state="IconLeft"
          customClassName={[styles.addButton]}
          icon={LinePlus.src}
          onClick={handleCreateClick}
        >
          Create
        </CustomButton>
      </CreateDrawerHeader>
      <div className={styles.filterContainer}>
        <CreateFilterButton
          name=""
          selectedItem={publishItems[selectedPublish]}
          onClick={() => setFilterPublishOpen(true)}
          style={{width: '100px'}}
        />
        <CreateFilterButton
          name=""
          selectedItem={optionItems[selectedOption]}
          onClick={() => setFilterOptionOpen(true)}
          style={{width: '140px'}}
        />
      </div>
      <CharacterGrid
        characters={resultCharacters ? resultCharacters : undefined}
        onCharacterSelect={handleCharacterSelect}
        style={{marginTop: '0px'}}
        canEdit={true}
        onClickEdit={handleModifyClick}
        onClickDelete={handleConfirmDelete}
        showVisibilityType={true}
      />

      {/* CharacterGallery */}
      {currentSelectedCharacter && (
        <CharacterGalleryModal
          open={galleryOpen}
          onClose={handleCloseGallery}
          characterData={currentSelectedCharacter}
          refreshCharacter={getCharacterInfo}
          refreshCharacterList={getCharacterList}
        />
      )}

      {/* ModifyCharacter Drawer */}
      <ModifyCharacterModal
        open={modifyOpen}
        onClose={handleCloseModify}
        isModify={isModifyMode}
        characterInfo={currentSelectedCharacter}
        refreshCharacterList={getCharacterList}
        onDelete={() => {
          // handleConfirmDelete();
          handleCloseModify();
        }}
      />

      <SelectDrawer
        items={publishItems}
        isOpen={filterPublishOpen}
        onClose={() => {
          setFilterPublishOpen(false);
        }}
        selectedIndex={selectedPublish}
      />

      <SelectDrawer
        items={optionItems}
        isOpen={filterOptionOpen}
        onClose={() => {
          setFilterOptionOpen(false);
        }}
        selectedIndex={selectedOption}
      />

      <LoadingOverlay loading={loading} />
    </div>
  );
};

export default CharacterDashboard;
